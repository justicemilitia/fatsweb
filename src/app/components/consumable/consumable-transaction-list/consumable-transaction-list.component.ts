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

@Component({
  selector: 'app-consumable-transaction-list',
  templateUrl: './consumable-transaction-list.component.html',
  styleUrls: ['./consumable-transaction-list.component.css']
})
export class ConsumableTransactionListComponent extends BaseComponent implements OnInit {

  consumable: ConsumableRequest = new ConsumableRequest();

  transactionList:ConsumableRequest[]=[];

  currentPage: number = 1;

  perInPage: number = 25;

  totalPage: number = 1;

  pages: Page[] = [];

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

  constructor(public baseService: BaseService) {
    super(baseService);
   // this.loadConsumableTransactionList();

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

// <<<<<<< HEAD
//   loadConsumableMaterialInList(_perInPage: number = 25, _currentPage: number = 1) {
//     this.baseService.consumableRequestListService.GetConsumableRequestList(
//       _perInPage,
//       _currentPage,
//       (transactionList:ConsumableRequest[], totalPage:number,message:string) => {
//         this.perInPage = _perInPage;
//         this.currentPage = _currentPage;
//         this.dataTableConsumableMaterialIn.perInPage = _perInPage;
//         this.transactionList = transactionList;
//         this.totalPage = totalPage ? totalPage : 1;

//         this.dataTableConsumableMaterialIn.TGT_loadData(this.transactionList);
//         this.TGT_calculatePages();
//       },
//       (error:HttpErrorResponse) => {
//         this.baseService.popupService.ShowErrorPopup(error);
//       }
//     );
//   }

//   loadConsumableMaterialOutList(_perInPage: number = 25, _currentPage: number = 1) {
//     this.baseService.consumableRequestListService.GetConsumableRequestList(
// =======
//   loadConsumableTransactionList(_perInPage: number = 25, _currentPage: number = 1) {
//     this.baseService.consumableRequestListService.GetConsumableTransactionList(
// >>>>>>> bff340114f80fa3d501c43f4970d284c1e910156
//       _perInPage,
//       _currentPage,
//       (transactionList:ConsumableRequest[], totalPage:number,message:string) => {
//         this.perInPage = _perInPage;
//         this.currentPage = _currentPage;
//         this.dataTableConsumableMaterialOut.perInPage = _perInPage;
//         this.transactionList = transactionList;
//         this.totalPage = totalPage ? totalPage : 1;

//         this.dataTableConsumableMaterialIn.TGT_loadData(this.transactionList);
//         this.TGT_calculatePages();
//       },
//       (error:HttpErrorResponse) => {
//         this.baseService.popupService.ShowErrorPopup(error);
//       }
//     );
//   }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTableConsumableMaterialIn.isLoading = true;

    this.dataTableConsumableMaterialIn.TGT_clearData();

    this.perInPage = 25;
    this.currentPage = 1;

   // await this.loadConsumableTransactionList(this.perInPage, this.currentPage);

    this.isTableRefreshing = false;
  }

  filterConsumable(data: NgForm){
    
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    let selectedItems= this.dataTableConsumableMaterialIn.TGT_getSelectedItems();
    
    if(tabChangeEvent.index==0){
    //  this.loadConsumableTransactionList(); 

    } 
    else if(tabChangeEvent.index==1){
    //  this.loadConsumableTransactionList(); 
    }
  }

}
