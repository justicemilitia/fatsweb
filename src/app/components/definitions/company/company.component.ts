import { Component, OnInit } from "@angular/core";
import { CompanyService } from "../../../services/companyService/company.service";
import { BaseComponent } from 'src/app/components/base/base.component';
import { LanguageService } from 'src/app/services/languageService/language.service';
import { BaseService } from '../../../services/base.service';

@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.css"]
})
export  class CompanyComponent extends BaseComponent implements OnInit {
 

  constructor(protected baseService:BaseService ) {
    super(baseService);
  }
  private companyService: CompanyService;
  
  ngOnInit() {}

}
