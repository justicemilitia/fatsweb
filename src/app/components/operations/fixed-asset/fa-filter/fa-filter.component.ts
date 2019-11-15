import { Component, OnInit, NgModule, Input, OnDestroy, AfterViewInit, AfterViewChecked } from "@angular/core";
import { BaseComponent } from "../../../base/base.component";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { TreeGridTable } from "../../../../extends/TreeGridTable/modules/TreeGridTable";
import { BaseService } from "../../../../services/base.service";
import { Department } from "../../../../models/Department";
import { Location } from "../../../../models/Location";
import { FixedAssetStatus } from "../../../../models/FixedAssetStatus";
import { Company } from "../../../../models/Company";
import { HttpErrorResponse } from "@angular/common/http";
import { FixedAssetCardCategory } from "../../../../models/FixedAssetCardCategory";
import { User } from "../../../../models/User";
import { FixedAssetCardBrand } from "../../../../models/FixedAssetCardBrand";
import { FixedAssetCardModel } from "../../../../models/FixedAssetCardModel";
import { FixedAsset } from "../../../../models/FixedAsset";
import { FixedAssetCard } from "../../../../models/FixedAssetCard";
import { FixedAssetCardPropertyValue } from "../../../../models/FixedAssetCardPropertyValue";
import { FixedAssetCardProperty } from "../../../../models/FixedAssetCardProperty";
import { FixedAssetPropertyDetails } from "../../../../models/FixedAssetPropertyDetails";
import { PropertyValueTypes } from "../../../../declarations/property-value-types.enum";
import { FixedAssetComponent } from "../fixed-asset.component";
import { FixedAssetFilter } from '../../../../models/FixedAssetFilter';
import { convertNgbDateToDateString } from '../../../../declarations/extends';

