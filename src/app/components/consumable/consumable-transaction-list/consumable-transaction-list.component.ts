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
import { ConsumableCard } from '../../../models/ConsumableCard';

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

  visible: boolean = false;
  
  faPropertyDetails: FixedAssetPropertyDetails[] = [];  

  fixedassetproperty: FixedAssetCardProperty[] = [];  

  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();
  
  fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
  
  faProperties: FixedAssetCardProperty[] = [];

  isWaitingInsertOrUpdate: boolean = false;  
  
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
        columnDisplayName: this.getLanguageValue('Quantity_Unit'),
        columnName: ["FreeEnterAmount"],
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
          return value.ConsumableLogDate ? value.ConsumableLogDate.substring(0, 10).split("-").reverse().join("-") : "";
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
        columnName: ["RecievedAmount                                                                                           "],
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
          return value.ConsumableLogDate ? value.ConsumableLogDate.substring(0, 10).split("-").reverse().join("-") : "";
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

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadConsumableTransactionList(this.perInPage,this.currentPage,1);
    this.loadConsumableInProperties();

    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isFilterActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isScrollActive = false;
    this.dataTablePropertyValue.isDeleteable = true;

    this.dataTableConsumableMaterialIn.isPagingActive = false;
    this.dataTableConsumableMaterialIn.isLoading = false;

    this.dataTableConsumableMaterialOut.isPagingActive=false;
    this.dataTableConsumableMaterialOut.isLoading = false;

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
      consumableLogType.push(ConsumableLogTypes.CONSUMABLE_MATERIAL_IN);
      break; 
      case 2:
      consumableLogType.push(ConsumableLogTypes.FREE_CONSUMABLE_MATERIAL_OUT);
      consumableLogType.push(ConsumableLogTypes.CONSUMABLE_MATERIAL_RECEIVED);
      break;
    }

    this.baseService.consumableRequestListService.GetConsumableRequestList(
      _perInPage,
      _currentPage,
      consumableLogType,
      (transactionList:ConsumableRequest[], totalPage:number,message:string) => {
        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.dataTableConsumableMaterialOut.perInPage = _perInPage;
        this.transactionList = transactionList;
        this.totalPage = totalPage ? totalPage : 1;

        switch(tabIndex){
          case 1:
          this.dataTableConsumableMaterialIn.TGT_loadData(this.transactionList);
          break; 
          case 2:
          this.dataTableConsumableMaterialOut.TGT_loadData(this.transactionList);
          break;
        }

        this.TGT_calculatePages();
      },
      (error:HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
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


  async loadConsumableInProperties() {



    this.baseService.fixedAssetService.GetFixedAssetProperties(
      (faProperties: FixedAssetCardProperty[]) => {
        this.faProperties = faProperties;

        this.faProperties.forEach(e => {
          e.FixedAssetPropertyValues.forEach((p, i) => {
            e.FixedAssetAsDisplay += p.Value + (i < e.FixedAssetPropertyValues.length - 1 ? "|" : "");
          });
        });

        this.faProperties.forEach(e => {
          this.dataTableConsumableMaterialIn.dataColumns.push({
            columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
            columnDisplayName: e.FixedAssetAsDisplay,
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
            columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
            columnDisplayName: e.Name,
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

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTableConsumableMaterialIn.isLoading = true;

    this.dataTableConsumableMaterialIn.TGT_clearData();

    this.perInPage = 25;
    this.currentPage = 1;

    await this.loadConsumableTransactionList(this.perInPage, this.currentPage, 1);

    this.isTableRefreshing = false;
  }

  filterConsumable(data: NgForm){
    if (data.form.invalid == true) return;

    let insertedItem: ConsumableRequest = new ConsumableRequest();

    let propertyDetail = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

    Object.assign(insertedItem, this.consumable);
    insertedItem.ConsumableCategoryId = Number(this.consumable.ConsumableCategoryId);
    insertedItem.ConsumableCardId=Number(this.consumable.ConsumableCardId);
    insertedItem.FreeEnterAmount=Number(this.consumable.FreeEnterAmount)

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

}
