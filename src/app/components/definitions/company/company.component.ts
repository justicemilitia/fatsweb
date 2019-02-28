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
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Mail",
        columnName: ["Email"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Adres",
        columnName: ["Address"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Ülke",
        columnName: ["City", "Country", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Şehir",
        columnName: ["City", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Vergi Numarası",
        columnName: ["TaxNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Telefon",
        columnName: ["Phone"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Faks",
        columnName: ["SecondPhone"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Açıklama",
        columnName: ["Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadCompanies();
  }

  ngOnInit() { }

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
          (_company, message) => {
            this.baseService.popupService.ShowSuccessPopup(message);
            this.dataTable.TGT_updateData(_company);
          },
          (error: HttpErrorResponse) => {
            this.baseService.popupService.ShowErrorPopup(error);

          }
        );
      }
    });
  }

  async loadCompanies() {
    await this.baseService.companyService.GetCompanies((companies: Company[]) => {
      this.companies = companies;
      this.dataTable.TGT_loadData(this.companies);
    },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadCountryList() {
    this.cities = [];
    await this.baseService.countryService.GetCountryList(
      countries => {
        this.countries = countries;
      }
    );
  }

  async loadCityByCountryId(event: any) {
    await this.baseService.cityService.GetCityByCountryId(<number>event.target.value,
      (cities, message) => (this.cities = cities), (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  onDoubleClickItem(item: Company) {
    this.company = item;
    this.loadCountryList();
    this.loadCityByCountryId({ target: { value: item.City.CountryId } });
    this.baseService.companyService.GetCompanyById(item.CompanyId, result => {
      item = result;
    }, (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });
    $("#btnAddCompany").trigger("click");
    $("#btnInsertOrUpdateCompany").html("Güncelle");
  }
}