@Component({
  selector: "app-fa-filter",
  templateUrl: "./fa-filter.component.html",
  styleUrls: ["./fa-filter.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaFilterComponent],
  providers: [FaFilterComponent]
})
export class FaFilterComponent extends BaseComponent implements OnInit {

  @Input() filterDataTable: TreeGridTable;
  @Input() fixedAssetComponent: FixedAssetComponent;

  departments: Department[] = [];
  companies: Company[] = [];
  locations: Location[] = [];
  statuses: FixedAssetStatus[] = [];
  fixedassetcards: FixedAssetCard[] = [];  
  fixedassetcategories: FixedAssetCardCategory[] = [];
  users: User[] = [];
  fixedassetbrands: FixedAssetCardBrand[] = [];
  fixedassetmodels: FixedAssetCardModel[] = [];
  properties: FixedAssetCardProperty[] = [];
  fixedAsset: FixedAssetFilter = new FixedAssetFilter();
  fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
  faPropertyDetails: FixedAssetPropertyDetails[] = [];
  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();
  isListSelected: boolean = false;
  propertyValue: string;
  fixedassetproperty: FixedAssetCardProperty[] = [];
  fixedassetpropertyvalues: FixedAssetCardPropertyValue[] = [];
  fixedAssetFilterList: FixedAsset[] = [];
  IsActive: boolean = null;
  IsPassive: boolean = null; 

  isUserDropdownOpen:boolean = false;
  isLocationDropdownOpen: boolean = false;
  isDepartmentDropdownOpen:boolean = false;
  isFaCardDropdownOpen:boolean = false;
  isFaCardCategoryDropdownOpen: boolean = false;
  isBrandDropdownOpen: boolean = false;
  isModelDropdownOpen:boolean = false;
  isStatusDropdownOpen:boolean = false;
  visible:boolean = false;
  sameProperty:boolean =false;
  visiblePropertyName:boolean = false;

  //Dropdown Selected Items
  selectedFixedAssetCards: FixedAssetCard[] = [];
  selectedFixedAssetCardCategories: FixedAssetCardCategory[] = [];
  selectedDepartments: Department[] = [];
  selectedBrands: FixedAssetCardBrand[] = [];
  selectedStatuses: FixedAssetStatus[] = [];
  selectedLocations: Location[] = [];
  selectedModels: FixedAssetCardModel[] = [];
  selectedUsers: User[] = [];

  //Dropdown Settings
  dropdownSettingsForCard = {};
  dropdownSettingsForDepartment = {};
  dropdownSettingsForLocation = {};
  dropdownSettingsForCategory = {};
  dropdownSettingsForStatus = {};
  dropdownSettingsForBrand = {};
  dropdownSettingsForModel = {};
  dropdownSettingsForUser = {};

  /* Fixed Asset Card Property Value Data Table */

  //#region DataTables

  public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
    "fixedassetcardpropertyvalue",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Property_Name'),
        columnName: ["FixedAssetCardProperty", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Property_Value'),
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

  public dataTableUser: TreeGridTable = new TreeGridTable(
    "user",
    [
      {
        columnDisplayName: this.getLanguageValue('User'),
        columnName: ["|User"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          if (value) {
            return value.RegistrationNumber == null ? value.FirstName + " " + value.LastName : value.RegistrationNumber + " - " + value.FirstName + " " + value.LastName;
          } else {
            return "";
          }
        }
      }
    ],
    {
      isDesc: false,
      column: ["|User"]
    }
  );

  public dataTableLocation: TreeGridTable = new TreeGridTable(
    "location",
    [
      {
        columnDisplayName: this.getLanguageValue('Location'),
        columnName: ["Name"],
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

  public dataTableDepartment: TreeGridTable = new TreeGridTable(
    "department",
    [
      {
        columnDisplayName: this.getLanguageValue('Department'),
        columnName: ["Name"],
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
  
  public dataTableStatus: TreeGridTable = new TreeGridTable(
    "status",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Statu'),
        columnName: ["Name"],
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
  
  public dataTableFixedAssetCategory: TreeGridTable = new TreeGridTable(
    "fixedassetcategory",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Category_Name'),
        columnName: ["Name"],
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

  public dataTableFixedAssetCard: TreeGridTable = new TreeGridTable(
    "fixedassetcard",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card'),
        columnName: ["Name"],
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

  public dataTableBrand: TreeGridTable = new TreeGridTable(
    "brand",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Brand_Name'),
        columnName: ["Name"],
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

  public dataTableModel: TreeGridTable = new TreeGridTable(
    "model",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Model_Name'),
        columnName: ["Name"],
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

//#endregion
  
constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadDropdownList();

    //#region DataTable Settings

    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isDeleteable = true;

    
    this.dataTableUser.isPagingActive = false;
    this.dataTableUser.isColumnOffsetActive = false;
    this.dataTableUser.isDeleteable = false;
    this.dataTableUser.isLoading = false;
    this.dataTableUser.isHeaderVisible = false;
    this.dataTableUser.isScrollActive = false;

    this.dataTableLocation.isPagingActive = false;
    this.dataTableLocation.isColumnOffsetActive = false;
    this.dataTableLocation.isDeleteable = false;
    this.dataTableLocation.isLoading = false;
    this.dataTableLocation.isHeaderVisible = false;
    this.dataTableLocation.isScrollActive = false;

    this.dataTableDepartment.isPagingActive = false;
    this.dataTableDepartment.isColumnOffsetActive = false;
    this.dataTableDepartment.isDeleteable = false;
    this.dataTableDepartment.isLoading = false;
    this.dataTableDepartment.isHeaderVisible = false;
    this.dataTableDepartment.isScrollActive = false;

    this.dataTableFixedAssetCategory.isPagingActive = false;
    this.dataTableFixedAssetCategory.isColumnOffsetActive = false;
    this.dataTableFixedAssetCategory.isDeleteable = false;
    this.dataTableFixedAssetCategory.isLoading = false;
    this.dataTableFixedAssetCategory.isHeaderVisible = false;
    this.dataTableFixedAssetCategory.isScrollActive=false;

    this.dataTableFixedAssetCard.isPagingActive = false;
    this.dataTableFixedAssetCard.isColumnOffsetActive = false;
    this.dataTableFixedAssetCard.isDeleteable = false;
    this.dataTableFixedAssetCard.isLoading = false;
    this.dataTableFixedAssetCard.isHeaderVisible = false;
    this.dataTableFixedAssetCard.isScrollActive = false;
    
    this.dataTableBrand.isPagingActive = false;
    this.dataTableBrand.isColumnOffsetActive = false;
    this.dataTableBrand.isDeleteable = false;
    this.dataTableBrand.isLoading = false;
    this.dataTableBrand.isHeaderVisible = false;
    this.dataTableBrand.isScrollActive = false;

    this.dataTableModel.isPagingActive = false;
    this.dataTableModel.isColumnOffsetActive = false;
    this.dataTableModel.isDeleteable = false;
    this.dataTableModel.isLoading = false;
    this.dataTableModel.isHeaderVisible = false;
    this.dataTableModel.isScrollActive = false;

    this.dataTableStatus.isPagingActive = false;
    this.dataTableStatus.isColumnOffsetActive = false;
    this.dataTableStatus.isDeleteable = false;
    this.dataTableStatus.isLoading = false;
    this.dataTableStatus.isHeaderVisible = false;
    this.dataTableStatus.isScrollActive = false;

    //#endregion

    $(document).on("click", e => {
      if (
        $(e.target).closest(".custom-dropdown").length == 0 &&
        $(e.target).closest("#btnUser").length == 0 && $(e.target).closest("#btnLocation").length == 0 && $(e.target).closest("#btnDepartment").length == 0 
        && $(e.target).closest("#btnFaCategory").length == 0  && $(e.target).closest("#btnFaCard").length == 0
        && $(e.target).closest("#btnBrand").length == 0 && $(e.target).closest("#btnModel").length == 0 && $(e.target).closest("#btStatus").length == 0) {
        this.isUserDropdownOpen = false;      
      }
    });
  }

  async resetFilter() {

    this.baseService.popupService.ShowQuestionPopup('Filtreyi temizlemek istediğinize emin misiniz?',
      (response) => {

        if (response == false)
          return;

        this.dataTablePropertyValue.TGT_clearData();

        this.fixedAsset = new FixedAssetFilter();
        this.fixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
        this.fixedAssetPropertyDetail = new FixedAssetPropertyDetails();
        this.isListSelected = false;
        this.propertyValue = null;

        this.IsPassive = false;
        this.IsActive = false;

        //Dropdown Selected Items
        this.selectedUser = null; 
        this.selectedCategory = null;
        this.selectedBrand=null;
        this.selectedCard=null;
        this.selectedDepartment=null;
        this.selectedModel=null;
        this.selectedLocation=null;
        this.selectedUser=null;
        this.selectedStatus = null;

        this.loadDropdownList();

        this.selectedFixedAssetCards = [];
        this.selectedFixedAssetCardCategories = [];
        this.selectedDepartments = [];
        this.selectedBrands = [];
        this.selectedStatuses = [];
        this.selectedLocations = [];
        this.selectedModels = [];
        this.selectedUsers = [];
        this.fixedAssetComponent.loadFixedAsset();

      })

  }

  ngOnInit() {
   
  }

  toggleDropdown(key:string) {

    switch (key) {
      case "user":
      this.isUserDropdownOpen = !this.isUserDropdownOpen;
      this.isLocationDropdownOpen = false;
      this.isDepartmentDropdownOpen=false;
      this.isFaCardDropdownOpen=false;
      this.isFaCardCategoryDropdownOpen = false;
      this.isBrandDropdownOpen = false;
      this.isModelDropdownOpen = false;
      this.isStatusDropdownOpen = false;
      
      break;

      case "location":
      this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
      this.isDepartmentDropdownOpen=false;
      this.isFaCardDropdownOpen=false;
      this.isFaCardCategoryDropdownOpen = false;
      this.isUserDropdownOpen = false;      
      this.isBrandDropdownOpen = false;
      this.isModelDropdownOpen = false;
      this.isStatusDropdownOpen = false;
      
      break;
  
      case "department":
      this.isDepartmentDropdownOpen=!this.isDepartmentDropdownOpen;
      this.isFaCardDropdownOpen=false;
      this.isFaCardCategoryDropdownOpen = false;
      this.isLocationDropdownOpen = false;
      this.isUserDropdownOpen = false;    
      this.isBrandDropdownOpen = false;
      this.isModelDropdownOpen = false;
      this.isStatusDropdownOpen = false;        
  
      break;
      
      case "card":
      this.isFaCardDropdownOpen=!this.isFaCardDropdownOpen;
      this.isLocationDropdownOpen = false;
      this.isDepartmentDropdownOpen=false;
      this.isFaCardCategoryDropdownOpen = false;
      this.isUserDropdownOpen = false;      
      this.isBrandDropdownOpen = false;
      this.isModelDropdownOpen = false; 
      this.isStatusDropdownOpen = false;
       
      break;
  
      case "category":
      this.isFaCardCategoryDropdownOpen = !this.isFaCardCategoryDropdownOpen;
      this.isLocationDropdownOpen = false;
      this.isDepartmentDropdownOpen=false;
      this.isFaCardDropdownOpen=false;
      this.isUserDropdownOpen = false;     
      this.isBrandDropdownOpen = false;
      this.isModelDropdownOpen = false;
      this.isStatusDropdownOpen = false;
      
      break;

      case "brand":
      this.isBrandDropdownOpen=!this.isBrandDropdownOpen;
      this.isLocationDropdownOpen = false;
      this.isDepartmentDropdownOpen=false;
      this.isFaCardCategoryDropdownOpen = false;
      this.isUserDropdownOpen = false;   
      this.isFaCardCategoryDropdownOpen = false;
      this.isModelDropdownOpen = false;    
      this.isStatusDropdownOpen = false;      
  
      break;
  
      case "model":
      this.isModelDropdownOpen = !this.isModelDropdownOpen;
      this.isLocationDropdownOpen = false;
      this.isDepartmentDropdownOpen=false;
      this.isFaCardDropdownOpen=false;
      this.isUserDropdownOpen = false;   
      this.isBrandDropdownOpen = false;
      this.isFaCardCategoryDropdownOpen = false;   
      this.isStatusDropdownOpen = false;
      break;

      case "status":
      this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
      this.isModelDropdownOpen = false;
      this.isLocationDropdownOpen = false;
      this.isDepartmentDropdownOpen=false;
      this.isFaCardDropdownOpen=false;
      this.isUserDropdownOpen = false;   
      this.isBrandDropdownOpen = false;
      this.isFaCardCategoryDropdownOpen = false;   
      break;
    }
  }

  selectedUser: User;
  onClickUser(item) {
    this.selectedUser = item;
  }

  selectedLocation: Location;
  onClickLocation(item) {
    this.selectedLocation = item;
  }

  selectedDepartment: Department;
  onClickDepartment(item) {
    this.selectedDepartment = item;
  }

  selectedCategory:FixedAssetCardCategory;
  onClickFaCategory(item){
    this.selectedCategory=item;
  }

  selectedCard:FixedAssetCard;
  onClickFaCard(item){
    this.selectedCard=item;
  }

  selectedBrand:FixedAssetCardBrand;
  onClickBrand(item){
    this.selectedBrand=item;
  }

  selectedModel:FixedAssetCardModel;
  onClickModel(item){
    this.selectedModel=item;
  }

  selectedStatus:FixedAssetStatus;
  onClickStatus(item){
    this.selectedStatus=item;
  }

  async loadDropdownList() {
    //Department
    this.baseService.departmentService.GetDepartments(
      (departments: Department[]) => {
        this.departments = departments;
        this.dataTableDepartment.TGT_loadData(this.departments);        
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    //Location
    this.baseService.locationService.GetLocations(
      (locations: Location[]) => {
        this.locations = locations;
        this.dataTableLocation.TGT_loadData(this.locations);        
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    //Status
    this.baseService.fixedAssetStatusService.GetStatus(
      (statuses: FixedAssetStatus[]) => {
        this.statuses = statuses;
        this.dataTableStatus.TGT_loadData(this.statuses);        
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    //Card Category
    this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
      (categories: FixedAssetCardCategory[]) => {
        this.fixedassetcategories = categories;
        this.dataTableFixedAssetCategory.TGT_loadData(this.fixedassetcategories);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    //Card
    this.baseService.fixedAssetCardService.GetFixedAssetCards(
      (faCards: FixedAssetCard[]) => {
        this.fixedassetcards = faCards;
        this.dataTableFixedAssetCard.TGT_loadData(this.fixedassetcards);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    // User
    this.baseService.userService.GetUsers(
      (users: User[]) => {
        this.users = users;
        this.dataTableUser.TGT_loadData(this.users);                
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    //Brand

    this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
        (brands: FixedAssetCardBrand[]) => {
          this.fixedassetbrands = brands;
          this.dataTableBrand.TGT_loadData(this.fixedassetbrands);          
        },
        (error: HttpErrorResponse) => { }
      );

    //Model
    this.baseService.fixedAssetCardModelService.GetFixedAssetCardModels(
      (models: FixedAssetCardModel[]) => {
        this.fixedassetmodels = models;
        this.dataTableModel.TGT_loadData(this.fixedassetmodels);
      },
      (error: HttpErrorResponse) => { }
    );

    //Property
    this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
      (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
        this.fixedassetproperty = fixedAssetCardProperties;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async getPropertyValue(event: any) {

    this.visible = false;

    if(event.target.selectedIndex == 0){
      this.propertyValue = null;
      this.fixedAssetPropertyDetail.Value = null;
    }    
    else{
      this.propertyValue = event.target.value;    
      this.fixedAssetPropertyDetail.Value = event.target.value;
      this.visiblePropertyName=false;
    } 
  }

  async loadValuesByPropertyId(event) {
    this.fixedAssetPropertyDetail.Value = null;

    this.propertyValue=null;

    this.fixedassetpropertyvalues=[];

    this.fixedAssetCardPropertyValue.FixedAssetPropertyValueId=null;

    this.visible = false;

    let fixedAssetProperty = this.fixedassetproperty.find(
      x => x.FixedAssetCardPropertyId == Number(event.target.value));

    if (fixedAssetProperty.FixedAssetTypeId == PropertyValueTypes.Liste) {
      this.isListSelected = true;

      this.baseService.fixedAssetCardPropertyService.GetFixedAssetPropertyValueByPropertyId(
        <number>event.target.value,
        (propertyValues: FixedAssetCardPropertyValue[]) => {
          this.fixedassetpropertyvalues = propertyValues;
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    } else {
      this.isListSelected = false;
    }
  }

  async insertPropertyValueToArray(propertyId: any) {
    this.faPropertyDetails = <FixedAssetPropertyDetails[]>(this.dataTablePropertyValue.TGT_copySource());

    if(this.isListSelected==false) 
    this.propertyValue = this.fixedAssetPropertyDetail.Value;
  
    this.faPropertyDetails.forEach(e=>{
  
      if(e.FixedAssetCardPropertyId == this.fixedAssetPropertyDetail.FixedAssetCardPropertyId && e.Value == this.propertyValue)     
      this.sameProperty = true;
    });  
  
    if(this.sameProperty == true)
    {
      this.sameProperty = false;
      return;
    }
    
    if(this.fixedAssetPropertyDetail.FixedAssetCardPropertyId != null){
      this.visiblePropertyName=false;

      if(this.fixedAssetPropertyDetail.Value != null || this.fixedAssetCardPropertyValue.FixedAssetPropertyValueId != null){

        this.fixedAssetPropertyDetail.FixedAssetPropertyDetailId = (this.faPropertyDetails.length + 1) * -1;

        let fixedasset = this.fixedassetproperty.find(x => x.FixedAssetCardPropertyId == Number(propertyId.value)
        );

        this.fixedAssetPropertyDetail.FixedAssetCardProperty = fixedasset;

        if (this.isListSelected == true) 
            this.fixedAssetPropertyDetail.Value = this.propertyValue;

        this.faPropertyDetails.push(this.fixedAssetPropertyDetail);

        this.dataTablePropertyValue.TGT_loadData(this.faPropertyDetails);

        this.fixedAssetPropertyDetail = new FixedAssetPropertyDetails();

        propertyId = null;        
      }
      else{
        this.visiblePropertyName = true;  
      }
    }
    else{
      this.visible=true;
      
      this.visiblePropertyName=true;    
    }
  }

  async FilterFixedAsset(data: NgForm) {
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    this. fixedAsset.Barcodes = [];
    let propertyDetail = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

    this.fixedAsset.IsSearchRequest = true;
    this.fixedAsset.Page = 1;
    this.fixedAsset.PerPage = 100000;

    Object.assign(this.fixedAsset.FixedAssetPropertyArray, propertyDetail);
    
    if (data.value.Barcode)
      this.fixedAsset.Barcodes.push(data.value.Barcode);

    let cloneItem = new FixedAssetFilter();
    Object.assign(cloneItem, this.fixedAsset);

    // this.fixedAsset.Barcodes = data.value.Barcode;
    
    cloneItem.FixedAssetCardName = (<FixedAsset[]>this.dataTableFixedAssetCard.TGT_getSelectedItems()).map(x=>x.getId());
    cloneItem.FixedAssetCardCategoryName = (<FixedAsset[]>this.dataTableFixedAssetCategory.TGT_getSelectedItems()).map(x=>x.getId());
    cloneItem.Departments = (<FixedAsset[]>this.dataTableDepartment.TGT_getSelectedItems()).map(x=>x.getId());
    cloneItem.Brands = (<FixedAsset[]>this.dataTableBrand.TGT_getSelectedItems()).map(x=>x.getId());
    cloneItem.Statuses = (<FixedAsset[]>this.dataTableStatus.TGT_getSelectedItems()).map(x=>x.getId());
    cloneItem.Locations = (<FixedAsset[]>this.dataTableLocation.TGT_getSelectedItems()).map(x=>x.getId());
    cloneItem.Models = (<FixedAsset[]>this.dataTableModel.TGT_getSelectedItems()).map(x=>x.getId());
    cloneItem.Users = (<FixedAsset[]>this.dataTableUser.TGT_getSelectedItems()).map(x=>x.getId());     
    cloneItem.StartDate = this.fixedAsset.StartDate == null ? null : convertNgbDateToDateString(data.value.startDate);
    cloneItem.EndDate = this.fixedAsset.EndDate == null ? null : convertNgbDateToDateString(data.value.endDate);
    cloneItem.IsGuaranteed = data.value.IsGuaranteed;
    cloneItem.IsCalculatedDepreciation = data.value.IsCalculatedDepreciation;
    cloneItem.IsCalculatedIFRSDepreciation = data.value.IsCalculatedIFRSDepreciation;
    
    if((this.IsActive == false || this.IsActive == null) && this.IsPassive){
      cloneItem.RecordStatus = false;
    }
    else if(this.IsActive && (this.IsPassive == false || this.IsPassive == null) ){
      cloneItem.RecordStatus = true;
    }
    else{
      cloneItem.RecordStatus = null;
    }

    cloneItem.FixedAssetPropertyArray = propertyDetail;

    this.baseService.spinner.show();

    await this.baseService.fixedAssetService.FilterFixedAsset(
      cloneItem,
      (fixedAssets: FixedAsset[],totalPage,totalRecords:number) => {

        this.fixedAssetComponent.loadFixedAssetForFilter(25,1,totalPage,fixedAssets,totalRecords);

        this.baseService.spinner.hide();

       $('#CloseModal').trigger('click');

      },
      (error: HttpErrorResponse) => {
        /* Show alert message */

        this.baseService.popupService.ShowErrorPopup(error);

        this.baseService.spinner.hide();
      }
    );
  }

  async loadFixedAssetPropertyList() {
    this.baseService.fixedAssetService.GetFixedAsset(1000, 1, true,
      (fa: FixedAsset[], totalPage: number) => {
        // this.fixedAssetFilterList = fa;
        this.fixedAssetFilterList.forEach(e => {
          e.FixedAssetPropertyDetails.forEach(p => {
            if (p.FixedAssetCardPropertyId) {
              e["PROP_" + p.FixedAssetCardPropertyId.toString()] = p.Value;
            }
          });
        });
        this.filterDataTable.TGT_loadData(this.fixedAssetFilterList);
        this.fixedAssetComponent.currentPage = 1;
        this.fixedAssetComponent.perInPage = 1000;
        this.fixedAssetComponent.totalPage = totalPage;
        this.fixedAssetComponent.TGT_calculatePages();
        
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }


  async loadFixedAssetProperties() {
    this.baseService.fixedAssetService.GetFixedAssetProperties(
      (faProperties: FixedAssetCardProperty[]) => {
        this.fixedassetproperty = faProperties;
        this.fixedassetproperty.forEach(e => {
          this.filterDataTable.dataColumns.push({
            columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
            columnDisplayName: e.Name,
            isActive: true,
            type: "text"
          });
        });
        this.filterDataTable.TGT_bindActiveColumns();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  resetForm(data: NgForm) {
    data.resetForm();
    this.fixedAsset = new FixedAssetFilter();
  }

  resetDropdown(key:string){
    switch(key){
      case "user":
      this.selectedUser = null;      
      break;
      case "category":
      this.selectedCategory = null;
      break;
      case "card":
      this.selectedCard = null;
      this.dataTableFixedAssetCard.TGT_clearData();
      break;
      case "location":
      this.selectedLocation = null;
      this.dataTableDepartment.TGT_clearData();
      break;
      case "department":
      this.selectedDepartment = null;      
      break;
      case "brand":
      this.selectedBrand = null;
      this.dataTableModel.TGT_clearData();                
      break;
      case "model":
      this.selectedModel = null;  
      break;
      case "status":
      this.selectedStatus = null;  
      break;
    }
  }

  IsPassiveFa(event){
    if(event.target.checked == true)
      this.IsPassive= true;
    
    else
      this.IsPassive=false;
  }


  IsActiveFa(event){
    if(event.target.checked == true)
      this.IsActive= true;    
    else
      this.IsActive=false;
  }
}
