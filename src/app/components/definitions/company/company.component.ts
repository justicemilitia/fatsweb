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

  selectedCountry:boolean = false;

  /* List of countries */
  countries: Country[] = [];

  /* List of cities */
  cities: City[] = [];

  /* List of companies */
  companies: Company[] = [];

  /* Current company */
  company: Company = new Company();

  notDeletedBarcode: string = '';
  errorMessage: string = '';
  
  selectedItems:any[]=[];
  
  public dataTable: TreeGridTable = new TreeGridTable(
    "company",
    [
      {
        columnDisplayName: this.getLanguageValue('Company_Code'),
        columnName: ["CompanyCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Company_Name'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('email'),
        columnName: ["Email"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Address'),
        columnName: ["Address"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Country'),
        columnName: ["City", "Country", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('City'),
        columnName: ["City", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Tax_Number'),
        columnName: ["TaxNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName:  this.getLanguageValue('Phone'),
        columnName: ["Phone"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Tax_Office'),
        columnName: ["TaxOffice"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName:  this.getLanguageValue('Fax'),
        columnName: ["SecondPhone"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName:  this.getLanguageValue('Description'),
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
    
    this.selectedCountry=false;

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
      this.popupComponent.ShowModal('#modalShowQuestionPopupForCompany');
      this.popupComponent.CloseModal('#modalCompany');
    }

  }

  onDelete(){
    
     /* get selected items from table */
     this.selectedItems = this.dataTable.TGT_getSelectedItems();
    
     /* if count of items equals 0 show message for no selected item */
     if (!this.selectedItems || this.selectedItems.length == 0) {
       this.baseService.popupService.ShowAlertPopup(
         "Lütfen en az bir şirket seçiniz"
       );
       return;
     }
    else
    this.popupComponent.ShowModal('#modalShowDeletePopupForCompany');
    
  }

  async deleteCompanies() {
    /* get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup( this.getLanguageValue('Please_choose_at_least_one_record'));
      return;
    }

    /* Show Question Message */
    // await this.baseService.popupService.ShowQuestionPopupForDelete(() => {
      
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
          this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('Delete_operation_successful'));
        else
          this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('All_records_deleted'));

        /* Clear all the ids from table */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Get latest companies from table*/
        this.companies = <Company[]>this.dataTable.TGT_copySource();

      }, (itemIds:NotDeletedItem[],error: HttpErrorResponse) => {

        let barcode:Company;

        let notDeletedCodes : string[]=[];

        let companies = <Company[]>this.dataTable.TGT_copySource();
        
        /* Hide Loading Spinner */
        this.baseService.spinner.hide();

        itemIds.forEach((e:NotDeletedItem) => {
          for(let i=0; i<itemIds.length; i++){
        barcode = companies.find(x=>x.CompanyId == e[i].Id);
        }     
        notDeletedCodes.push(barcode.CompanyCode);
        });

         /* Show error message */
         if(itemIds.length>0)
         {
        //  this.baseService.popupService.ShowDeletePopup(error,notDeletedCodes);

        notDeletedCodes.forEach((e, i) => {
          this.notDeletedBarcode +=
            e + (i == selectedItems.length - 1 ? "" : ", ");
        });

         this.popupComponent.ShowModal('#modalShowWarningPopup');     
        }
        else{
        //  this.baseService.popupService.ShowErrorPopup(error);
         this.errorMessage=error.message;
         this.popupComponent.ShowModal('#modalShowErrorPopup');     
          
        }

      });
      this.popupComponent.CloseModal('#modalShowDeletePopupForCompany');      
      
    // });
  }

  async addCompany(data: NgForm) {

    /* Activate the loading spinner */
    this.baseService.spinner.show();
    
    if(this.selectedCountry==true){
      if(data.value.CityId == null)
      return;      
    } 
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

     /* Deactive the spinner */
     this.baseService.spinner.hide();

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

      $('#btnRefresh').trigger('click');

      this.selectedCountry=false;

    }, (error: HttpErrorResponse) => {
      
      /* Deactive the spinner */
      this.baseService.spinner.hide();

      /* Show alert message */
      this.baseService.popupService.ShowErrorPopup(error);
      this.isWaitingInsertOrUpdate = false;

    });
  }

  async updateCompany() {

      /* Activate the loading spinner */
      this.baseService.spinner.show();
      
      if(this.selectedCountry==true) return;
        /* Say to user to wait */
        this.isWaitingInsertOrUpdate = true;

        let willUpdateItem = new Company();
        Object.assign(willUpdateItem, this.company);
        
        this.baseService.companyService.UpdateCompany(this.company, (_company, message) => {

          /* Deactive the spinner */
          this.baseService.spinner.hide();

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

         /* Deactive the spinner */
         this.baseService.spinner.hide();

          this.errorMessage=this.getLanguageValue(error.statusText);
          this.popupComponent.ShowModal('#modalShowErrorPopup');  

          /* say user no more wait */
          this.isWaitingInsertOrUpdate = false;

        });

        this.popupComponent.CloseModal('#modalShowQuestionPopupForCompany');     
  }

  async loadCompanies() {

    /* Load all companies to datatable */
    await this.baseService.companyService.GetCompanies(
      (companies: Company[]) => {

        /* Load Companies then refresh table */
        this.companies = companies;
        this.dataTable.TGT_loadData(this.companies);
        if(companies.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
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

    if(event.target.selectedIndex == 0)
      this.selectedCountry =false;
    else
      this.selectedCountry=true;

    /* if value is empty return to prevent error */
    if (!event.target.value || event.target.value == '' || event.target.selectedIndex == 0) {
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

  closeModal(){
    this.popupComponent.CloseModal('#modalShowErrorPopup');
  }
}
