import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { NotDeletedItem } from "src/app/models/NotDeletedItem";
import { ConsumableRequest } from "../../../models/ConsumableRequest";
import { Page } from 'src/app/extends/TreeGridTable/models/Page';
import { MatTabChangeEvent } from '@angular/material';
import { ConsumableLogTypes } from '../../../declarations/consumable-log-types';
import { FixedAssetCardProperty } from '../../../models/FixedAssetCardProperty';
import { FixedAssetPropertyDetails } from '../../../models/FixedAssetPropertyDetails';
import { FixedAssetCardPropertyValue } from '../../../models/FixedAssetCardPropertyValue';
import { ConsumableCard } from "src/app/models/ConsumableCard";
import { Department } from '../../../models/Department';
import { User } from '../../../models/User';
import { Location } from '../../../models/Location';
import { ConsumableCategory } from '../../../models/ConsumableCategory';
import { PropertyValueTypes } from '../../../declarations/property-value-types.enum';
import { convertNgbDateToDateString } from '../../../declarations/extends';

@Component({
  selector: 'app-consumable-transaction-list',
  templateUrl: './consumable-transaction-list.component.html',
  styleUrls: ['./consumable-transaction-list.component.css']
})
export class ConsumableTransactionListComponent extends BaseComponent implements OnInit {

  consumable: ConsumableRequest = new ConsumableRequest();

  consumableCard: ConsumableCard = new ConsumableCard();  

  transactionList:ConsumableRequest[]=[];

  currentPage: number = 1;

  perInPage: number = 25;

  totalPage: number = 1;

  pages: Page[] = [];

  currentTab:number = 0;
  
  propertyValue: string;

  isListSelected: boolean = false;

  sameProperty: boolean = false;
  
  visiblePropertyName: boolean = false;

  isSelectedProperty: boolean = false;

  fixedassetpropertyvalues: FixedAssetCardPropertyValue[] = [];
  
  visible: boolean = false;
  
  faPropertyDetails: FixedAssetPropertyDetails[] = [];  

  fixedassetproperty: FixedAssetCardProperty[] = [];  

  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();
  
  fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
  
  faProperties: FixedAssetCardProperty[] = [];

  isWaitingInsertOrUpdate: boolean = false;  

  isConsumableCardDropdownOpen: boolean = false;
  isConsumableCategoryDropdownOpen: boolean = false;  
  isDepartmentDropdownOpen:boolean = false;
  isLocationDropdownOpen: boolean = false;
  isRequestedUserDropdownOpen: boolean = false;
  isReceivedUserDropdownOpen: boolean = false;
  
  consumableCards: ConsumableCard[] = [];  
  consumableCategories: ConsumableCategory[] = [];  
  locations: Location[] = [];  
  departments: Department[] = [];
  users: User[]=[];

  tabIndex: number;

  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;

   /* Is Table Exporting */
   isTableExporting: boolean = false;

