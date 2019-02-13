import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';

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

  constructor(protected baseService:BaseService) {
    
  }

  ngOnInit() {
  }

  getLanguageValue(key:string){
   return this.baseService.languageService.getValue(key);
  }
  
  changeLanguage(language:string){
    this.baseService.languageService.setCulture(language);
  }

  isLogged(){
    return this.baseService.authenticationService.isLoggedIn();
  }
}
