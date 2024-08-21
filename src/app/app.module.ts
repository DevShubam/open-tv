import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu'
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SetupComponent } from './setup/setup.component';
import { LoadingComponent } from './loading/loading.component';
import { SourceNameExistsValidator } from './setup/validators/source-name-exists-validator.directive';
import { NotEmptyValidatorDirective } from './setup/validators/not-empty-validator.directive';
import { ConfirmModalComponent } from './setup/confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SetupComponent,
    LoadingComponent,
    SourceNameExistsValidator,
    NotEmptyValidatorDirective,
    ConfirmModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbTooltipModule,
    ToastrModule.forRoot(),
    KeyboardShortcutsModule.forRoot(),
    MatMenuModule,
    NgbModalModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
