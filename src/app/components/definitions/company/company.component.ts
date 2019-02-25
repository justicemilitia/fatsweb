import { Component, OnInit, NgModule } from "@angular/core";
import { CompanyService } from "../../../services/company-service/company.service";
import { BaseComponent } from "src/app/components/base/base.component";
import { LanguageService } from "src/app/services/language-service/language.service";
import { BaseService } from "../../../services/base.service";
import { NgForm, ReactiveFormsModule } from "@angular/forms";

import { Company } from "src/app/models/Company";
import { Country } from "src/app/models/Country";
import { City } from "src/app/models/City";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import * as $ from 'jquery';

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

  public dataTable: TreeGridTable = new TreeGridTable(
    [
      {
        columnDisplayName: "Şirket Adı",
        columnName: "Name",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Mail",
        columnName: "Email",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Adres",
        columnName: "Address",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Ülke",
        columnName: "CountryName",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Şehir",
        columnName: "CityName",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Vergi Numarası",
        columnName: "TaxNumber",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Telefon",
        columnName: "Phone",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Faks",
        columnName: "SecondPhone",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Açıklama",
        columnName: "Description",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
    ],
    {
      
    },
    {
      isDesc: false,
      column: "Name"
    }
  );

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.LoadCompanies();
  }

  ngOnInit() {
    this.ResetForm();
  }

  LoadCompanies() {
    this.baseService.companyService.GetCompanies((companies: Company[]) => {
      this.companies = companies;
      this.dataTable.TGT_loadData(this.companies);
    });
  }

  ResetForm(form?: NgForm) {
    if (form != null)
    this.company = new Company();
  }

  OnSubmit(data: NgForm) {
    if (data.value.CompanyId == null) this.addCompany(data);
    else this.UpdateCompany(data);
    this.LoadCompanies();
  }

  addCompany(data: NgForm) {  
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

  // FillCompanyModal(company: Company) {
  //   this.baseService.companyService.GetCompanyById(result => {
  //     this.company = result;
  //   }, company.CompanyId);
  // }

  onDoubleClickItem(item: any) {
    this.baseService.companyService.GetCompanyById(result => {   
      this.company = result;     
    }, item.CompanyId);
    $("#btnAddCompany").trigger('click');
    $("#btnInsertOrUpdateCompany").html('Güncelle');
  }
}
