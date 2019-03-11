import { Component, OnInit } from "@angular/core";
import { BaseService } from "src/app/services/base.service";
import { BaseComponent } from "../../base/base.component";
import { CheckOutReason } from "src/app/models/CheckOutReason";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { HttpErrorResponse } from "@angular/common/http";
import { FixedAssetStatus } from "src/app/models/FixedAssetStatus";

@Component({
  selector: "app-check-out-reasons",
  templateUrl: "./check-out-reasons.component.html",
  styleUrls: ["./check-out-reasons.component.css"]
})
export class CheckOutReasonsComponent extends BaseComponent implements OnInit {
  
  checkOutReasons: CheckOutReason[] = [];
  checkoutreason: CheckOutReason = new CheckOutReason();

  fixedAssetStatus: FixedAssetStatus[] = [];
  fxedAssetStatu: FixedAssetStatus = new FixedAssetStatus();

  public dataTableFixedAssetStatus: TreeGridTable = new TreeGridTable(
    "checkoutreason",
    [
      {
        columnDisplayName: "Statü Kodu",
        columnName: ["FixedAssetStatuCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü Adı",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Renk",
        columnName: ["Color"],
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

  public dataTable: TreeGridTable = new TreeGridTable(
    "checkoutreason",
    [
      {
        columnDisplayName: "Çıkış Tipi",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
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
      },
      (error: HttpErrorResponse) => {
        /* Show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  LoadFixedAssetStatus() {
    this.baseService.checkOutReasonService.GetFixedAssetStatus(
      (fixedAssetStatus: FixedAssetStatus[]) => {
        this.fixedAssetStatus = fixedAssetStatus;

        this.dataTableFixedAssetStatus.TGT_loadData(this.fixedAssetStatus);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
