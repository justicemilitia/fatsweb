import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "src/app/services/base.service";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { TransactionLog } from "src/app/models/TransactionLog";
import { NgForm } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TransactionTypes } from 'src/app/declarations/transaction-types';
import { Page } from 'src/app/extends/TreeGridTable/models/Page';
import { DOCUMENT_URL } from '../../../declarations/service-values';

@Component({
  selector: "app-transaction-list",
  templateUrl: "./transaction-list.component.html",
  styleUrls: ["./transaction-list.component.css"]
})

export class TransactionListComponent extends BaseComponent implements OnInit {

  transaction: TransactionLog = new TransactionLog();

  transactions:TransactionLog[]=[];

    /* Is Table Refreshing */
    isTableRefreshing: boolean = false;

    /* Is Table Exporting */
    isTableExporting: boolean = false;

    hideFromFixedAsset:boolean = false;

    hideToFixedAsset:boolean = false;

    hideCheckOutReason:boolean = false;

    currentPage: number = 1;
    perInPage: number = 25;
    totalPage: number = 1;
    pages: Page[] = [];

  public dataTable: TreeGridTable = new TreeGridTable(
    "transactionloglist",
    [   
      {
        columnDisplayName: "Hareket Tipi",
        columnName: ["TransactionTypeName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Barkod",
        columnName: ["NewBarcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "İşlemi Gerçekleştiren Kullanıcı",
        columnName: ["UserName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "İşlemin Gerçekleştirildiği Tarih",
        columnName: ["TransactionDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.TransactionDate ? value.TransactionDate.replace("T"," ").substring(0,16): "";
        }
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
      column: ["NewBarcode"]
    }
  );

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadTransactionList();
    this.dataTable.isPagingActive = false;
  }

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

  ngOnInit() {}

  async loadTransactionList(_perInPage: number = 25, _currentPage: number = 1) {

      this.dataTable.TGT_clearData();
      this.dataTable.isLoading = true;

      this.baseService.transactionService.GetTransactionLogList(_perInPage, _currentPage,     
      (transactions:TransactionLog[], totalPage:number, message:string) => {

        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.dataTable.perInPage = _perInPage;
        this.totalPage = totalPage ? totalPage : 1;
        this.transactions=transactions;

        this.dataTable.TGT_loadData(this.transactions);
        this.TGT_calculatePages();

        if(this.transactions.length==0){
          this.baseService.popupService.ShowWarningPopup("Record_not_found");
        }
      },
      (error: HttpErrorResponse) => {

      }
    );
  }

  onDoubleClickItem(item : TransactionLog){

    /* Clear Model */
    this.transaction = new TransactionLog();

    /* Show spinner for loading */
    this.baseService.spinner.show();

    this.baseService.transactionService.GetTransactionById(item.TransactionLogId,
      (result:TransactionLog) => {

        this.baseService.spinner.hide();
      
        Object.assign(this.transaction,result);

        this.checkTransactionTypeId(result.TransactionTypeId);
        $("#btnTransactionInfo").trigger("click");

        
      },
      (error:HttpErrorResponse)=>{
         /* hide spinner */
        this.baseService.spinner.hide();

        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  checkTransactionTypeId(transactionTypeId:TransactionTypes){
    switch(transactionTypeId){
      case TransactionTypes.suspensionFa:
        this.hideFromFixedAsset=true;
        this.hideToFixedAsset=true;
        this.hideCheckOutReason=false;
        break;
      case TransactionTypes.checkoutFa:
        this.hideFromFixedAsset=true;
        this.hideToFixedAsset=true;
        this.hideCheckOutReason=false;
        break;
      case TransactionTypes.undoSuspensionFa:
        this.hideFromFixedAsset=true;
        this.hideToFixedAsset=true;
        this.hideCheckOutReason=false;
        break;
      case TransactionTypes.changeFirmFa:
        this.hideFromFixedAsset=false;
        this.hideToFixedAsset=false;
        this.hideCheckOutReason=true;
        break;
      case  TransactionTypes.createFa:
        this.hideCheckOutReason=true;
        this.hideFromFixedAsset=false;
        this.hideToFixedAsset=false;
        break;
      case TransactionTypes.lostFa:
        this.hideCheckOutReason=false;
        this.hideToFixedAsset=true;
        this.hideFromFixedAsset=true;
        break;
      case TransactionTypes.breakRelationship:
        this.hideCheckOutReason=true;
        this.hideFromFixedAsset=true;
        this.hideToFixedAsset=true;
        break;
      case TransactionTypes.changeCollectiveParameter:
        this.hideCheckOutReason=true;
        this.hideFromFixedAsset=false;
        this.hideToFixedAsset=false;
        break;
      case TransactionTypes.changeDebitFa:
        this.hideCheckOutReason=true;
        this.hideFromFixedAsset=false;
        this.hideToFixedAsset=false;
        break;
      case TransactionTypes.deleteDebitFa:
        this.hideCheckOutReason=true;
        this.hideFromFixedAsset=false;
        this.hideToFixedAsset=false;
        break;
      }
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    this.perInPage = 25;
    this.currentPage = 1;

    await this.loadTransactionList(this.perInPage, this.currentPage);

    this.isTableRefreshing = false;
  }

  async downloadForm(){
    
    let formList: string[];

      // (response: boolean) => {
      //   if (response == true) {

          formList = (<TransactionLog[]>(
            this.dataTable.TGT_getSelectedItems()
          )).map(x => x.FixedAssetFormCode);

          for(let i=0;i<formList.length;i++){
            if(formList[i] != null){
              this.PressForm(formList[i]);
            }
          }
        // }   
      // }
  }

  PressForm(formName: string){
    let url:string;
    url=DOCUMENT_URL + formName + ".pdf";
    // this.router.navigate([url]); 
    window.open(url,"_blank");    
  }
}
