import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/languageService/language.service';
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

  
  changeLanguage(language:string){
    this.baseService.languageService.setCulture(language);
  }

}
