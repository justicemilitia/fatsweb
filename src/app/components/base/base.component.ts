import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import * as pages from '../../declarations/page-values';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-base',
  template: `
    <p>
      base works!
    </p>
  `,
  styleUrls: ['./base.component.css']
})

export abstract class BaseComponent implements OnInit {

  protected readonly PAGES = pages;

  constructor(protected baseService: BaseService) {

  }

  ngOnInit() {
  }

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

  pageRoute(key:string){
    debugger;
    
    return this.baseService.authenticationService.pageRoute(key);
  }
  errorManager(error: HttpErrorResponse) {
    switch(error.status) {
      case 401:
        this.baseService.authenticationService.logOut();
        this.baseService.errorService.redirect("/login");
      break;
    }
  }

}
