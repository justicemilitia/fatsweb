import { Component, OnInit, NgModule } from "@angular/core";
import { BaseComponent } from "src/app/components/base/base.component";
import { BaseService } from "../../../services/base.service";
import { NgForm, ReactiveFormsModule } from "@angular/forms";

import { Company } from "src/app/models/Company";
import { Country } from "src/app/models/Country";
import { City } from "src/app/models/City";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { HttpErrorResponse } from "@angular/common/http";

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
      }
    ],
    {},
    {
      isDesc: false,
      column: "Name"
    }
  );

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadCompanies();
  }

  ngOnInit() { }

  loadCompanies() {
    this.baseService.companyService.GetCompanies(
      (companies: Company[]) => {
        this.companies = companies;
        this.dataTable.TGT_loadData(this.companies);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  resetForm() {
    this.company = new Company();
  }

  OnSubmit(data: NgForm) {
    if (data.value.CompanyId == null)
      this.addCompany(data);
    else this.UpdateCompany(data);
  }

  addCompany(data: NgForm) {
    if (data.form.invalid == true)
      return;
    this.company = <Company>data.value;
    this.baseService.companyService.InsertCompany(
      this.company,
      (data: Company, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.companies.push(data);
        this.dataTable.TGT_loadData(this.companies);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  UpdateCompany(data: NgForm) {
    this.company = <Company>data.value;
    this.baseService.popupService.ShowQuestionPopupForUpdate(response => {
      if (response == true) {
        this.baseService.companyService.UpdateCompany(
          this.company,
          (company, message) => {
            this.baseService.popupService.ShowSuccessPopup(message);
            this.dataTable.TGT_updateData(company);
          },
          (error: HttpErrorResponse) => {
            this.baseService.popupService.ShowErrorPopup(error);

          }
        );
      }
    });
  }

  loadCountryList() {
    this.cities = [];
    this.baseService.countryService.GetCountryList(
      countries => {
        this.countries = countries;
      }
    );
  }

  loadCityByCountryId(event: any) {
    this.baseService.cityService.GetCityByCountryId(<number>event.target.value,
      (cities, message) => (this.cities = cities), (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  onDoubleClickItem(item: Company) {
    this.loadCountryList();
    this.loadCityByCountryId({ target: { value: item.City.Country.CountryId } });
    this.baseService.companyService.GetCompanyById(item.CompanyId, result => {
      this.company = result;
    }, (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });
    $("#btnAddCompany").trigger("click");
    $("#btnInsertOrUpdateCompany").html("Güncelle");
  }
}
