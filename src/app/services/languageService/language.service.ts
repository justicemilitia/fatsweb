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

  constructor(private httpclient: HttpClient) {}

  getLanguage() {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Control-Allow-Origin", "*");
    this.httpclient.get(this.path, { headers: headers }).subscribe(data => {
      this.languages = <Language[]>data;
      this.setCulture("tr");
    });
  }

  setCulture(culture: string): void {
    this.locale = culture;
  }

  getValue(key: string): string {
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
