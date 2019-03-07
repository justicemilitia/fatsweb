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
  /* List of countries */
  countries: Country[] = [];

  /* List of cities */
  cities: City[] = [];

  /* List of companies */
  companies: Company[] = [];

  /* Current company */
  company: Company = new Company();

  public dataTable: TreeGridTable = new TreeGridTable(
    "company",
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

  ngOnInit() {}

<<<<<<< HEAD
  resetForm() {
    this.company = new Company();
=======
  resetForm(data: NgForm) {
    data.resetForm(this.company);
    this.loadCountryList();
>>>>>>> e2fc7d4f3d704e15073ffaa59e5b0f8d70a70b4e
  }

  onSubmit(data: NgForm) {
    /* if company id exists means update it otherwise insert it */
    if (data.value.CompanyId == null) {
      this.addCompany(data);
    } else {
      this.updateCompany(data);
    }
  }

  async deleteCompanies() {
    /* get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir şirket seçiniz"
      );
      return;
    }

    /* Show Question Message */
    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {
      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.companyService.DeleteCompanies(
        itemIds,
        (notDeletedItemIds: number[]) => {
          /* Deactive the spinner */
          this.baseService.spinner.hide();

          /* if any item exists in not deleted items */
          if (notDeletedItemIds) {
            /* Service return us not deleted ids. We will delete ids which exists in notDeletedItemIds number array */
            for (let ii = 0; ii < itemIds.length; ii++) {
              if (notDeletedItemIds.includes(itemIds[ii])) {
                itemIds.splice(ii, 1);
                ii--;
              }
            }

            /* if any value couldnt delete then show popup */
            if (itemIds.length == 0) {
              this.baseService.popupService.ShowAlertPopup(
                "Hiç Bir Kayıt Silinemedi!"
              );
              return;
            }

            /* if some of them is deleted show this */
            if (itemIds.length > 0) {
              this.baseService.popupService.ShowAlertPopup(
                selectedItems.length.toString() +
                  " kayıttan " +
                  itemIds.length.toString() +
                  "'i silinebildi!"
              );
            }
          } else {
            /* if all of them removed */
            this.baseService.popupService.ShowAlertPopup(
              " Tüm kayıtlar başarıyla silindi!"
            );
          }

          /* Now Delete items from the source */
          for (let ii = 0; ii < itemIds.length; ii++) {
            let index = this.companies.findIndex(
              x => x.CompanyId == itemIds[ii]
            );
            if (index > -1) {
              this.companies.splice(index, 1);
            }
          }

          /* Reload Page */
          this.dataTable.TGT_loadData(this.companies);
        },
        (error: HttpErrorResponse) => {
          this.baseService.spinner.hide();
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    });
  }

  async addCompany(data: NgForm) {
    /* Check model state is valid */
    if (data.form.invalid == true) return;

<<<<<<< HEAD
    /* Convert model to table model */
    this.company.CityId = Number(this.company.CityId);
    this.company.City.CityId = this.company.CityId;
    this.company.City.Name = this.cities.find(
      x => x.CityId == this.company.CityId
    ).Name;
    this.company.City.CountryId = Number(this.company.City.CountryId);
    this.company.City.Country.CountryId = this.company.City.CountryId;
    this.company.City.Country.Name = this.countries.find(
      x => x.CountryId == this.company.City.CountryId
    ).Name;

    /* Insert Company service */
    await this.baseService.companyService.InsertCompany(
      this.company,
      (data: Company, message) => {
        /* Show pop up, get inserted company then set it to company id, then load data. */
        this.baseService.popupService.ShowSuccessPopup(message);
        this.company.CompanyId = data.CompanyId;
        this.companies.push(this.company);
        this.dataTable.TGT_loadData(this.companies);
        this.resetForm();
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
=======
    /* Bind Cities and Countries to table model note: ngModels return string so we have to cast them to number */
    if (this.company.CityId) {
      this.company.CityId = Number(this.company.CityId);
      let city = this.cities.find(x => x.CityId == this.company.CityId);
      let country = this.countries.find(x => x.CountryId == this.company.City.CountryId);
      this.company.City.Name = city.Name;
      this.company.City.Country.Name = country.Name;
    }

    /* while waiting value true we will translate button to a loading icon */
    this.isWaitingInsertOrUpdate = true;

    /* Insert Company service */
    await this.baseService.companyService.InsertCompany(this.company, (insertedItem: Company, message) => {

      /* Show pop up */
      this.baseService.popupService.ShowSuccessPopup(message);

      this.company.CompanyId = insertedItem.CompanyId;

      /* Push new item the current list of companies then reload table */
      this.companies.push(this.company);
      this.dataTable.TGT_loadData(this.companies);

      /* Reset Forms and make company empty to use new */
      this.company = new Company();
      this.resetForm(data);
      this.isWaitingInsertOrUpdate = false;

    }, (error: HttpErrorResponse) => {

      /* Show alert message */
      this.baseService.popupService.ShowErrorPopup(error);
      this.isWaitingInsertOrUpdate = false;

    });
>>>>>>> e2fc7d4f3d704e15073ffaa59e5b0f8d70a70b4e
  }

  async updateCompany(data: NgForm) {
    /* Check model state */
    if (data.form.invalid == true) return;

    /* Ask for approve question if its true then update the company */
    await this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {
          this.baseService.companyService.UpdateCompany(
            this.company,
            (_company, message) => {
              /* Show pop up then update data in datatable */
              this.baseService.popupService.ShowSuccessPopup(message);
              this.dataTable.TGT_updateData(this.company);
              this.resetForm();
            },
            (error: HttpErrorResponse) => {
              /* Show error message */
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
        }
      }
    );
  }

  async loadCompanies() {
    /* Load all companies to datatable */
    await this.baseService.companyService.GetCompanies(
      (companies: Company[]) => {
        this.companies = companies;
        this.dataTable.TGT_loadData(this.companies);
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadCountryList() {
    /* Load all the countries if it isn't loaded */
    if (this.countries && this.countries.length == 0) {
      /* First clear cities then get all the countries */
      this.cities = [];
      await this.baseService.countryService.GetCountryList(
        (countries: Country[]) => {
          this.countries = countries;
        }
      );
    }
  }

  async loadCityByCountryId(event: any) {
    /* if any value selected means can get city id by country id */
    if (event.target.value.toString().trim() !== "") {
      await this.baseService.cityService.GetCityByCountryId(
        <number>event.target.value,
        (cities: City[]) => {
          /* Load cities */
          this.cities = cities;
        },
        (error: HttpErrorResponse) => {
          /* show erro pop up */
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }
  }

  async onDoubleClickItem(item: Company) {
    
    /* Clear Model */
    this.company = new Company();

    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* load companies if not loaded */
    await this.loadCountryList();

    /* load cities if not loaded */
    await this.loadCityByCountryId({ target: { value: item.City.CountryId } });

    /* get company information from server */
    await this.baseService.companyService.GetCompanyById(
      item.CompanyId,
      (result: Company) => {
        /* then bind it to company model to update */
        setTimeout(() => {
          /* Trigger to model to show it */
          $("#btnAddCompany").trigger("click");

          /* close loading */
          this.baseService.spinner.hide();

          /* bind result to model */
<<<<<<< HEAD
          this.company = result;
          this.baseService.spinner.hide();
=======
          Object.assign(this.company, result);

          if (!this.company.City)
            this.company.City = new City();

          console.log(this.company);


>>>>>>> e2fc7d4f3d704e15073ffaa59e5b0f8d70a70b4e
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        /* hide spinner */
        this.baseService.spinner.hide();

        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
