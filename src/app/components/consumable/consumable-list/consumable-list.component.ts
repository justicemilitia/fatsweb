import { Component, OnInit, NgModule } from "@angular/core";
import { NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Consumable } from "src/app/models/Consumable";
import { FixedAssetPropertyDetails } from "src/app/models/FixedAssetPropertyDetails";
import { FixedAssetCardPropertyValue } from "src/app/models/FixedAssetCardPropertyValue";
import { FixedAssetCardProperty } from "src/app/models/FixedAssetCardProperty";
import { PropertyValueTypes } from "src/app/declarations/property-value-types.enum";
import { ConsumableCategory } from "src/app/models/ConsumableCategory";
import { FixedAssetCardBrand } from "src/app/models/FixedAssetCardBrand";
import { FixedAssetCardModel } from "src/app/models/FixedAssetCardModel";
import { ConsumableCard } from "src/app/models/ConsumableCard";
import { Location } from "src/app/models/Location";
import { Company } from "src/app/models/Company";
import { ConsumableUnit } from 'src/app/models/ConsumableUnit';
import * as $ from "jquery";
import { Department } from 'src/app/models/Department';
import { User } from 'src/app/models/User';
import { Page } from 'src/app/extends/TreeGridTable/models/Page';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: "app-consumable-list",
  templateUrl: "./consumable-list.component.html",
  styleUrls: ["./consumable-list.component.css"]
})
export class ConsumableListComponent extends BaseComponent implements OnInit {
  isTableRefreshing: boolean = false;

  isTableExporting: boolean = false;

  isListSelected: boolean = false;

  isLocationDropdownOpen: boolean = false;

  isDepartmentDropdownOpen:boolean = false;

  isCategoryDropdownOpen:boolean=false;

  isCardDropdownOpen:boolean=false;

  isWaitingInsertOrUpdate: boolean = false;

  isSelectedProperty: boolean = false;

  sameProperty:boolean = false;

  visible: boolean = false;

  visiblePropertyName:boolean = false;

  visibleRequiredProperty:boolean=false;

  propertyValue: string;

  consumable: Consumable = new Consumable();

  exitconsumable:Consumable = new Consumable();

  consumableCard: ConsumableCard=new ConsumableCard();

  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();

  fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();

  faProperties: FixedAssetCardProperty[] = [];

  locations: Location[] = [];

  companies: Company[] = [];

  departments: Department[] = [];

  consumables: Consumable[] = [];

  fixedassetproperty: FixedAssetCardProperty[] = [];

  faPropertyDetails: FixedAssetPropertyDetails[] = [];

  consumableCategories: ConsumableCategory[] = [];

  consumableCards: ConsumableCard[] = [];

  brands: FixedAssetCardBrand[] = [];

  models: FixedAssetCardModel[] = [];

  users: User[]=[];

  currentPage: number = 1;

  perInPage: number = 25;

  totalPage: number = 1;

  consumableUnit:string;

  fixedassetpropertyvalues: FixedAssetCardPropertyValue[] = [];

  insertedProperty:FixedAssetPropertyDetails[]= [];

  isFilter:boolean=false;

  pages: Page[] = [];

  requiredProperty:boolean=false;

  newConsumableList:Consumable[]=[];

  consumableOperationEnums = {
    exitConsumableMaterial:1
  }

