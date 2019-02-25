import { Component, OnInit, NgModule } from "@angular/core";
import { CompanyService } from "../../../services/companyService/company.service";
import { BaseComponent } from "src/app/components/base/base.component";
import { LanguageService } from "src/app/services/languageService/language.service";
import { BaseService } from "../../../services/base.service";
import {
  NgForm,
  ReactiveFormsModule,
} from "@angular/forms";

import { Company } from "src/app/models/Company";
import { Country } from "src/app/models/Country";
import { City } from "src/app/models/City";

@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [CompanyComponent],
  providers: [CompanyComponent]
})

export class CompanyComponent extends BaseComponent implements OnInit {
  countries: Country[] = [];
  cities: City[] = [];
  companies: Company[] = [];
  company: Company = new Company();

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.LoadCompanies();
  }

  ngOnInit() {
    this.ResetForm();
  }

  LoadCompanies() {
    this.baseService.companyService.GetCompanies((company: Company[]) => {
      company.forEach(e => {
        this.companies.push(e);
      });
    });
  }

  ResetForm(form?: NgForm) {
    if (form != null) this.ResetForm();
    this.company = new Company();
  }

  OnSubmit(data: NgForm) {
    debugger;
    if (data.value.CompanyId == null) this.addCompany(data);
    else this.UpdateCompany(data);
  }

  addCompany(data: NgForm) {
    debugger;
    console.log(data.value);
    this.company = <Company>data.value;
    this.baseService.companyService.InsertCompany(this.company);
    this.ResetForm();
    this.LoadCompanies();
  }

  UpdateCompany(data: NgForm) {
    this.company = <Company>data.value;
    this.baseService.companyService.UpdateCompany(this.company);
    this.LoadCompanies();
  }

  LoadDropdownList() {
    this.baseService.countryService.GetCountryList(
      countries => (this.countries = countries)
    );
    this.baseService.cityService.GetCityList(cities => (this.cities = cities));
  }

  FillCompanyModal(company: Company) {
    this.baseService.companyService.GetCompanyById(result => {
      this.company = result;
    }, company.CompanyId);
  }
}
