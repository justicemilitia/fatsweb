import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "src/app/services/base.service";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { TransactionLog } from "src/app/models/TransactionLog";
import { NgForm } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TransactionTypes } from 'src/app/declarations/transaction-types';

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

  public dataTable: TreeGridTable = new TreeGridTable(
    "transactionloglist",
    [   
      {
        columnDisplayName: "Hareket Tipi",
        columnName: ["CheckOutReasonName"],
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
          return value.TransactionDate ? value.TransactionDate.substring(0, 10).split("-").reverse().join("-") : "";
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
    this.LoadTransactionList();
  }

  ngOnInit() {}

  LoadTransactionList() {
    this.baseService.transactionService.GetTransactionLogList(
      this.transaction,
      (transactions:TransactionLog[]) => {
        this.transactions=transactions;
        this.dataTable.TGT_loadData(this.transactions);
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

    await this.LoadTransactionList();

    this.isTableRefreshing = false;

  }
}
