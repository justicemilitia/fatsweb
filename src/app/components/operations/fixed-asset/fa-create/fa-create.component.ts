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
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { ExpenseCenter } from 'src/app/models/ExpenseCenter';
import { FixedAssetCardProperty } from 'src/app/models/FixedAssetCardProperty';
import { FixedAssetPropertyDetails } from 'src/app/models/FixedAssetPropertyDetails';
import { PropertyValueTypes } from 'src/app/declarations/property-value-types.enum';


@Component({
  selector: 'app-fa-create',
  templateUrl: './fa-create.component.html',
  styleUrls: ['./fa-create.component.css']
})
export class FaCreateComponent extends BaseComponent implements OnInit {

  departments: Department[] = [];
  companies: Company[] = [];
  locations: Location[] = [];
  statuses: FixedAssetStatus[] = [];
  brands: FixedAssetCardBrand[] = [];
  models: FixedAssetCardModel[] = [];
  fixedassetcategories: FixedAssetCardCategory[] = [];
  fixedassetcards: FixedAssetCard[] = [];
  staffs: User[] = [];
  expensecenters:ExpenseCenter[]=[];
  fixedassetproperty:FixedAssetCardProperty[]=[];

  fixedAsset:FixedAsset=new FixedAsset();
  fixedAssetProperty:FixedAssetCardProperty=new FixedAssetCardProperty();
  fixedAssetPropertyDetail:FixedAssetPropertyDetails=new FixedAssetPropertyDetails();

  BarcodeIsUnique:boolean=true;
  disabledBarcode:boolean=true;
  errorMessage:string = '';
  isListSelected:boolean=false;

  /* Fixed Asset Card Property Value Data Table */
  public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
    "fixedassetcardpropertyvalue",
    [
      {
        columnDisplayName: "Özellik Adı",
        columnName: ["Value"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Özellik Değeri",
        columnName: ["Value"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Value"]
    }
  );

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadDropdown();    
    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isLoading = false;
  }

  ngOnInit() { }

loadDropdown(){

    this.baseService.departmentService.GetDepartments((departments: Department[]) => {
      this.departments = departments;
    }, (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });

    this.baseService.companyService.GetCompanies((companies: Company[]) => { 
      this.companies = companies }, 
    (error: HttpErrorResponse) => { 
      this.baseService.popupService.ShowErrorPopup(error) 
    });

    this.baseService.locationService.GetLocations((locations:Location[])=>{
      this.locations=locations;
    },(error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    });

    this.baseService.fixedAssetStatusService.GetStatus((statuses:FixedAssetStatus[]) => {
      this.statuses=statuses;
    },(error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    });

    this.baseService.userService.GetUsers((users:User[])=>{
      this.staffs=users;
    },(error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    });

    this.baseService.expenseCenterService.GetExpenseCenters(
      (expCenters: ExpenseCenter[]) => {
        this.expensecenters = expCenters;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
    });

    this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
      (fixedAssetCardProperties:FixedAssetCardProperty[]) => {
      this.fixedassetproperty=fixedAssetCardProperties;
    },
    (error: HttpErrorResponse) => {
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
        }, (error:HttpErrorResponse)=>{
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

load

isBarcodeUnique(barcode:string){
  
  if(barcode == '')
  return;

    this.baseService.fixedAssetCreateService.isBarcodeUnique(barcode,
      (result)=>{
        this.BarcodeIsUnique=false;
        this.errorMessage='';
      },
      (error:HttpErrorResponse) => {
        this.BarcodeIsUnique=true;
        this.errorMessage = error.statusText;
      });
  }

isBarcodeManual(event){
    if(event.target.checked == true){
      this.disabledBarcode = false;
      return;
    }
    else{
      this.disabledBarcode=true;
    }
  }

loadFixedAssetProperties(){

}

getPropertyId(event){
  
    let fixedAssetProperty=this.fixedassetproperty.find(x=>x.FixedAssetCardPropertyId == <number>event.target.value);

    if(fixedAssetProperty.FixedAssetTypeId==PropertyValueTypes.Liste)
    {
      this.isListSelected=true;
    }else{
      this.isListSelected=false;
    }
  }
}
