import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { BaseComponent } from 'src/app/components/base/base.component';
import { Department } from 'src/app/models/Department';
import { HttpErrorResponse } from '@angular/common/http';
import { Company } from 'src/app/models/Company';
import { FixedAssetStatus } from 'src/app/models/FixedAssetStatus';
import { FixedAssetCardBrand } from 'src/app/models/FixedAssetCardBrand';
import { FixedAssetCardModel } from 'src/app/models/FixedAssetCardModel';
import { FixedAssetCardCategory } from 'src/app/models/FixedAssetCardCategory';
import { FixedAssetCard } from 'src/app/models/FixedAssetCard';
import { User } from 'src/app/models/User';
import { FixedAsset } from 'src/app/models/FixedAsset';

import { FormWizardModule } from 'angular-wizard-form';

@Component({
  selector: 'app-fa-create',
  templateUrl: './fa-create.component.html',
  styleUrls: ['./fa-create.component.css']
})
export class FaCreateComponent extends BaseComponent implements OnInit,AfterViewInit,DoCheck {

  departments: Department[] = [];
  companies: Company[] = [];
  locations: Location[] = [];
  statuses: FixedAssetStatus[] = [];
  brands: FixedAssetCardBrand[] = [];
  models: FixedAssetCardModel[] = [];
  fixedassetcategories: FixedAssetCardCategory[] = [];
  fixedassetcards: FixedAssetCard[] = [];
  staffs: User[] = [];

  fixedAsset:FixedAsset=new FixedAsset();
  
  dataTableProperty

  constructor(protected baseService: BaseService) {
    super(baseService);
  }

  ngAfterViewInit(): void {
    $(".az-navbar-two").trigger("click");
    this.loadDepartments();
  }

  ngDoCheck() {
    console.log(this.fixedAsset.Barcode);
  }

  ngOnInit() { }

  loadDepartments(){
    this.baseService.departmentService.GetDepartments((departments: Department[]) => {
      this.departments = departments;
    }, (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }
  
  loadCompanies(){
    this.baseService.companyService.GetCompanies((companies: Company[]) => { 
      this.companies = companies }, 
      (error: HttpErrorResponse) => { 
      this.baseService.popupService.ShowErrorPopup(error) });
  }

  loadLocations(){
    this.baseService.locationService.GetLocations((locations:Location[])=>{
      this.locations=locations;
    },(error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  loadStatuses(){
    this.baseService.fixedAssetStatusService.GetStatus((statuses:FixedAssetStatus[]) => {
      this.statuses=statuses;
    },(error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  loadUsers(){
    this.baseService.userService.GetUsers((users:User[])=>{
      this.staffs=users;
    },(error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  loadBrandList(){
    if(this.brands && this.brands.length == 0){

      this.models=[];

      this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
        (brands:FixedAssetCardBrand[])=>{
        this.brands=brands;
          },
          (error:HttpErrorResponse)=>{

          }
      );
  }
}

  loadModelByBrandId(event:any){
    this.models = [];

    if(!event.target.value || event.target.value == ''){
      this.fixedAsset.FixedAssetCardModelId=null;
      this.fixedAsset.FixedAssetCardModel=new FixedAssetCardModel();
      return;
    }

    if(event.target.value){
      this.baseService.fixedAssetCardModelService.GetFixedAssetsCardModelsByBrandId(<number>event.target.value,
        (models:FixedAssetCardModel[])=>{

          this.models=models;
        },
        (error:HttpErrorResponse)=>{
          this.baseService.popupService.ShowErrorPopup(error);
        });
    }
  }

  loadCategoriesList(){
    if(this.fixedassetcategories && this.fixedassetcategories.length == 0){

      this.fixedassetcards = [];

      this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
        (categories:FixedAssetCardCategory[])=>{
        this.fixedassetcategories = categories;
          },
          (error:HttpErrorResponse)=>{
            this.baseService.popupService.ShowErrorPopup(error);
          });
   }
  }

  loadFaCardByCategoryId(event:any){
    this.fixedassetcards=[];

    if(!event.target.value || event.target.value == ''){
      this.fixedAsset.FixedAssetCardId = null;
      this.fixedAsset.FixedAssetCard=new FixedAssetCard();
      return;
    }

    if(event.target.value){
      this.baseService.fixedAssetCardService.GetFixedAssetCardByCategoryId(<number>event.target.value,
        (fixedAssetCards:FixedAssetCard[])=>{

          this.fixedassetcards=fixedAssetCards;
        },
        (error:HttpErrorResponse)=>{

          this.baseService.popupService.ShowErrorPopup(error);
        });
    }
  }
}
