import { Component, OnInit } from "@angular/core";
import { BaseService } from "../../services/base.service";
import * as pages from "../../declarations/page-values";
import { SystemLanguage } from 'src/app/models/SystemLanguage';

@Component({
  selector: "app-base",
  template: `
    <p>
      base works!
    </p>
  `,
  styleUrls: ["./base.component.css"]
})
export abstract class BaseComponent implements OnInit {

  protected readonly PAGES = pages;

  public Languages: SystemLanguage[] = [{
    Culture: 'tr',
    ImageUrl: '../../../assets/img/tr.png',
    Name: 'Türkçe'
  }, {
    Culture: 'en',
    ImageUrl: '../../../assets/img/en.png',
    Name: 'English'
  }];

  public get Language() {
    return this.Languages.find(x => x.Culture == this.baseService.languageService.language);
  }

  constructor(protected baseService: BaseService) { }

  ngOnInit() { }

  getLanguageValue(key: string) {
    return this.baseService.languageService.getValue(key);
  }

  changeLanguage(language: string) {
    this.baseService.languageService.setCulture(language);
  }

  isLogged() {
    return this.baseService.authenticationService.isLoggedIn();
  }

  isMenuAccessable(pageKeyword: string) {
    return this.baseService.authenticationService.isMenuAccessable(pageKeyword);
  }

  pageRoute(key: string) {
    debugger;

    return this.baseService.authenticationService.pageRoute(key);
  }

}
