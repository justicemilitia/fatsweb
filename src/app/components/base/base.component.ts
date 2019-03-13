import { Component, OnInit } from "@angular/core";
import { BaseService } from "../../services/base.service";
import * as pages from "../../declarations/page-values";
import { SystemLanguage } from 'src/app/models/SystemLanguage';
import { Firm } from '../../models/Firm';

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

  public Version:string = "6.0.100";

  public Firms = [{
    Name:'Trinoks',
    Id:1
  },{
    Name:'Vector',
    Id:2
  }]

  public Firm:{};

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

  constructor(protected baseService: BaseService) {
    this.Firm = this.Firms[0];
   }

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

  changeFirm(firmId:number) {
    this.Firm = this.Firms.find(x=>x.Id == Number(firmId));
  }

  pageRoute(key: string) {
    return this.baseService.authenticationService.pageRoute(key);
  }

}
