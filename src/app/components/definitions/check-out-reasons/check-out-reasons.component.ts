import { Component, OnInit } from "@angular/core";
import { BaseService } from "src/app/services/base.service";
import { BaseComponent } from "../../base/base.component";
import { CheckOutReason } from "src/app/models/CheckOutReason";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-check-out-reasons",
  templateUrl: "./check-out-reasons.component.html",
  styleUrls: ["./check-out-reasons.component.css"]
})
export class CheckOutReasonsComponent extends BaseComponent implements OnInit {
  
  /* Is Table Refreshing */
  isTableRefreshing:boolean = false;

  /* Is Table Exporting */
  isTableExporting:boolean = false;

  checkOutReasons: CheckOutReason[] = [];
  checkoutreason: CheckOutReason = new CheckOutReason();

  public dataTable: TreeGridTable = new TreeGridTable(
    "checkoutreason",
    [
      {
        columnDisplayName: this.getLanguageValue('Exit_Type'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Description'),
        columnName: ["Description"],
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

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.dataTable.isMultipleSelectedActive = false;
    this.dataTable.isColumnOffsetActive = false;
    this.dataTable.isPagingActive = false;
    this.LoadCheckOutReasons();
  }

  ngOnInit() {}

  async LoadCheckOutReasons() {
    await this.baseService.checkOutReasonService.GetCheckOutReason(
      (checkOutReasons: CheckOutReason[]) => {
        /* get checkouts */
        this.checkOutReasons = checkOutReasons;

        /* then load them into table */
        this.dataTable.TGT_loadData(this.checkOutReasons);
        if(this.checkOutReasons.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        /* Show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.LoadCheckOutReasons();

    this.isTableRefreshing = false;

  }

}
