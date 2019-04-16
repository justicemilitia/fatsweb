import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "src/app/services/base.service";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { TransactionLog } from "src/app/models/TransactionLog";
import { NgForm } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-transaction-list",
  templateUrl: "./transaction-list.component.html",
  styleUrls: ["./transaction-list.component.css"]
})
export class TransactionListComponent extends BaseComponent implements OnInit {

  transaction: TransactionLog = new TransactionLog();

  transactions:TransactionLog[]=[];

  public dataTable: TreeGridTable = new TreeGridTable(
    "transactionloglist",
    [
      {
        columnDisplayName: "Barkod",
        columnName: ["NewBarcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Hareket Tipi",
        columnName: ["TransactionDescription"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "İşlemi Gerçekleştiren Kullanıcı",
        columnName: ["UserId"],
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
      },
      (error: HttpErrorResponse) => {

      }
    );
  }
}
