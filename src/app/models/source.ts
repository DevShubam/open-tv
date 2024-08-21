import { SourceType } from "./sourceType";

export class Source {
    id?: number;
    name?: string;
    url?: string;
    username?: string;
    password?: string;
    source_type?: SourceType;
}