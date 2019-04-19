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
import { FixedAsset } from 'src/app/models/FixedAsset';
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

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

  /* Is Request send and waiting for response ? */
  isWaitingInsertOrUpdate: boolean = false;

  /* Is Table Refreshing */
  isTableRefreshing:boolean = false;

  /* Is Table Exporting */
  isTableExporting:boolean = false;

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
        columnDisplayName: "Şirket Kodu",
        columnName: ["CompanyCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
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
        columnDisplayName: "Vergi Dairesi ",
        columnName: ["TaxNumber"],
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

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.company);
    this.loadCountryList();
    if (isNewItem == true) {
      this.cities = [];
      this.company = new Company();
    }
  }

  onSubmit(data: NgForm) {

    /* Check model state is valid */
    if (data.form.invalid == true) return;

    /* if company id exists means update it otherwise insert it */
    if (this.company.CompanyId == null) {
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
      this.baseService.popupService.ShowAlertPopup("Lütfen en az bir kayıt seçiniz");
      return;
    }

    /* Show Question Message */
    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {
      
      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.companyService.DeleteCompanies(itemIds, () => {
        
        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* if all of them removed */
        if (itemIds.length == 1)
          this.baseService.popupService.ShowSuccessPopup("Kayıt Başarıyla silindi!");
        else
          this.baseService.popupService.ShowSuccessPopup("Tüm kayıtlar başarıyla silindi!");

        /* Clear all the ids from table */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Get latest companies from table*/
        this.companies = <Company[]>this.dataTable.TGT_copySource();

      }, (itemIds:NotDeletedItem[],error: HttpErrorResponse) => {

        let barcode:Company;

        let notDeletedCode : string[]=[];

        let companies = <Company[]>this.dataTable.TGT_copySource();
        
        /* Hide Loading Spinner */
        this.baseService.spinner.hide();

        itemIds.forEach((e:NotDeletedItem) => {
          for(let i=0; i<itemIds.length; i++){
        barcode = companies.find(x=>x.CompanyId == e[i].Id);
        }     
        notDeletedCode.push(barcode.CompanyCode);
        });

         /* Show error message */
         if(itemIds.length>0)
         this.baseService.popupService.ShowDeletePopup(error,notDeletedCode);
         else
         this.baseService.popupService.ShowErrorPopup(error);

      });
    });
  }

  async addCompany(data: NgForm) {

    /* Bind Cities and Countries to table model note: ngModels return string so we have to cast them to number */
    if (this.company.CityId) {
      this.company.CityId = Number(this.company.CityId);
      let city = this.cities.find(x => x.CityId == this.company.CityId);
      let country = this.countries.find(x => x.CountryId == this.company.City.CountryId);
      this.company.City.Name = city.Name;
      this.company.City.CityId = city.CityId;
      this.company.City.Country.Name = country.Name;
      this.company.City.Country.CountryId = country.CountryId;
      this.company.City.CountryId = country.CountryId;
    }

    /* while waiting value true we will translate button to a loading icon */
    this.isWaitingInsertOrUpdate = true;

    /* Insert Company service */
    await this.baseService.companyService.InsertCompany(this.company, (insertedItem: Company, message) => {

      /* close loading bar */
      this.isWaitingInsertOrUpdate = false;

      /* Show pop up */
      this.baseService.popupService.ShowSuccessPopup(message);

      this.company.CompanyId = insertedItem.CompanyId;

      /* Push new item the current list of companies then reload table */
      this.companies.push(this.company);
      this.dataTable.TGT_loadData(this.companies);

      /* Reset Forms and make company empty to use new */
      this.resetForm(data, true);

    }, (error: HttpErrorResponse) => {

      /* Show alert message */
      this.baseService.popupService.ShowErrorPopup(error);
      this.isWaitingInsertOrUpdate = false;

    });
  }

  async updateCompany(data: NgForm) {

    /* Ask for approve question if its true then update the company */
    await this.baseService.popupService.ShowQuestionPopupForUpdate((response: boolean) => {
      if (response == true) {

        /* Say to user to wait */
        this.isWaitingInsertOrUpdate = true;

        this.baseService.companyService.UpdateCompany(this.company, (_company, message) => {

          /* city and update binding */
          if (this.company.CityId) {
            let city = this.cities.find(x => x.CityId == Number(this.company.CityId));
            let country = this.countries.find(x => x.CountryId == Number(this.company.City.CountryId));
            this.company.City.CityId = city.CityId;
            this.company.City.Name = city.Name;
            this.company.City.CountryId = country.CountryId;
            this.company.City.Country.Name = country.Name;
            this.company.City.Country.CountryId = country.CountryId;
          }

          /* Close loading */
          this.isWaitingInsertOrUpdate = false;

          /* Show pop up then update data in datatable */
          this.baseService.popupService.ShowSuccessPopup(message);

          /* Update table with updated company */
          let updatedCompany = new Company();
          Object.assign(updatedCompany, this.company);
          this.dataTable.TGT_updateData(updatedCompany);

          /* Get original source from table */
          this.companies = <Company[]>this.dataTable.TGT_copySource();

        }, (error: HttpErrorResponse) => {

          /* Show error message */
          this.baseService.popupService.ShowErrorPopup(error);

          /* say user no more wait */
          this.isWaitingInsertOrUpdate = false;

        });
      }
    });
  }

  async loadCompanies() {

    /* Load all companies to datatable */
    await this.baseService.companyService.GetCompanies(
      (companies: Company[]) => {

        /* Load Companies then refresh table */
        this.companies = companies;
        this.dataTable.TGT_loadData(this.companies);
        if(companies.length==0){
          this.baseService.popupService.ShowWarningPopup("Record_not_found");
        }
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

      /* Get all the countries */
      await this.baseService.countryService.GetCountryList(
        (countries: Country[]) => {
          this.countries = countries;
        }
      );
    }
  }

  async loadCityByCountryId(event: any) {
    this.cities = [];

    /* if value is empty return to prevent error */
    if (!event.target.value || event.target.value == '') {
      this.company.CityId = null;
      this.company.City = new City();
      return;
    }

    /* if any value selected means can get city id by country id */
    if (event.target.value) {
      await this.baseService.cityService.GetCityByCountryId(<number>event.target.value, (cities: City[]) => {

        /* Load cities */
        this.cities = cities;

      }, (error: HttpErrorResponse) => {

        /* show error pop up */
        this.baseService.popupService.ShowErrorPopup(error);

      });
    }
  }

  async onDoubleClickItem(item: Company) {

    /* Clear Model */
    this.company = new Company();

    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* load companies if not loaded */
    this.loadCountryList();

    /* load cities if not loaded */
    if (item.City)
      this.loadCityByCountryId({ target: { value: item.City.CountryId } });
    else
      this.cities = [];

    /* get company information from server */
    await this.baseService.companyService.GetCompanyById(
      item.CompanyId,
      (result: Company) => {

        /* then bind it to company model to update */
        setTimeout(() => {

          /* Trigger to model to show it */
          $("#btnEditCompany").trigger("click");

          /* close loading */
          this.baseService.spinner.hide();

          /* bind result to model */
          Object.assign(this.company, result);

          if (!this.company.City)
            this.company.City = new City();

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

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadCompanies();

    this.isTableRefreshing = false;

  }
}
