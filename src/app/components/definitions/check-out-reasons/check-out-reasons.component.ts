import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { BaseComponent } from '../../base/base.component';
import { CheckOutReason } from 'src/app/models/CheckOutReason';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: "app-check-out-reasons",
  templateUrl: "./check-out-reasons.component.html",
  styleUrls: ["./check-out-reasons.component.css"]
})
export class CheckOutReasonsComponent extends BaseComponent implements OnInit {
  checkOutReasons: CheckOutReason[] = [];
  checkoutreason: CheckOutReason = new CheckOutReason();

  public dataTable: TreeGridTable = new TreeGridTable(
    "checkoutreason",
    [
      {
        columnDisplayName: "Şirket Adı",
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


  ngOnInit() { }

  LoadCheckOutReasons() {

    this.baseService.checkOutReasonService.GetCheckOutReason((checkOutReasons: CheckOutReason[]) => {
      /* get checkouts */
      this.checkOutReasons = checkOutReasons;

      /* then load them into table */
      this.dataTable.TGT_loadData(this.checkOutReasons);

    }, (error: HttpErrorResponse) => {

      /* Show error message */
      this.baseService.popupService.ShowErrorPopup(error);

    });
  }



}
