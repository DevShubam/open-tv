import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { invoke } from '@tauri-apps/api/core';
import { SourceType } from '../models/sourceType';
import { Source } from '../models/source';
import { open } from '@tauri-apps/plugin-dialog';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { MemoryService } from '../memory.service';
import { ErrorService } from '../error.service';
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css'
})
export class SetupComponent {
  constructor(private nav: Router,
    private toastr: ToastrService, private modalService: NgbModal, public memory: MemoryService, private error: ErrorService) { }
  loading = false;
  sourceTypeEnum = SourceType;
  source: Source = {
    source_type: SourceType.M3U,
    enabled: true
  };
  ngOnInit(): void {
  }

  switchMode(sourceType: SourceType) {
    this.source.source_type = sourceType;
  }

  goBack() {
    this.nav.navigateByUrl("settings")
  }

  async getM3U() {
    this.removeUnusedFieldsFromSource();
    const file = await open({
      multiple: false,
      directory: false,
    });
    if (file == null) {
      return;
    }
    this.loading = true;
    this.source.url = file
    try {
      await invoke("get_m3u8", { source: this.source });
      this.success();
    }
    catch (e) {
      this.error.handleError(e, "Could not parse selected file");
    }
    this.loading = false;
  }

  success() {
    this.toastr.success(`${this.source.name} successfully added`);
    this.nav.navigateByUrl("");
  }

  removeUnusedFieldsFromSource() {
    this.source.username = undefined;
    this.source.password = undefined;
  }

  async submit() {
    switch (this.source.source_type) {
      case SourceType.M3U:
        await this.getM3U()
        break;
      case SourceType.M3ULink:
        await this.getM3ULink();
        break;
      case SourceType.Xtream:
        await this.getXtream();
    }
  }

  async getM3ULink() {
    this.removeUnusedFieldsFromSource();
    this.source.url = this.source.url?.trim();
    this.loading = true;
    try {
      await invoke("get_m3u8_from_link", { source: this.source });
      this.success();
    }
    catch (e) {
      this.error.handleError(e, "Invalid URL or credentials. Please try again");
    }
    this.loading = false;
  }

  async getXtream() {
    this.loading = true;
    this.source.url = this.source.url?.trim();
    this.source.username = this.source.username?.trim();
    this.source.password = this.source.password?.trim();
    if (!this.source?.url?.startsWith('http://') && !this.source?.url?.startsWith('https://')) {
      this.source.url = `http://${this.source.url}`;
      this.toastr.info("Since the given URL lacked a protocol, http was assumed");
    }
    let url = new URL(this.source.url);
    if (url.pathname == "/") {
      let result = await this.modalService.open
        (ConfirmModalComponent, { keyboard: false, backdrop: 'static' }).result;
      if (result == "correct") {
        url.pathname = "/player_api.php";
        this.source.url = url.toString();
      }
    }
    try {
      await invoke("get_xtream", { source: this.source });
      this.success();
    }
    catch (e) {
      this.error.handleError(e, "Invalid URL or credentials. Please try again");
    }
    this.loading = false;
  }
}