  /* Data Table */
  public dataTable: TreeGridTable = new TreeGridTable(
    "consumablematerial",
    [
      {
        columnDisplayName: "Malzeme Kodu",
        columnName: ["ConsumableCard","ConsumableCardCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Kategori Adı",
        columnName: ["ConsumableCard","ConsumableCategory","ConsumableCategoryName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Adı",
        columnName: ["ConsumableCard","ConsumableCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Location'),
        columnName: ["ConsumableLocation", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Toplam Miktar",
        columnName: ["ConsumableAmount"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["ConsumableCard","ConsumableCardName"]
    }
  );

  public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
    "fixedassetpropertyvalue",
    [
      {
        columnDisplayName: "Özellik Adı",
        columnName: ["FixedAssetCardProperty", "Name"],
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
      column: ["FixedAssetCardProperty", "Name"]
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

  public dataTableLocationFilter: TreeGridTable = new TreeGridTable(
    "locationfilter",
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
        columnDisplayName: "Departman",
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

  public dataTableConsumableMaterial: TreeGridTable = new TreeGridTable("fixedassetcard",
  [
    {
      columnDisplayName: "Malzeme Kodu",
      columnName: ["ConsumableCardCode"],
      isActive: true,
      classes: [],
      placeholder: "",
      type: "text"
    },
    {
      columnDisplayName: "Malzeme Adı",
      columnName: ["ConsumableCardName"],
      isActive: true,
      classes: [],
      placeholder: "",
      type: "text"
    }
  ],
  {
    isDesc: false,
    column: ["ConsumableCardName"]
  }
 );

  public dataTableCategory: TreeGridTable = new TreeGridTable(
    "category",
    [
      {
        columnDisplayName: this.getLanguageValue('Consumable_Category'),
        columnName: ["ConsumableCategoryName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["ConsumableCategoryName"]
    }
  );

  public dataTablePropertyValueForFilter: TreeGridTable = new TreeGridTable(
    "fixedassetpropertyvalueforfilter",
    [
      {
        columnDisplayName: "Özellik Adı",
        columnName: ["FixedAssetCardProperty", "Name"],
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
      column: ["FixedAssetCardProperty", "Name"]
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetProperties();
    this.loadDropdown();
    this.loadConsumableList(this.perInPage,this.currentPage,false);


    //#region DataTable Property
    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isFilterActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isScrollActive = false;
    this.dataTablePropertyValue.isDeleteable=true;

    this.dataTableLocation.isPagingActive = false;
    this.dataTableLocation.isColumnOffsetActive = false;
    this.dataTableLocation.isDeleteable = false;
    this.dataTableLocation.isMultipleSelectedActive = false;
    this.dataTableLocation.isLoading = false;
    this.dataTableLocation.isHeaderVisible = false;
    this.dataTableLocation.isScrollActive = false;

    this.dataTableDepartment.isPagingActive = false;
    this.dataTableDepartment.isColumnOffsetActive = false;
    this.dataTableDepartment.isDeleteable = false;
    this.dataTableDepartment.isMultipleSelectedActive = false;
    this.dataTableDepartment.isLoading = false;
    this.dataTableDepartment.isHeaderVisible = false;
    this.dataTableDepartment.isScrollActive = false;

    this.dataTableCategory.isPagingActive = false;
    this.dataTableCategory.isColumnOffsetActive = false;
    this.dataTableCategory.isDeleteable = false;
    this.dataTableCategory.isMultipleSelectedActive = true;
    this.dataTableCategory.isLoading = false;
    this.dataTableCategory.isHeaderVisible = false;
    this.dataTableCategory.isScrollActive = false;


    this.dataTableLocationFilter.isPagingActive = false;
    this.dataTableLocationFilter.isColumnOffsetActive = false;
    this.dataTableLocationFilter.isDeleteable = false;
    this.dataTableLocationFilter.isMultipleSelectedActive = true;
    this.dataTableLocationFilter.isLoading = false;
    this.dataTableLocationFilter.isHeaderVisible = false;
    this.dataTableLocationFilter.isScrollActive = false;


    this.dataTableConsumableMaterial.isPagingActive = false;
    this.dataTableConsumableMaterial.isColumnOffsetActive = false;
    this.dataTableConsumableMaterial.isDeleteable = false;
    this.dataTableConsumableMaterial.isMultipleSelectedActive = true;
    this.dataTableConsumableMaterial.isLoading = false;
    this.dataTableConsumableMaterial.isHeaderVisible = false;
    this.dataTableConsumableMaterial.isScrollActive = false;

    this.dataTablePropertyValueForFilter.isPagingActive = false;
    this.dataTablePropertyValueForFilter.isColumnOffsetActive = false;
    this.dataTablePropertyValueForFilter.isTableEditable = true;
    this.dataTablePropertyValueForFilter.isMultipleSelectedActive = false;
    this.dataTablePropertyValueForFilter.isFilterActive = false;
    this.dataTablePropertyValueForFilter.isLoading = false;
    this.dataTablePropertyValueForFilter.isScrollActive = false;
    this.dataTablePropertyValueForFilter.isDeleteable = true;

    this.dataTable.isPagingActive = false;


    //#endregion
   
    $(document).on("click", e => {
      if (
        $(e.target).closest(".custom-dropdown").length == 0 &&
        $(e.target).closest("#btnLocation").length == 0 && $(e.target).closest("#btnDepartment").length == 0
      ) {
        this.isLocationDropdownOpen = false;
        this.isDepartmentDropdownOpen = false;
      }
    });
  }

  ngOnInit() {}

  onSubmit(data: NgForm) {
    /* Check model state is valid */
    if (data.form.invalid == true) return;

    this.addConsumableMaterial(data);
  }

  selectedLocation: Location;
  onClickLocation(item) {
    this.selectedLocation = item;
  }

  selectedDepartment: Department;
  onClickDepartment(item) {
    this.selectedDepartment = item;
  }

  async TGT_calculatePages() {
    let items: Page[] = [];
    let totalPage = this.totalPage;

    /* if user in a diffrent page we will render throw the first page */
    if (this.currentPage > totalPage) this.currentPage = 1;
    else if (this.currentPage < 1) this.currentPage = 1;

    /* We will always put first page in to pagination items */
    items.push({
      value: 1,
      display: "1",
      isDisabled: false,
      isActive: this.currentPage == 1 ? true : false
    });

    /* if the total page is 1 return the items no more need calculation */
    if (totalPage <= 1) {
      this.pages = items;
      return;
    }

    /* we will store the last inserted item */
    let lastInsertedItem = this.currentPage - 3;

    /* if current user far enough page we will show ... (you passed many page) */
    if (lastInsertedItem > 2) {
      items.push({
        value: 0,
        display: "...",
        isDisabled: true,
        isActive: false
      });
    }

    /* We loop all pages to add pagination items */
    for (let ii = this.currentPage - 3; ii < totalPage; ii++) {
      lastInsertedItem = ii;

      /* first pages ii may be minus so we should check ii is bigger 1 */
      if (ii > 1) {
        /* Insert pagination item */
        items.push({
          value: ii,
          display: ii.toString(),
          isDisabled: false,
          isActive: this.currentPage == ii ? true : false
        });
      }

      /* maximum item we will show is 7 */
      if (items.length > 7) {
        ii = totalPage;
        break;
      }
    }

    /* After calculation if we still far from totalpage we insert ... page item */
    if (lastInsertedItem < totalPage - 1 && lastInsertedItem > 0) {
      items.push({
        value: 0,
        display: "...",
        isDisabled: true,
        isActive: false
      });
    }

    /* We always push the last page to the pagination items */
    if (!items.find(x => x.value == totalPage)) {
      items.push({
        value: totalPage,
        display: totalPage.toString(),
        isDisabled: false,
        isActive: this.currentPage == totalPage ? true : false
      });
    }

    /* We set pages to new pagination items. */
    this.pages = items;
  }

  async loadDropdown() {
    this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
      (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
        this.fixedassetproperty = fixedAssetCardProperties;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.companyService.GetCompanies(
      (companies: Company[]) => {
        this.companies = companies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.consumableCategoryService.GetConsumableCategories(
      (categories: ConsumableCategory[]) => {
        this.consumableCategories = categories;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.locationService.GetLocations(
      (locations: Location[]) => {
        this.locations = locations;
        this.dataTableLocation.TGT_loadData(this.locations);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    if (this.brands && this.brands.length == 0) {
      this.models = [];

      this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
        (brands: FixedAssetCardBrand[]) => {
          this.brands = brands;
        },
        (error: HttpErrorResponse) => {}
      );
    }

    this.baseService.departmentService.GetDepartments(
      (departments:Department[]) => {
      this.departments = departments;
      this.dataTableDepartment.TGT_loadData(this.departments);
      },
      (error: HttpErrorResponse)=>{

      });
    
      this.loadConsumableLocationDropdown();

      this.loadConsumableCategoryDropdown();

      this.loadConsumableCardDropdown();
  }

  async loadUserByDepartmentId(selectedId:number){
    this.users=[];

    if (!selectedId || selectedId == 0) {
      this.consumable.ReceivedUserId = null;

      return;
    }

    if (selectedId) {
      this.baseService.userService.GetUserByDepartmentId(
        selectedId,
        (users: User[]) => {
          this.users = users;
        },
        (error: HttpErrorResponse) => { }
      );
    }
  }

  async loadConsumableCardByCategoryId(event: any) {
    this.consumableCards = [];
    this.consumableCard.ConsumableUnit = null;    

    if (!event.target.value || event.target.value == "") {
      this.consumable.ConsumableCardId = null;
      this.consumable.ConsumableCard = new ConsumableCard();
      return;
    }
    if (event.target.value) {
      this.baseService.consumableCardService.GetConsumableCardsByCategoryId(
        <number>event.target.value,
        (consumableCards: ConsumableCard[]) => {
          this.consumableCards = consumableCards;
        },
        (error: HttpErrorResponse) => {
         
        }
      );
    }
  }

  async loadConsumableUnitByCardId(event:any){

    if (!event.target.value || event.target.value == "") {
      this.consumable.ConsumableUnits.ConsumableUnitId = null;
      this.consumable.ConsumableUnits = new ConsumableUnit();
      return;
    }
    this.baseService.consumableService.GetConsumableCardUnitByCardId(<number>event.target.value,
      (consumablecard:ConsumableCard) => {
        this.consumableCard = consumablecard; 
      },
      (error:HttpErrorResponse)=>{
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  async loadModelByBrandId(event: any) {
    this.models = [];

    if (!event.target.value || event.target.value == "") {
      this.consumable.ConsumableModelId = null;
      this.consumable.FixedAssetCardModel = new FixedAssetCardModel();
      return;
    }

    if (event.target.value) {
      this.baseService.fixedAssetCardModelService.GetFixedAssetsCardModelsByBrandId(
        <number>event.target.value,
        (models: FixedAssetCardModel[]) => {
          this.models = models;
        },
        (error: HttpErrorResponse) => {
        
        }
      );
    }
  }

  async loadFixedAssetProperties() {
    this.baseService.fixedAssetService.GetFixedAssetProperties(
      (faProperties: FixedAssetCardProperty[]) => {

        this.faProperties = faProperties;

        this.faProperties.forEach(e => {
          this.dataTable.dataColumns.push({
            columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
            columnDisplayName: e.Name,
            isActive: true,
            type: "text"
          });
        });
        this.dataTable.TGT_bindActiveColumns();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadConsumableCategoryDropdown(){
    await this.baseService.consumableCategoryService.GetConsumableCategories(
      (categories: ConsumableCategory[]) => {
        this.consumableCategories = categories;

        /* Load data to table */
        this.dataTableCategory.TGT_loadData(this.consumableCategories);


      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadConsumableCardDropdown(){
    await this.baseService.consumableCardService.GetConsumableCards(
      (consumableCards: ConsumableCard[]) => {
        this.consumableCards = consumableCards;
        this.dataTableConsumableMaterial.TGT_loadData(this.consumableCards);
        if(consumableCards.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadConsumableLocationDropdown(){
    this.baseService.locationService.GetLocations(
      (locations: Location[]) => {
        this.locations = locations;
        this.dataTableLocationFilter.TGT_loadData(this.locations);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadConsumableList(_perInPage:number=25,_currentPage:number=1,isFilter:boolean) {
    this.isFilter = isFilter;    

    let propertyDetail = <FixedAssetPropertyDetails[]>(this.dataTablePropertyValueForFilter.TGT_copySource());

    this.dataTable.TGT_clearData();

    let consumableList:Consumable=new Consumable();

    if(isFilter){
      consumableList.ConsumableCategoryIds = (<Consumable[]>this.dataTableCategory.TGT_getSelectedItems()).map(x=>x.getId());
      consumableList.ConsumableCardIds = (<Consumable[]>this.dataTableConsumableMaterial.TGT_getSelectedItems()).map(x=>x.getId());
      consumableList.ConsumableLocationIds =(<Consumable[]>this.dataTableLocationFilter.TGT_getSelectedItems()).map(x=>x.getId());    
      consumableList.FixedAssetPropertyArray = propertyDetail;
    }
    consumableList.Page = _currentPage;
    consumableList.PerPage = _perInPage; 

    /* Load all consumables to datatable */
    this.baseService.consumableService.GetConsumableList(consumableList,
      (consumables: Consumable[], totalPage: number,
        message: string) => {
        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.dataTable.perInPage = _perInPage;
        this.consumables = consumables;
        this.totalPage = totalPage ? totalPage : 1;
        

        consumables.forEach(e=>{
          e.FixedAssetPropertyDetails.forEach(p=>{
            if(p.FixedAssetCardPropertyId){
              e["PROP_" + p.FixedAssetCardPropertyId.toString()] = p.Value;
            }
          });
        });  

        if (this.consumables.length == 0) {
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }

        this.TGT_calculatePages();

        Object.assign(this.newConsumableList,consumables)  

        this.dataTable.TGT_loadData(this.newConsumableList);

      },
      (error: HttpErrorResponse) => {
        this.dataTable.isLoading=false;
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.popupComponent.CloseModal('#modalFilterForConsumableList'); 

  }

  selectedConsumableMaterial(){

    let selectedItems = <Consumable[]>this.dataTable.TGT_getSelectedItems()

      if(!selectedItems || selectedItems.length == 0){
        this.baseService.popupService.ShowAlertPopup(
          "Lütfen en az bir sarf malzeme seçiniz!"
        );
        return;
      }

      if (selectedItems.length > 1) {
        this.baseService.popupService.ShowAlertPopup(
          "Birden fazla sarf malzeme seçtiniz!"
        );

        return;
      }

      if(selectedItems[0].ConsumableParentId == null){
        this.baseService.popupService.ShowAlertPopup("Lütfen malzeme kartının altında bulunan bir sarf malzeme seçiniz!");
        return;
      }


      let selectedId:number = selectedItems[0].ConsumableId;

      this.dataTablePropertyValue.TGT_clearData();

      this.insertedProperty=[];

      this.getConsumableMaterialById(selectedId);
  }

  getConsumableMaterialById(consumableId:number){

    //this.insertedProperty = [];

    $("#btnExitConsumable").trigger("click");

    this.baseService.consumableService.GetConsumableMaterialById(consumableId,
      (consumable:Consumable[])=>{

        Object.assign(this.consumable, consumable[0]);

        this.consumableUnit = this.consumable.ConsumableCard.ConsumableUnit.ConsumableUnitName;

        let property:FixedAssetPropertyDetails[] =  consumable[0].FixedAssetPropertyDetails;

        property.forEach(e=>{

        let propertydetails: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();

        propertydetails.FixedAssetPropertyDetailId = e.FixedAssetPropertyDetailId;
        propertydetails.FixedAssetCardProperty = e.FixedAssetCardProperty;
        propertydetails.Value = e.Value;

        this.insertedProperty.push(propertydetails);
        });

        this.dataTablePropertyValue.TGT_loadData(this.insertedProperty);
      },
      (error:HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  getPropertyValue(event: any) {
    this.propertyValue = event.target.value;

    this.visible = false;
    
    this.fixedAssetPropertyDetail.Value = null;
  }

  async loadValuesByPropertyId(event) {

    this.isSelectedProperty = true;

    this.visible = false;

    let fixedAssetProperty = this.fixedassetproperty.find(
      x => x.FixedAssetCardPropertyId == Number(event.target.value)
    );

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

  insertPropertyValueToArray(propertyId: any) {

    if(this.isFilter)
    this.faPropertyDetails = <FixedAssetPropertyDetails[]>(this.dataTablePropertyValueForFilter.TGT_copySource());
    else
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

        if(this.fixedAssetPropertyDetail.Value != null || this.fixedAssetCardPropertyValue.FixedAssetPropertyValueId !=null){
        
            let fixedasset = this.fixedassetproperty.find(
              x => x.FixedAssetCardPropertyId == Number(propertyId.value)
            );
      
            this.fixedAssetPropertyDetail.FixedAssetPropertyDetailId =
              (this.faPropertyDetails.length + 1) * -1;
      
            this.fixedAssetPropertyDetail.FixedAssetCardProperty = fixedasset;
      
            if (this.isListSelected == true)
              this.fixedAssetPropertyDetail.Value = this.propertyValue;
            this.faPropertyDetails.push(this.fixedAssetPropertyDetail);

            if(this.isFilter)
            this.dataTablePropertyValueForFilter.TGT_loadData(this.faPropertyDetails);
            else      
            this.dataTablePropertyValue.TGT_loadData(this.faPropertyDetails);
      
            this.fixedAssetPropertyDetail = new FixedAssetPropertyDetails();
            this.fixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
            propertyId = null;
            this.visible = false;
            this.isSelectedProperty = false;

        }
        else{
          this.visiblePropertyName=true;    
        } 
      }
      else{
          this.visible=true;
          this.visiblePropertyName=true;    
      }
  }

  addConsumableMaterial(data: NgForm) {

    let propertyDetail = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

    /* Check model state is valid */
    if (data.form.invalid == true && propertyDetail.length == 0){
      this.visibleRequiredProperty=true;
      return;  
    } 

    let insertedItem: Consumable = new Consumable();


    if(propertyDetail.length == 0){    
      this.visibleRequiredProperty=true;
      return;
    }
    else
    this.visibleRequiredProperty=false;


    insertedItem.ConsumableLocationId=this.selectedLocation.LocationId;

    Object.assign(insertedItem, this.consumable);
    insertedItem.FixedAssetPropertyDetails = propertyDetail;

    this.baseService.consumableService.InsertConsumableMaterial(
      insertedItem,
      (consumableItem:Consumable, message) => {
        this.isWaitingInsertOrUpdate = false;

        this.baseService.popupService.ShowSuccessPopup(message);

        insertedItem.ConsumableId = consumableItem.ConsumableId;

        this.refreshTable();

        this.resetForm(data,true);
        
      
        //Api düzelttirilecek! Yanlış nesne dönüyor.

        //this.consumables.push(insertedItem);

        //this.dataTable.TGT_loadData(this.consumables);

      },
      (error:HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  exitConsumableMaterial(data:NgForm){
    /* Check model state is valid */
    if (data.form.invalid == true) return;

    let exitItem: Consumable = new Consumable();

    let propertyDetail = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

    this.exitconsumable.ConsumableId = this.consumable.ConsumableId;

    Object.assign(exitItem, this.exitconsumable);
    exitItem.FixedAssetPropertyDetails = propertyDetail;
    exitItem.ReceivedDepartmentId = this.selectedDepartment.DepartmentId;
    exitItem.FreeExitAmount = Number(this.exitconsumable.FreeExitAmount);
    exitItem.ReceivedUserId = Number(this.exitconsumable.ReceivedUserId); 
    exitItem.ConsumableCategoryId = Number(this.consumable.ConsumableCard.ConsumableCategoryId);  
    exitItem.ConsumableParentId = Number(this.consumable.ConsumableParentId);


    this.baseService.consumableService.ExitConsumableMaterial(
      exitItem,
      (consumableItem:Consumable,message) => {
        this.isWaitingInsertOrUpdate = false;

        this.baseService.popupService.ShowSuccessPopup(message);

        exitItem.ConsumableId = consumableItem.ConsumableId;

        //$('refreshTable').trigger('click');

        this.dataTablePropertyValue.TGT_clearData();      

        this.selectedDepartment=null;

        this.refreshTable();

        this.resetForm(data, true);
      },
      (error:HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  isFilterConsumableList(isFilter:boolean){

    this.loadConsumableList(this.perInPage,this.currentPage,isFilter);
  }

  toggleDropdown(key: string) {
    switch (key) {
      case "location":
        this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
        this.isCardDropdownOpen = false;
        this.isCategoryDropdownOpen = false;
        break;
        case "department":
        this.isDepartmentDropdownOpen=!this.isDepartmentDropdownOpen; 
        this.loadUserByDepartmentId(this.selectedDepartment.DepartmentId);    
        break;
        case "category":
        this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;      
        this.isCardDropdownOpen = false;
        this.isLocationDropdownOpen = false;
        break;
        case "card":
        this.isCardDropdownOpen = !this.isCardDropdownOpen;
        this.isCategoryDropdownOpen = false;
        this.isLocationDropdownOpen = false;
        break;
    }
  }

  public doOperation(operationType: number) {
    switch(operationType){
      case this.consumableOperationEnums.exitConsumableMaterial:
      this.selectedConsumableMaterial();
      this.dataTablePropertyValue.isDeleteable=false;
      break;
    }
  }

  resetForm(data: NgForm, isNewItem: boolean) {
    if (isNewItem == true) {
      this.consumable = new Consumable();   
    }
    data.reset();
    
    data.resetForm(this.consumable);

    this.selectedLocation = null;

    this.dataTablePropertyValue.TGT_clearData();

    this.consumableCard = new ConsumableCard();

    this.visibleRequiredProperty=false;
  }

  resetExitForm(data: NgForm, isNewItem: boolean){
    if (isNewItem == true) {
      this.exitconsumable = new Consumable();   
    }

    this.dataTablePropertyValue.TGT_clearData();

    this.dataTablePropertyValue.isDeleteable = true;

    data.reset();
    
    data.resetForm(this.exitconsumable);

    this.selectedDepartment=null;

    this.consumableCard = new ConsumableCard();

  }

  
  resetDropdown(key:string){
    switch(key){
      case "location":
      this.selectedLocation = null;
      this.dataTableLocation.TGT_clearData();
      this.dataTableLocationFilter.TGT_clearData();
      this.loadConsumableLocationDropdown();
      this.loadDropdown();
      break;
      case "department":
      this.selectedDepartment = null;      
      break;
      case "category":
      this.dataTableCategory.TGT_clearData();
      this.loadConsumableCategoryDropdown();
      break;
      case "card":
      this.dataTableConsumableMaterial.TGT_clearData();
      this.loadConsumableCardDropdown();
      break;
    }
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadConsumableList(this.perInPage,this.currentPage,false);

    this.isTableRefreshing = false;

    this.visibleRequiredProperty=false;

  }

  clearFilterConsumableList(){
    this.isFilter=false;

    this.dataTableCategory.TGT_clearData();

    this.dataTableConsumableMaterial.TGT_clearData();

    this.dataTableLocationFilter.TGT_clearData();

    this.loadConsumableCardDropdown();

    this.loadConsumableCategoryDropdown();

    this.loadConsumableLocationDropdown();

    this.fixedAssetPropertyDetail = new FixedAssetPropertyDetails();

    this.fixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();

  }

  filter(){
    this.isFilter=true;

    this.popupComponent.ShowModal('#modalFilterForConsumableList'); 
  }
}