  /* Data Table */
  public dataTableConsumableMaterialIn: TreeGridTable = new TreeGridTable(
    "consumableMaterialIn",
    [
      {
        columnDisplayName: this.getLanguageValue('Consumable_Card_Code'),
        columnName: ["ConsumableCard", "ConsumableCardCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Consumable_Card_Name'),
        columnName: ["ConsumableCard","ConsumableCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Consumable_Category'),
        columnName: ["ConsumableCategory","ConsumableCategoryName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Department'),
        columnName: ["ReceivedDepartment", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Quantity_Unit'),
        columnName: ["FreeEnterAmount"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.FreeEnterAmount + ' ' + (value.ConsumableUnit == null ? "" :value.ConsumableUnit.ConsumableUnitName);
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Transaction_Date'),
        columnName: ["ConsumableLogDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.ConsumableLogDate ? value.ConsumableLogDate.replace("T"," ").substring(0,16): "";
        }
      }
    ],
    {
      isDesc: false,
      column: ["ConsumableCard", "ConsumableCardName"]
    }
  );

  
  /* Data Table */
  public dataTableConsumableMaterialOut: TreeGridTable = new TreeGridTable(
    "consumableMaterialOut",
    [
      {
        columnDisplayName: this.getLanguageValue('Consumable_Card_Code'),
        columnName: ["ConsumableCard", "ConsumableCardCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Consumable_Card_Name'),
        columnName: ["ConsumableCard","ConsumableCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Consumable_Category'),
        columnName: ["ConsumableCategory","ConsumableCategoryName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Department'),
        columnName: ["ReceivedDepartment", "Name"],
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
        columnDisplayName: this.getLanguageValue('Requested_User'),
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
        columnDisplayName: this.getLanguageValue('Received_User'),
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
        columnDisplayName: "Serbest Çıkış Miktarı",
        // columnDisplayName: this.getLanguageValue('Quantity_Unit'),
        columnName: ["FreeExitAmount"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Talep Edilen Miktar",
        // columnDisplayName: this.getLanguageValue('Quantity_Unit'),
        columnName: ["RequestedAmount"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Karşılanan Miktar",
        // columnDisplayName: this.getLanguageValue('Quantity_Unit'),
        columnName: ["RecievedAmount"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Transaction_Date'),
        columnName: ["ConsumableLogDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.ConsumableLogDate ? value.ConsumableLogDate.replace("T"," ").substring(0,16): "";
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

  public dataTableReceivedUser: TreeGridTable = new TreeGridTable(
    "receivedUser",
    [
      {
        columnDisplayName: "User_name",
        columnName: ["|FirstName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value != null ? value.FirstName + ' ' + value.LastName : '';
          }
          else {
            return '';
          }
        }
      }
    ],
    {
      isDesc: false,
      column: ["|FirstName"]
    }
  );

  public dataTableRequestedUser: TreeGridTable = new TreeGridTable(
    "requestedUser",
    [
      {
        columnDisplayName: "User_name",
        columnName: ["|FirstName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value != null ? value.FirstName + ' ' + value.LastName : '';
          }
          else {
            return '';
          }
        }
      }
    ],
    {
      isDesc: false,
      column: ["|FirstName"]
    }
  );

  public dataTableConsumableCard: TreeGridTable = new TreeGridTable(
    "consumableCard",
    [
      {
        columnDisplayName: this.getLanguageValue('Consumable_Card_Name'),
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

  public dataTableConsumableCategory: TreeGridTable = new TreeGridTable(
    "consumableCategory",
    [
      {
        columnDisplayName: "Consumable_Category",
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

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadConsumableTransactionList(this.perInPage,this.currentPage,1);
    this.loadConsumableInProperties();
    this.loadDropdown();

    this.tabIndex = 1;

    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isFilterActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isScrollActive = false;
    this.dataTablePropertyValue.isDeleteable = true;

    this.dataTableConsumableMaterialIn.isPagingActive = false;
    this.dataTableConsumableMaterialIn.isLoading = false;

    this.dataTableConsumableMaterialOut.isPagingActive=false;
    this.dataTableConsumableMaterialOut.isLoading = false;

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

    this.dataTableReceivedUser.isPagingActive = false;
    this.dataTableReceivedUser.isColumnOffsetActive = false;
    this.dataTableReceivedUser.isDeleteable = false;
    this.dataTableReceivedUser.isLoading = false;
    this.dataTableReceivedUser.isHeaderVisible = false;
    this.dataTableReceivedUser.isScrollActive = false;

    this.dataTableRequestedUser.isPagingActive = false;
    this.dataTableRequestedUser.isColumnOffsetActive = false;
    this.dataTableRequestedUser.isDeleteable = false;
    this.dataTableRequestedUser.isLoading = false;
    this.dataTableRequestedUser.isHeaderVisible = false;
    this.dataTableRequestedUser.isScrollActive = false;

    this.dataTableConsumableCard.isPagingActive = false;
    this.dataTableConsumableCard.isColumnOffsetActive = false;
    this.dataTableConsumableCard.isDeleteable = false;
    this.dataTableConsumableCard.isLoading = false;
    this.dataTableConsumableCard.isHeaderVisible = false;
    this.dataTableConsumableCard.isScrollActive = false;

    this.dataTableConsumableCategory.isPagingActive = false;
    this.dataTableConsumableCategory.isColumnOffsetActive = false;
    this.dataTableConsumableCategory.isDeleteable = false;
    this.dataTableConsumableCategory.isLoading = false;
    this.dataTableConsumableCategory.isHeaderVisible = false;
    this.dataTableConsumableCategory.isScrollActive = false;

    
    $(document).on("click", e => {
      if (
        $(e.target).closest(".custom-dropdown").length == 0 &&
        $(e.target).closest("#btnConsumableCategory").length == 0 && 
        $(e.target).closest("#btnConsumableCard").length == 0 &&
        $(e.target).closest("#btnLocation").length == 0 &&
        $(e.target).closest("#btnDepartment").length == 0 &&
        $(e.target).closest("#btnRequestedUser").length == 0 &&
        $(e.target).closest("#btnReceivedUser").length == 0
      ) {
        this.isConsumableCardDropdownOpen = false;   
        this.isConsumableCategoryDropdownOpen = false;
        this.isLocationDropdownOpen = false;
        this.isDepartmentDropdownOpen = false;
        this.isReceivedUserDropdownOpen = false;
        this.isRequestedUserDropdownOpen = false;
      }
    });
  }

  ngOnInit() {}
  async  TGT_calculatePages() {

    let items: Page[] = [];
    let totalPage = this.totalPage;

    /* if user in a diffrent page we will render throw the first page */
    if (this.currentPage > totalPage)
      this.currentPage = 1;
    else if (this.currentPage < 1)
      this.currentPage = 1

    /* We will always put first page in to pagination items */
    items.push({
      value: 1,
      display: '1',
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
        display: '...',
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
        display: '...',
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
  

  loadConsumableTransactionList(_perInPage: number = 25, _currentPage: number = 1, tabIndex:number) {

    let consumableLogType:number[]=[];

    switch(tabIndex){
      case 1:
      this.tabIndex = 1;
      consumableLogType.push(ConsumableLogTypes.CONSUMABLE_MATERIAL_IN);
      break; 
      case 2:
      this.tabIndex = 2;
      consumableLogType.push(ConsumableLogTypes.FREE_CONSUMABLE_MATERIAL_OUT);
      consumableLogType.push(ConsumableLogTypes.CONSUMABLE_MATERIAL_RECEIVED);
      break;
    }

    this.baseService.consumableRequestListService.GetConsumableRequestList(
      _perInPage,
      _currentPage,
      consumableLogType,
      (transactionList:ConsumableRequest[], totalPage:number,message:string) => {
       
        let valueA: string = '';       

        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.dataTableConsumableMaterialOut.perInPage = _perInPage;
        this.transactionList = transactionList;
        this.totalPage = totalPage ? totalPage : 1;

        transactionList.forEach(e => {
        if(e.Consumable.FixedAssetPropertyDetails.length > 0){
          e.Consumable.FixedAssetPropertyDetails.forEach(p => {

              for (let i = 0; i < e.Consumable.FixedAssetPropertyDetails.length; i++) {
                valueA+= e.Consumable.FixedAssetPropertyDetails[i].Value + ( e.Consumable.FixedAssetPropertyDetails.length - i == 1 ? "" : "|");                                  
              }
  
              e["PROP_" + p.FixedAssetCardPropertyId.toString()] = valueA;
              
            valueA='';            
          });
        }
        });

        switch(tabIndex){
          case 1:
          this.dataTableConsumableMaterialIn.TGT_loadData(this.transactionList);
          break; 
          case 2:
          this.dataTableConsumableMaterialOut.TGT_loadData(this.transactionList);
          this.loadConsumableOutProperties();
          break;
        }

        this.TGT_calculatePages();
      },
      (error:HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
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
    this.faPropertyDetails = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

    if (this.isListSelected == false)
      this.propertyValue = this.fixedAssetPropertyDetail.Value;

    this.faPropertyDetails.forEach(e => {
      if (
        e.FixedAssetCardPropertyId ==
          this.fixedAssetPropertyDetail.FixedAssetCardPropertyId &&
        e.Value == this.propertyValue
      )
        this.sameProperty = true;
    });

    if (this.sameProperty == true) {
      this.sameProperty = false;
      return;
    }

    if (this.fixedAssetPropertyDetail.FixedAssetCardPropertyId != null) {
      this.visiblePropertyName = false;

      if (
        this.fixedAssetPropertyDetail.Value != null ||
        this.fixedAssetCardPropertyValue.FixedAssetPropertyValueId != null
      ) {
        let fixedasset = this.fixedassetproperty.find(
          x => x.FixedAssetCardPropertyId == Number(propertyId.value)
        );

        this.fixedAssetPropertyDetail.FixedAssetPropertyDetailId =
          (this.faPropertyDetails.length + 1) * -1;

        this.fixedAssetPropertyDetail.FixedAssetCardProperty = fixedasset;

        if (this.isListSelected == true)
          this.fixedAssetPropertyDetail.Value = this.propertyValue;
        this.faPropertyDetails.push(this.fixedAssetPropertyDetail);

        this.dataTablePropertyValue.TGT_loadData(this.faPropertyDetails);

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

  getPropertyValue(event: any) {
    this.propertyValue = event.target.value;

    this.visible = false;
    
    this.fixedAssetPropertyDetail.Value = null;
  }

  async loadConsumableInProperties() {

    this.baseService.fixedAssetService.GetFixedAssetProperties(
      (faProperties: FixedAssetCardProperty[]) => {
        this.faProperties = faProperties;

        // this.faProperties.forEach(e => {
        //   e.FixedAssetPropertyValues.forEach((p, i) => {
        //     e.FixedAssetAsDisplay += p.Value + (i < e.FixedAssetPropertyValues.length - 1 ? "|" : "");
        //   });
        // });

        this.faProperties.forEach(e => {
          this.dataTableConsumableMaterialIn.dataColumns.push({
            columnDisplayName: e.Name,                        
            columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
            isActive: true,
            type: "text"
          });
        });
        this.dataTableConsumableMaterialIn.TGT_bindActiveColumns();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadConsumableOutProperties() {

    this.baseService.fixedAssetService.GetFixedAssetProperties(
      (faProperties: FixedAssetCardProperty[]) => {
        this.faProperties = faProperties;

        this.faProperties.forEach(e => {
          this.dataTableConsumableMaterialOut.dataColumns.push({
            columnDisplayName: e.Name,                        
            columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
            isActive: true,
            type: "text"
          });
        });
        this.dataTableConsumableMaterialOut.TGT_bindActiveColumns();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async refreshTableMaterialIn() {
    this.isTableRefreshing = true;

    this.dataTableConsumableMaterialIn.isLoading = true;

    this.dataTableConsumableMaterialIn.TGT_clearData();

    this.perInPage = 25;
    this.currentPage = 1;

    this.loadConsumableTransactionList(this.perInPage, this.currentPage, 1);

    this.isTableRefreshing = false;
  }

  refreshTableMaterialOut(){
    this.isTableRefreshing = true;

    this.dataTableConsumableMaterialOut.isLoading = true;

    this.dataTableConsumableMaterialOut.TGT_clearData();

    this.perInPage = 25;
    this.currentPage = 1;

    this.loadConsumableTransactionList(this.perInPage, this.currentPage, 2);

    this.isTableRefreshing = false;
  }

  filterConsumable(data: NgForm){
    if (data.form.invalid == true) return;

    let insertedItem: ConsumableRequest = new ConsumableRequest();

    let propertyDetail = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

    let locationIds = this.dataTableLocation.TGT_getSelectedItems().map(x => x.getId());
    let departmentIds = this.dataTableDepartment.TGT_getSelectedItems().map(x => x.getId());
    let consumableCardIds = this.dataTableConsumableCard.TGT_getSelectedItems().map(x => x.getId());
    let consumableCategoryIds = this.dataTableConsumableCategory.TGT_getSelectedItems().map(x => x.getId());
    let receivedUserIds = this.dataTableReceivedUser.TGT_getSelectedItems().map(x => x.getId());
    let requestedUserIds = this.dataTableRequestedUser.TGT_getSelectedItems().map(x => x.getId());

    Object.assign(insertedItem, this.consumable);

    insertedItem.FreeEnterAmount=Number(this.consumable.FreeEnterAmount)
    
    insertedItem.ConsumableCategoryIds = consumableCategoryIds;
    insertedItem.ConsumableCardIds = consumableCardIds;
    insertedItem.ConsumableLocationIds = locationIds;
    insertedItem.ReceivedDepartmentIds = departmentIds;
    insertedItem.ReceivedUserIds = receivedUserIds;
    insertedItem.RequestedUserIds = requestedUserIds;

    insertedItem.StartDate = this.consumable.StartDate == null ? null : convertNgbDateToDateString(data.value.startDate);
    insertedItem.EndDate = this.consumable.EndDate == null ? null : convertNgbDateToDateString(data.value.endDate);

    insertedItem.FixedAssetPropertyDetails = propertyDetail;

    this.baseService.consumableRequestListService.RequestConsumableMaterial(
      insertedItem,
      (requestItem: ConsumableRequest) => {
        this.isWaitingInsertOrUpdate = false;

        insertedItem.ConsumableId = requestItem.ConsumableId;
      },
      (error: HttpErrorResponse) => {}
    );
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.currentTab = tabChangeEvent.index; 
    if (tabChangeEvent.index == 0) {   
      this.loadConsumableTransactionList(this.perInPage,this.currentPage,1);
    } 
    else if (tabChangeEvent.index == 1) {
      this.loadConsumableTransactionList(this.perInPage,this.currentPage,2);
    }
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

    this.baseService.consumableCategoryService.GetConsumableCategories(
      (categories: ConsumableCategory[]) => {
        this.consumableCategories = categories;
        this.dataTableConsumableCategory.TGT_loadData(this.consumableCategories);        
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.consumableCardService.GetConsumableCards(
      (cards: ConsumableCard[]) => {
        this.consumableCards = cards;
        this.dataTableConsumableCard.TGT_loadData(this.consumableCards);        
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

    this.baseService.userService.GetUsers(
      (users: User[]) => {
        this.users = users;
        this.dataTableReceivedUser.TGT_loadData(this.users);
        // this.dataTableRequestedUser.TGT_loadData(this.users);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.userService.GetUsers(
      (users: User[]) => {
        this.users = users;
        this.dataTableRequestedUser.TGT_loadData(this.users);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
    
    this.baseService.departmentService.GetDepartments(
      (departments: Department[]) => {
        this.departments = departments;
        this.dataTableDepartment.TGT_loadData(this.departments);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );


  }
  

  toggleDropdown(key: string) {
    switch (key) {
      case "location":
        this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
        this.isDepartmentDropdownOpen=false;
        this.isConsumableCardDropdownOpen=false;
        this.isConsumableCategoryDropdownOpen=false;
        this.isReceivedUserDropdownOpen=false;
        this.isRequestedUserDropdownOpen=false;
        break;

        case "department":
        this.isDepartmentDropdownOpen=!this.isDepartmentDropdownOpen; 
        this.isLocationDropdownOpen = false;
        this.isConsumableCardDropdownOpen=false;
        this.isConsumableCategoryDropdownOpen=false;
        this.isReceivedUserDropdownOpen=false;
        this.isRequestedUserDropdownOpen=false;
        break;

        case "consumableCard":
        this.isConsumableCardDropdownOpen=!this.isConsumableCardDropdownOpen; 
        this.isLocationDropdownOpen = false;
        this.isDepartmentDropdownOpen=false;
        this.isConsumableCategoryDropdownOpen=false;
        this.isReceivedUserDropdownOpen=false;
        this.isRequestedUserDropdownOpen=false;
        break;

        case "consumableCategory":
        this.isConsumableCategoryDropdownOpen=!this.isConsumableCategoryDropdownOpen;
        this.isLocationDropdownOpen = false;
        this.isDepartmentDropdownOpen=false; 
        this.isConsumableCardDropdownOpen=false;
        this.isReceivedUserDropdownOpen=false;
        this.isRequestedUserDropdownOpen=false;
        // this.loadConsumableCardByCategoryId(this.selectedConsumableCategory.ConsumableCategoryId);
        break;

        case "requestedUser":
        this.isRequestedUserDropdownOpen=!this.isRequestedUserDropdownOpen;         
        this.isLocationDropdownOpen = false;
        this.isDepartmentDropdownOpen=false;
        this.isConsumableCardDropdownOpen=false;
        this.isConsumableCategoryDropdownOpen=false;
        this.isReceivedUserDropdownOpen=false;
        break;
        
        case "receivedUser":
        this.isReceivedUserDropdownOpen=!this.isReceivedUserDropdownOpen; 
        this.isLocationDropdownOpen = false;
        this.isDepartmentDropdownOpen=false;
        this.isConsumableCardDropdownOpen=false;
        this.isConsumableCategoryDropdownOpen=false;
        this.isRequestedUserDropdownOpen=false;
        break;
    }
  }

   
  resetDropdown(key:string){
    switch(key){
      case "location":
      this.dataTableLocation.TGT_clearData();
      this.loadDropdown();
      break;
      case "department":
      this.dataTableDepartment.TGT_clearData();     
      this.loadDropdown();      
      break;
      case "consumableCard":
      this.dataTableConsumableCard.TGT_clearData();    
      this.loadDropdown();      
      break;
      case "consumableCategory":
      this.dataTableConsumableCategory.TGT_clearData();      
      this.loadDropdown();
      break;
      case "receivedUser":
      this.dataTableReceivedUser.TGT_clearData();      
      this.loadDropdown();      
      break;
      case "requestedUser":
      this.dataTableRequestedUser.TGT_clearData(); 
      this.loadDropdown();
      break;
    }
  }


}
