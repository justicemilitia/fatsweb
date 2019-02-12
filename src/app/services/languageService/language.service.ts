import { Injectable } from "@angular/core";
import Language from "../../models/Language";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})

export class LanguageService {
  
  languages: Language[] = [];
  path: string = "../../../assets/language/language.json";
  locale: string = "tr";
   
  get language() {
    let lang = localStorage.getItem("language");
    return lang == null ? "tr" : lang;
  }

  constructor(private httpclient: HttpClient) {
    this.LoadLanguages();
  }

  LoadLanguages() {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Control-Allow-Origin", "*");
    this.httpclient.get(this.path, { headers: headers }).subscribe(data => {
      this.languages = <Language[]>data;
    });
  }

  setCulture(culture: string): void {
    this.locale = culture;
    localStorage.setItem("language", culture);
  }

  getValue(key: string): string {

    if (this.language.length == 0)
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

    return "";
    
  }

}
