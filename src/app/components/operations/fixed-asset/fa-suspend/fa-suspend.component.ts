import {
  Component,
  OnInit,
  NgModule,
  Input,
  AfterViewInit
} from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import * as $ from "jquery";
import { CheckOutReason } from "../../../../models/CheckOutReason";
import { FixedAssetComponent } from "../fixed-asset.component";
import { TreeGridTable } from "../../../../extends/TreeGridTable/modules/TreeGridTable";
import { FixedAsset } from "../../../../models/FixedAsset";
import { TransactionLog } from "../../../../models/TransactionLog";
import {
  convertNgbDateToDateString,
  convertDateToNgbDate,
  getToday
} from "../../../../declarations/extends";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-fa-suspend",
  templateUrl: "./fa-suspend.component.html",
  styleUrls: ["./fa-suspend.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaSuspendComponent],
  providers: [FaSuspendComponent]
})
export class FaSuspendComponent extends BaseComponent implements OnInit {
  @Input() faDataTable: TreeGridTable;
  @Input() faBarcode: string;
  @Input() faComponent: FixedAssetComponent;
  suspensions: CheckOutReason[] = [];
  transactionLog: TransactionLog = new TransactionLog();
  transactionLogs: TransactionLog[] = [];

  constructor(baseService: BaseService) {
    super(baseService);
    this.LoadDropdownList();
  }

  ngOnInit() {}

  onSubmit(data: NgForm) {
    this.suspendFixedAsset(data);
  }

  async suspendFixedAsset(data: NgForm) {
    if (data.form.invalid == true) return;

    this.transactionLog.FixedAssetIds = (<FixedAsset[]>(
      this.faDataTable.TGT_getSelectedItems()
    )).map(x => x.FixedAssetId);

    let cloneItem = new TransactionLog();
    Object.assign(cloneItem, this.transactionLog);

    cloneItem.CheckInExpectedArrivalDate=  convertNgbDateToDateString(data.value.checkInExpectedArrivalDate);

    await this.baseService.fixedAssetService.SuspendFixedAsset(
      cloneItem,
      (insertedItem: TransactionLog, message) => {
        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Set inserted Item id to model */
        cloneItem.TransactionLogId = insertedItem.TransactionLogId;

        /* Push inserted item to Property list */
        this.transactionLogs.push(this.transactionLog);

        this.faComponent.loadFixedAsset();

      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
        // this.resetForm(data, true);
      }
    );
    this.resetForm(data, true);
    
  }

  async LoadDropdownList() {
    /* Load suspended reason to suspended reason dropdown */
    await this.baseService.checkOutReasonService.GetSuspensions(
      suspensions => {
        this.suspensions = suspensions;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  resetForm(data: NgForm, isNewItem: boolean) {
    if (isNewItem == true) {
      this.transactionLog = new TransactionLog();
    }
    data.reset();
    data.resetForm(this.transactionLog);
  }
  
  today() {
    let getdate:NgbDate = getToday();
    console.log(getdate);
    return getToday();
  }
}
