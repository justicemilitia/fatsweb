import { Injectable } from "@angular/core";
import Language from "../../models/Language";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LANGUAGE_URL } from 'src/app/declarations/service-values';

@Injectable({
  providedIn: "root"
})

export class LanguageService {

  languages: Language[] = [];
  path: string = LANGUAGE_URL;
  locale: string = "tr";

  get language() {
    let lang = localStorage.getItem("language");
    return lang == null ? "tr" : lang;
  }

  constructor(private httpclient: HttpClient) {
    this.LoadLanguages();
  }

  LoadLanguages() {
    this.httpclient.get(this.path).subscribe(data => {
      this.languages = <Language[]>data;
    });
  }

  setCulture(culture: string): void {
    this.locale = culture;
    localStorage.setItem("language", culture);
  }

  getValue(key: string): string {

    if (this.languages.length == 0)
      this.LoadLanguages();

    let item = this.languages.find(x => x.LanguageKeyword == key);
    if (item) {
      if (this.locale == "en") {
        return item.En;
      } else if (this.locale == "tr") {
        return item.Tr;
      }
      return item.Tr;
    }

    return key;

  }

}
