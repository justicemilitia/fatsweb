import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/languageService/language.service';

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

  constructor(protected lang:LanguageService) {
    
  }

  ngOnInit() {
  }

  
  changeLanguage(language:string){
    this.lang.setCulture(language);
  }

}
