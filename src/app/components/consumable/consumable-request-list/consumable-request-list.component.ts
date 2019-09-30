import { Component, OnInit, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { NotDeletedItem } from "src/app/models/NotDeletedItem";
import { ConsumableRequest } from "../../../models/ConsumableRequest";
import { Page } from "src/app/extends/TreeGridTable/models/Page";
import { ConsumableCard } from "src/app/models/ConsumableCard";
import { ConsumableCategory } from "src/app/models/ConsumableCategory";
import { FixedAssetCardProperty } from "src/app/models/FixedAssetCardProperty";
import { Consumable } from "src/app/models/Consumable";
import { ConsumableUnit } from "src/app/models/ConsumableUnit";
import { FixedAssetPropertyDetails } from "src/app/models/FixedAssetPropertyDetails";
import { FixedAssetCardPropertyValue } from "src/app/models/FixedAssetCardPropertyValue";
import { ConsumableLogTypes } from 'src/app/declarations/consumable-log-types';
import { MatTabChangeEvent } from '@angular/material';
import { PropertyValueTypes } from 'src/app/declarations/property-value-types.enum';
import { Location } from 'src/app/models/Location';

@Component({
  selector: "app-consumable-request-list",
  templateUrl: "./consumable-request-list.component.html",
  styleUrls: ["./consumable-request-list.component.css"]
})
export class ConsumableRequestListComponent extends BaseComponent
  implements OnInit {

  consumables: Consumable[] = [];

  newConsumableList:Consumable[]=[];

  consumable: ConsumableRequest = new ConsumableRequest();

  consumableRequest: ConsumableRequest = new ConsumableRequest();

  receiveConsumableMaterial: ConsumableRequest = new ConsumableRequest();

  requestList: ConsumableRequest[] = [];

  requestListFilter: ConsumableRequest[] = [];

  consumableCard: ConsumableCard = new ConsumableCard();

  consumableCards: ConsumableCard[] = [];

  consumableCategories: ConsumableCategory[] = [];

  fixedassetproperty: FixedAssetCardProperty[] = [];

  locations:Location[]=[];

  faPropertyDetails: FixedAssetPropertyDetails[] = [];

  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();

  fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();

  faProperties: FixedAssetCardProperty[] = [];

  insertedProperty:FixedAssetPropertyDetails[]= [];

  fixedassetpropertyvalues: FixedAssetCardPropertyValue[] = [];

  currentPage: number = 1;

  perInPage: number = 25;

  totalPage: number = 1;

  pages: Page[] = [];

  propertyValue: string;

  isListSelected: boolean = false;

  sameProperty: boolean = false;

  visiblePropertyName: boolean = false;

  visibleProperty:boolean=false;

  isSelectedProperty: boolean = false;

  visible: boolean = false;

  isWaitingInsertOrUpdate: boolean = false;

  isTableRefreshing: boolean = false;

  isTableExporting: boolean = false;

  submitDescription:boolean=false;

  requestedUser : string;

  selectedLogId:number;

  currentTab:number = 0;

  visibleConsumableButton:boolean=false;

  visibleRequestButton:boolean=true;

  consumableUnit:string;

  selectedConsumableId:number;

  isCategoryDropdownOpen:boolean = false;

  isCardDropdownOpen:boolean = false;

  isLocationDropdownOpen:boolean = false;

  filterRequestList:ConsumableRequest=new ConsumableRequest();

  isFilter:boolean=false;

  isConsumableFilter:boolean=false;

  key:number;  

   //#region DataTable 
  /* Data Table */
  public dataTableConsumableList: TreeGridTable = new TreeGridTable(
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
      }   
    ],
    {
      isDesc: false,
      column: ["ConsumableCard","ConsumableCardName"]
    }
  );

  public dataTableRequestedList: TreeGridTable = new TreeGridTable(
    "requestlist",
    [
      {
        columnDisplayName: "Talep Numarası",
        columnName: ["Number"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Kodu",
        columnName: ["ConsumableCard", "ConsumableCardCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Kategorisi",
        columnName: ["ConsumableCategory", "ConsumableCategoryName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Adı",
        columnName: ["ConsumableCard", "ConsumableCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Talep Açıklaması",
        columnName: ["Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Talep Edilen Miktar",
        columnName: ["RequestedAmount"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },  
      {
        columnDisplayName: "Talep Eden Personel",
        columnName: ["RequestedUser"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.RequestedUser != null ? value.RequestedUser.FirstName + ' ' + value.RequestedUser.LastName : '';
          }
          else {
            return '';
          }
        }
      }
    ],
    {
      isDesc: false,
      column: ["ConsumableCard", "ConsumableCardName"]
    }
  );

  public dataTableClosedRequestList: TreeGridTable = new TreeGridTable(
    "closedrequestlist",
    [
      {
        columnDisplayName: "Talep Numarası",
        columnName: ["Number"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Kodu",
        columnName: ["ConsumableCard", "ConsumableCardCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Kategorisi",
        columnName: ["ConsumableCategory", "ConsumableCategoryName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Adı",
        columnName: ["ConsumableCard", "ConsumableCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
    
      {
        columnDisplayName: "Talep Edilen Miktar",
        columnName: ["RequestedAmount"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },      
      {
        columnDisplayName: "Karşılanan Miktar - Birim",
        columnName: ["ReceivedAmount"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }, 
      {
        columnDisplayName: "Talep Eden Personel",
        columnName: ["RequestedUser"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.RequestedUser != null ? value.RequestedUser.FirstName + ' ' + value.RequestedUser.LastName : '';
          }
          else {
            return '';
          }
        }
      },
      {
        columnDisplayName: "Talebi Karşılayan Personel",
        columnName: ["ReceivedUser"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.ReceivedUser != null ? value.ReceivedUser.FirstName + ' ' + value.ReceivedUser.LastName : '';
          }
          else {
            return '';
          }
        }
      },   
      {
        columnDisplayName: "Talep Açıklaması",
        columnName: ["Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Talep Karşılama Açıklaması",
        columnName: ["DescriptionArray"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },   
    ],
    {
      isDesc: false,
      column: ["ConsumableCard", "ConsumableCardName"]
    }
  );

  
  public dataTableCanceledList: TreeGridTable = new TreeGridTable(
    "canceledrequestlist",
    [
      {
        columnDisplayName: "Talep Numarası",
        columnName: ["Number"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Kodu",
        columnName: ["ConsumableCard", "ConsumableCardCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Kategorisi",
        columnName: ["ConsumableCategory", "ConsumableCategoryName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Adı",
        columnName: ["ConsumableCard", "ConsumableCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Talep Edilen Miktar",
        columnName: ["RequestedAmount"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Talep Açıklaması",
        columnName: ["Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }, 
      {
        columnDisplayName: "Talep İptal Açıklaması",
        columnName: ["DescriptionCanceledArray"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },     
      {
        columnDisplayName: "Talep Eden Personel",
        columnName: ["RequestedUser"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.RequestedUser != null ? value.RequestedUser.FirstName + ' ' + value.RequestedUser.LastName : '';
          }
          else {
            return '';
          }
        }
      },     
      {
        columnDisplayName: "İptal Eden Personel",
        columnName: ["User"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.User != null ? value.User.FirstName + ' ' + value.User.LastName : '';
          }
          else {
            return '';
          }
        }
      }
    ],
    {
      isDesc: false,
      column: ["ConsumableCard", "ConsumableCardName"]
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

  public dataTablePropertyValueForConsumableListFilter: TreeGridTable = new TreeGridTable(
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

  public dataTableRequestPropertyValue: TreeGridTable = new TreeGridTable(
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


  //#endregion

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetProperties();
    this.loadConsumableList(this.perInPage,this.currentPage,false);
    this.loadDropdown();

    //#region DataTable Properties

    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isFilterActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isScrollActive = false;
    this.dataTablePropertyValue.isDeleteable = false;

    
    this.dataTablePropertyValueForFilter.isPagingActive = false;
    this.dataTablePropertyValueForFilter.isColumnOffsetActive = false;
    this.dataTablePropertyValueForFilter.isTableEditable = true;
    this.dataTablePropertyValueForFilter.isMultipleSelectedActive = false;
    this.dataTablePropertyValueForFilter.isFilterActive = false;
    this.dataTablePropertyValueForFilter.isLoading = false;
    this.dataTablePropertyValueForFilter.isScrollActive = false;
    this.dataTablePropertyValueForFilter.isDeleteable = true;

    this.dataTablePropertyValueForConsumableListFilter.isPagingActive = false;
    this.dataTablePropertyValueForConsumableListFilter.isColumnOffsetActive = false;
    this.dataTablePropertyValueForConsumableListFilter.isTableEditable = true;
    this.dataTablePropertyValueForConsumableListFilter.isMultipleSelectedActive = false;
    this.dataTablePropertyValueForConsumableListFilter.isFilterActive = false;
    this.dataTablePropertyValueForConsumableListFilter.isLoading = false;
    this.dataTablePropertyValueForConsumableListFilter.isScrollActive = false;
    this.dataTablePropertyValueForConsumableListFilter.isDeleteable = true;

    this.dataTableRequestPropertyValue.isPagingActive = false;
    this.dataTableRequestPropertyValue.isColumnOffsetActive = false;
    this.dataTableRequestPropertyValue.isTableEditable = true;
    this.dataTableRequestPropertyValue.isMultipleSelectedActive = false;
    this.dataTableRequestPropertyValue.isFilterActive = false;
    this.dataTableRequestPropertyValue.isLoading = false;
    this.dataTableRequestPropertyValue.isScrollActive = false;    

    this.dataTableRequestedList.isPagingActive = false;
    this.dataTableRequestedList.isLoading = false;

    this.dataTableClosedRequestList.isPagingActive=false;
    this.dataTableClosedRequestList.isLoading = false;

    this.dataTableCanceledList.isPagingActive=false;
    this.dataTableCanceledList.isLoading = false;

    this.dataTableCategory.isPagingActive = false;
    this.dataTableCategory.isColumnOffsetActive = false;
    this.dataTableCategory.isDeleteable = false;
    this.dataTableCategory.isMultipleSelectedActive = true;
    this.dataTableCategory.isLoading = false;
    this.dataTableCategory.isHeaderVisible = false;
    this.dataTableCategory.isScrollActive = false;

    this.dataTableConsumableMaterial.isPagingActive = false;
    this.dataTableConsumableMaterial.isColumnOffsetActive = false;
    this.dataTableConsumableMaterial.isDeleteable = false;
    this.dataTableConsumableMaterial.isMultipleSelectedActive = true;
    this.dataTableConsumableMaterial.isLoading = false;
    this.dataTableConsumableMaterial.isHeaderVisible = false;
    this.dataTableConsumableMaterial.isScrollActive = false;

    this.dataTableLocation.isPagingActive = false;
    this.dataTableLocation.isColumnOffsetActive = false;
    this.dataTableLocation.isDeleteable = false;
    this.dataTableLocation.isMultipleSelectedActive = true;
    this.dataTableLocation.isLoading = false;
    this.dataTableLocation.isHeaderVisible = false;
    this.dataTableLocation.isScrollActive = false;

    this.dataTableConsumableList.isPagingActive=false;

    //#endregion

    $(document).on("click", e => {
      if (
        $(e.target).closest(".custom-dropdown").length == 0 &&
        $(e.target).closest("#btnConsumableCategory").length == 0 && $(e.target).closest("#btnConsumableMaterial").length == 0
        && $(e.target).closest("#btnLocation").length == 0
      ) {
        this.isCategoryDropdownOpen = false;   
        this.isCardDropdownOpen = false;
        this.isLocationDropdownOpen = false;
      }
    });
  }

  ngOnInit() {}

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

  toggleDropdown(key: string) {
    switch (key) {
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
      case "location":
      this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
      this.isCategoryDropdownOpen = false;
      this.isCardDropdownOpen = false;
      break;
    }
  }

  resetDropdown(key:string){
    switch(key){
      case "category":
      this.dataTableCategory.TGT_clearData();
      this.loadConsumableCategoryDropdown();
      break;
      case "card":
      this.dataTableConsumableMaterial.TGT_clearData();
      this.loadConsumableCardDropdown();
      break;
      case "location":
      this.dataTableLocation.TGT_clearData();
      this.loadConsumableLocationDropdown();
      break;
    }
  }

  //#region LoadDropdowns

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
        this.dataTableLocation.TGT_loadData(this.locations);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadDropdown() {
    await this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
      (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
        this.fixedassetproperty = fixedAssetCardProperties;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.loadConsumableCategoryDropdown();

    this.loadConsumableCardDropdown();

    this.loadConsumableLocationDropdown();
  }

  async loadConsumableCardByCategoryId(event: any) {
    this.consumableCards = [];
    this.consumableCard.ConsumableUnit = null;

    if (!event.target.value || event.target.value == "") {
      this.consumable.ConsumableCardId = null;
      //  this.consumable.ConsumableCard = new ConsumableCard();
      return;
    }
    if (event.target.value) {
      this.baseService.consumableCardService.GetConsumableCardsByCategoryId(
        <number>event.target.value,
        (consumableCards: ConsumableCard[]) => {
          this.consumableCards = consumableCards;
        },
        (error: HttpErrorResponse) => {}
      );
    }
  }

  async loadConsumableUnitByCardId(event: any) {
    this.consumableCard = new ConsumableCard();

    this.baseService.consumableService.GetConsumableCardUnitByCardId(
      <number>event.target.value,
      (consumablecard: ConsumableCard) => {
        this.consumableCard = consumablecard;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  //#endregion

  isFilterConsumableList(isFilter:boolean){

    this.isConsumableFilter = true;

    this.loadConsumableList(this.perInPage,this.currentPage,isFilter);
  }

  async loadConsumableList(_perInPage: number = 25,_currentPage: number = 1, isFilter:boolean){

    this.isConsumableFilter=isFilter;

    let propertyDetail = <FixedAssetPropertyDetails[]>(this.dataTablePropertyValueForFilter.TGT_copySource());

    let consumableList:Consumable=new Consumable();

    if(isFilter){
      consumableList.ConsumableCategoryIds = (<Consumable[]>this.dataTableCategory.TGT_getSelectedItems()).map(x=>x.getId());
      consumableList.ConsumableCardIds = (<Consumable[]>this.dataTableConsumableMaterial.TGT_getSelectedItems()).map(x=>x.getId());
      consumableList.ConsumableLocationIds =(<Consumable[]>this.dataTableLocation.TGT_getSelectedItems()).map(x=>x.getId());    
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
        this.dataTableConsumableList.perInPage = _perInPage;
        this.consumables = consumables;
        this.totalPage = totalPage ? totalPage : 1;       

        this.consumables.forEach(e=>{
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

        Object.assign(this.newConsumableList,consumables);

        this.dataTableConsumableList.TGT_clearData();

        this.dataTableConsumableList.TGT_loadData(this.consumables);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.popupComponent.CloseModal('#modalFilterForConsumableList');
  }
  
  isFilterRequestList(isFilter:boolean){    

    this.isFilter=true;

    this.loadConsumableRequestList(this.perInPage,this.currentPage,this.currentPage,isFilter);
  }

  async loadConsumableRequestList(_perInPage: number = 25,_currentPage: number = 1,tabIndex:number,isFilter:boolean) {

    let consumableLogType:number[]=[];

    tabIndex = this.currentTab;

    let propertyDetail = <FixedAssetPropertyDetails[]>(this.dataTablePropertyValueForFilter.TGT_copySource());

    switch(tabIndex){
      case 1:
      consumableLogType.push(ConsumableLogTypes.CONSUMABLE_MATERIAL_REQUEST);
      break; 
      case 2:
      consumableLogType.push(ConsumableLogTypes.CONSUMABLE_MATERIAL_RECEIVED);
      break;
      case 3:
      consumableLogType.push(ConsumableLogTypes.CONSUMABLE_MATERIAL_REQUEST_CANCEL);      
      break;
    }

    let filterRequestList:ConsumableRequest = new ConsumableRequest();

    Object.assign(filterRequestList,this.filterRequestList);
    
    if(isFilter){
      filterRequestList.ConsumableCategoryIds = (<ConsumableRequest[]>this.dataTableCategory.TGT_getSelectedItems()).map(x=>x.getId());
      filterRequestList.ConsumableCardIds = (<ConsumableRequest[]>this.dataTableConsumableMaterial.TGT_getSelectedItems()).map(x=>x.getId());
      filterRequestList.FixedAssetPropertyArray = propertyDetail;
      filterRequestList.ConsumableNumber = Number(this.filterRequestList.ConsumableNumber);
    }

    filterRequestList.Page = _currentPage;
    filterRequestList.PerPage = _perInPage;
    filterRequestList.ConsumableLogTypeIds = consumableLogType;

    this.baseService.consumableRequestListService.GetConsumableRequestListWithFilter(filterRequestList,
    (requestList: ConsumableRequest[],
      totalPage: number,
      message: string)=>{
        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.dataTableRequestedList.perInPage = _perInPage;
        this.requestListFilter = requestList;
        this.totalPage = totalPage ? totalPage : 1;
       
        this.requestListFilter.forEach(e => {
          e.Consumable.FixedAssetPropertyDetails.forEach(p => {
            if (p.FixedAssetCardPropertyId) {
              e["PROP_" + p.FixedAssetCardPropertyId.toString()] = p.Value;
            }
          });
        });

        switch(tabIndex){
          case 1:
          this.dataTableRequestedList.TGT_loadData(this.requestListFilter);
          break; 
          case 2:
          this.dataTableClosedRequestList.TGT_loadData(this.requestListFilter);
          break;
          case 3:
          this.dataTableCanceledList.TGT_loadData(this.requestListFilter);  
          break;
        }

        this.TGT_calculatePages();

        this.popupComponent.CloseModal('#modalFilterForRequestList');
    },
    (error:HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });  
  }

  async loadFixedAssetProperties() {
    this.baseService.fixedAssetService.GetFixedAssetProperties(
      (faProperties: FixedAssetCardProperty[]) => {
        this.faProperties = faProperties;
        this.faProperties.forEach(e => {
          this.dataTableConsumableList.dataColumns.push({
            columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
            columnDisplayName: e.Name,
            isActive: true,
            type: "text"
          });
        });
        this.dataTableConsumableList.TGT_bindActiveColumns();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadFixedAssetPropertiesForConsumableType(tabIndex:number){

    switch(tabIndex){
      case 1:
   
      this.faProperties.forEach(e => {
        this.dataTableRequestedList.dataColumns.push({
          columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
          columnDisplayName: e.Name,
          isActive: true,
          type: "text"
        });
      });
      this.dataTableRequestedList.TGT_bindActiveColumns();
      break;
      case 2:
      this.faProperties.forEach(e => {
        this.dataTableClosedRequestList.dataColumns.push({
          columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
          columnDisplayName: e.Name,
          isActive: true,
          type: "text"
        });
      });
      this.dataTableClosedRequestList.TGT_bindActiveColumns();
      break;
      case 3:
      this.faProperties.forEach(e => {
        this.dataTableCanceledList.dataColumns.push({
          columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
          columnDisplayName: e.Name,
          isActive: true,
          type: "text"
        });
      });
      this.dataTableCanceledList.TGT_bindActiveColumns();
      break;
    }

  }

  selectedConsumableMaterial(){

    let selectedItems = <Consumable[]>this.dataTableConsumableList.TGT_getSelectedItems();

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

      this.dataTablePropertyValue.TGT_clearData();

      this.insertedProperty = [];
      
      let selectedId:number = selectedItems[0].ConsumableId;

      this.selectedConsumableId = selectedId;

      this.getConsumableMaterialById(selectedId);
  }

  getPropertyValue(event: any) {

    this.visible = false;
  
    this.propertyValue=event.target.value;
  
    this.fixedAssetPropertyDetail.Value = event.target.value;
  }

  getConsumableMaterialById(consumableId:number){

      //this.insertedProperty = [];

      $("#btnAddRequest").trigger("click");

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

  insertPropertyValueToArray(propertyId: any) {

    this.visiblePropertyName = false;

    if(this.fixedAssetPropertyDetail.FixedAssetCardPropertyId == null)
    this.fixedassetpropertyvalues = [];

    this.faPropertyDetails = <FixedAssetPropertyDetails[]>(this.dataTablePropertyValueForFilter.TGT_copySource());

    if (this.isListSelected == false)
      this.propertyValue = this.fixedAssetPropertyDetail.Value;

    this.faPropertyDetails.forEach(e => {
      if (e.FixedAssetCardPropertyId == this.fixedAssetPropertyDetail.FixedAssetCardPropertyId && e.Value == this.propertyValue)
        this.sameProperty = true;
    });

    if (this.sameProperty == true) {
      this.sameProperty = false;
      return;
    }

    if (this.fixedAssetPropertyDetail.FixedAssetCardPropertyId != null) {
      this.visiblePropertyName = false;

      if (this.fixedAssetPropertyDetail.Value != null || this.fixedAssetCardPropertyValue.FixedAssetPropertyValueId != null) {
        let fixedasset = this.fixedassetproperty.find(
          x => x.FixedAssetCardPropertyId == Number(propertyId.value)
        );

        this.fixedAssetPropertyDetail.FixedAssetPropertyDetailId =
          (this.faPropertyDetails.length + 1) * -1;

        this.fixedAssetPropertyDetail.FixedAssetCardProperty = fixedasset;

        if (this.isListSelected == true)
          this.fixedAssetPropertyDetail.Value = this.propertyValue;

        this.faPropertyDetails.push(this.fixedAssetPropertyDetail);

        this.dataTablePropertyValueForFilter.TGT_loadData(this.faPropertyDetails);

        this.fixedAssetPropertyDetail = new FixedAssetPropertyDetails();

        this.fixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();

        propertyId = null;

        this.visible = false;

        this.isSelectedProperty = false;
      } else {
        this.visiblePropertyName = true;
      }
    } else {
      this.visible = true;

      this.visiblePropertyName = true;
    }
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

  tabChanged(tabChangeEvent: MatTabChangeEvent) {

    this.isFilter=false;

    this.isConsumableFilter=false;

    this.currentTab = tabChangeEvent.index; 

    this.dataTableCategory.TGT_clearData();

    this.dataTableConsumableMaterial.TGT_clearData();

    this.dataTableLocation.TGT_clearData();

    this.dataTablePropertyValueForFilter.TGT_clearData()

    this.loadConsumableCardDropdown();

    this.loadConsumableCategoryDropdown();

    this.loadConsumableLocationDropdown();

    if (tabChangeEvent.index == 0) {   
      this.visibleRequestButton = true;
      this.visibleConsumableButton = false;

      this.loadConsumableList(this.perInPage,this.currentPage,false);
    } 
    else if (tabChangeEvent.index == 1) {
      this.visibleRequestButton = false;
      this.visibleConsumableButton = true;
      this.loadConsumableRequestList(this.perInPage,this.currentPage,1,false);
      this.loadFixedAssetPropertiesForConsumableType(1);
    }
    else if(tabChangeEvent.index == 2){
      this.visibleRequestButton = false;
      this.visibleConsumableButton = false;
      this.loadConsumableRequestList(this.perInPage,this.currentPage,2,false);
      this.loadFixedAssetPropertiesForConsumableType(2);
    }
    else if(tabChangeEvent.index == 3){
      this.visibleRequestButton = false;
      this.visibleConsumableButton = false;
      this.loadConsumableRequestList(this.perInPage,this.currentPage,3,false);
      this.loadFixedAssetPropertiesForConsumableType(3);
    }
  }
 
  requestConsumableMaterial(data: NgForm) {
    if (data.form.invalid == true) return;

    let insertedItem: ConsumableRequest = new ConsumableRequest();

 
    Object.assign(insertedItem, this.consumable);

    insertedItem.RequestedAmount=Number(this.consumable.RequestedAmount);
    insertedItem.ConsumableId = this.selectedConsumableId;
    insertedItem.Description = this.consumable.Description;

    this.baseService.consumableRequestListService.RequestConsumableMaterial(
      insertedItem,
      (requestItem: ConsumableRequest,message) => {
        this.isWaitingInsertOrUpdate = false;

        this.baseService.popupService.ShowSuccessPopup(message);

        this.popupComponent.CloseModal('#modalRequestConsumable');

        this.resetForm(data, true);

        this.refreshTable();        

      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  selectedRequestConsumableMaterial() {

    let selectedItems = <ConsumableRequest[]>(
      this.dataTableRequestedList.TGT_getSelectedItems()
    );

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir talep seçiniz!"
      );
      return;
    }

    if (selectedItems.length > 1) {
      this.baseService.popupService.ShowAlertPopup(
        "Birden fazla talep seçtiniz!"
      );

      return;
    }
    this.insertedProperty=[];

    let selectedId: number = selectedItems[0].ConsumableLogId;

    this.getRequestConsumableMaterial(selectedId);
  }

 async getRequestConsumableMaterial(selectedLogId: number) {

    $("#btnCancelRequest").trigger("click");

    this.selectedLogId=selectedLogId;

    this.baseService.consumableRequestListService.GetRequestConsumableMaterial(
      selectedLogId,
      (consumableRequest:ConsumableRequest) => {
        Object.assign(this.consumableRequest, consumableRequest[0]);
    
        if(this.consumable.User != null)
        this.requestedUser = this.consumableRequest.User.FirstName  + " " +this.consumableRequest.User.LastName; 

        let property:FixedAssetPropertyDetails[] =  this.consumableRequest.Consumable.FixedAssetPropertyDetails;

        property.forEach(e => { 
        let propertydetails: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();

        propertydetails.FixedAssetPropertyDetailId = e.FixedAssetPropertyDetailId;
        propertydetails.FixedAssetCardProperty = e.FixedAssetCardProperty;
        propertydetails.Value = e.Value;

        this.insertedProperty.push(propertydetails);
        });

        this.dataTableRequestPropertyValue.TGT_loadData(this.insertedProperty);

      },
      (error: HttpErrorResponse) => {}
    );
  }

  onSubmit(){
    this.popupComponent.ShowModal('#modalShowQuestionPopupForCancelRequest');
  }

  cancelRequestConsumableMaterial(data:NgForm){

    data.resetForm(data);

    if(this.receiveConsumableMaterial.Description == null || this.receiveConsumableMaterial.Description == '') {
      this.submitDescription = true;
      return;
    }

    this.baseService.spinner.show();

    this.baseService.consumableRequestListService.CancelRequestConsumableMaterial(this.selectedLogId,
      (result:any,message:string)=>{

        this.baseService.spinner.hide();

        this.baseService.popupService.ShowSuccessPopup(message);

        this.refreshTable();

        this.popupComponent.CloseModal('#modalShowQuestionPopupForCancelRequest');

        $('#CloseCancelModal').trigger('click');

      },
      (error:HttpErrorResponse) => {
        this.baseService.spinner.show();

        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  receivedConsumableMaterial(data:NgForm){
    this.submitDescription = false;

    if (data.form.invalid == true) return;

    this.baseService.spinner.show();

    let receivedItem: ConsumableRequest = new ConsumableRequest();

    Object.assign(receivedItem,this.consumableRequest);

    receivedItem.ReceivedAmount = this.receiveConsumableMaterial.ReceivedAmount;
    receivedItem.Description = this.receiveConsumableMaterial.Description;
    receivedItem.ConsumableCategoryId = this.receiveConsumableMaterial.ConsumableCategoryId;
    receivedItem.ConsumableParentId = this.consumableRequest.ConsumableParentId;

    this.baseService.consumableRequestListService.ReceivedConsumableMaterial(receivedItem,(result:any,message)=>{

      console.log(result);
      
      this.baseService.spinner.hide();

      this.baseService.popupService.ShowSuccessPopup(message);

      this.refreshTable();

      this.resetRequestForm(data,true);

      
    },
    (error:HttpErrorResponse)=>{
      this.baseService.spinner.hide();

      this.baseService.popupService.ShowErrorPopup(error);
    });



  }

  resetRequestForm(data: NgForm, isNewItem: boolean) {
    if (isNewItem == true) {
      this.consumableRequest = new ConsumableRequest();
      this.dataTablePropertyValue.TGT_clearData();
    }
    data.reset();
    data.resetForm(this.consumableRequest);
  }


  resetForm(data: NgForm, isNewItem: boolean) {
    if (isNewItem == true) {
      this.consumable = new ConsumableRequest();      
      this.dataTablePropertyValue.TGT_clearData();
    }
    data.reset();
    data.resetForm(this.consumable);
  }

  async refreshTable() {

    this.isFilter = false;

    this.isConsumableFilter = false;
    
    let currentTabIndex:number = this.currentTab;

    this.isTableRefreshing = true;

    switch(currentTabIndex){
      case 0:     
      this.dataTableConsumableList.isLoading = true;
      this.dataTableConsumableList.TGT_clearData();
      this.dataTablePropertyValue.TGT_clearData();      
      this.loadConsumableList(this.perInPage,this.currentPage,false);
      break;
      case 1:
      this.dataTableRequestedList.isLoading = true;
      this.dataTableRequestedList.TGT_clearData();     
      this.loadConsumableRequestList(this.perInPage, this.currentPage,1,false);
      break;
      case 2:
      this.dataTableClosedRequestList.isLoading = true;
      this.dataTableClosedRequestList.TGT_clearData();  
      this.loadConsumableRequestList(this.perInPage, this.currentPage,2,false);
      break;   
      case 3:
      this.dataTableCanceledList.isLoading=true;
      this.dataTableCanceledList.TGT_clearData();
      this.loadConsumableRequestList(this.perInPage, this.currentPage,3,false);
      break;  
    }    

    this.isTableRefreshing = false;
  }

  filter(){
    let currentTabIndex:number = this.currentTab;
    
    if(currentTabIndex == 0)
    {
     this.popupComponent.ShowModal('#modalFilterForConsumableList');
    }
    else
    {      
      this.popupComponent.ShowModal('#modalFilterForRequestList');
    }
  }

  clearFilter(){
    
    this.filterRequestList = new ConsumableRequest();

    this.dataTableCategory.TGT_clearData();

    this.dataTableConsumableMaterial.TGT_clearData();

    this.dataTablePropertyValueForFilter.TGT_clearData();

    this.loadConsumableCardDropdown();

    this.loadConsumableCategoryDropdown();

    this.fixedAssetPropertyDetail = new FixedAssetPropertyDetails();

    this.fixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
  }

  clearFilterConsumableList(){

    this.dataTableCategory.TGT_clearData();

    this.dataTableConsumableMaterial.TGT_clearData();

    this.dataTableLocation.TGT_clearData();

    this.loadConsumableCardDropdown();

    this.loadConsumableCategoryDropdown();

    this.loadConsumableLocationDropdown();

    this.fixedAssetPropertyDetail = new FixedAssetPropertyDetails();

    this.fixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();

  }

  closeQuestionPopup(){
    this.popupComponent.CloseModal('#modalShowQuestionPopupForCancelRequest');
  }

  exportExcel(){
    switch(this.currentTab){
      case 0:
      this.exportAsExcelFile(this.dataTableConsumableList);
      break;
      case 1:
      this.exportAsExcelFile(this.dataTableRequestedList);
      break; 
      case 2:
      this.exportAsExcelFile(this.dataTableClosedRequestList);
      break;
      case 3:
      this.exportAsExcelFile(this.dataTableCanceledList);
      break;
    }
  }

 
  
}
