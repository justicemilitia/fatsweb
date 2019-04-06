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
import { FixedAssetCardProperty } from "../../../../models/FixedAssetCardProperty";
import { HttpErrorResponse } from "@angular/common/http";
import * as $ from "jquery";
import { TransactionLog } from "../../../../models/TransactionLog";
import { Currency } from "../../../../models/Currency";
import { CheckOutReason } from "../../../../models/CheckOutReason";
import { FixedAssetComponent } from "../fixed-asset.component";
import { TreeGridTable } from "../../../../extends/TreeGridTable/modules/TreeGridTable";
import { FixedAsset } from "../../../../models/FixedAsset";

@Component({
  selector: "app-fa-exit",
  templateUrl: "./fa-exit.component.html",
  styleUrls: ["./fa-exit.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaExitComponent],
  providers: [FaExitComponent]
})
export class FaExitComponent extends BaseComponent implements OnInit {
  /* Current Fixed Asset Card Property */
  transactionLog: TransactionLog = new TransactionLog();
  transactionLogs: TransactionLog[] = [];
  currencies: Currency[] = [];
  locations: Location[] = [];
  checkedOutReasons: CheckOutReason[] = [];
  faExitIds: number[] = [];
  fixedAsset: FixedAsset = new FixedAsset();
  @Input() faDataTable: TreeGridTable;
  @Input() faBarcode: string;
  @Input() faComponent: FixedAssetComponent;

  constructor(baseService: BaseService) {
    super(baseService);
    this.LoadDropdownList();
  }

  ngOnInit() {}

  onSubmit(data: NgForm) {
    this.exitFixedAsset(data);
  }

  async exitFixedAsset(data: NgForm) {
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    await this.baseService.popupService.ShowQuestionPopupForDeleteWithoutUndo(
      (response: boolean) => {
        if (response == true) {
          this.transactionLog.FixedAssetIds = (<FixedAsset[]>(
            this.faDataTable.TGT_getSelectedItems()
          )).map(x => x.FixedAssetId);

            this.baseService.fixedAssetService.ExitFixedAsset(
            this.transactionLog,
            (insertedItem: TransactionLog, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              /* Set inserted Item id to model */
              this.transactionLog.TransactionLogId =
                insertedItem.TransactionLogId;

              /* Push inserted item to Property list */
              this.transactionLogs.push(this.transactionLog);
              this.faComponent.loadFixedAsset();
            },
            (error: HttpErrorResponse) => {
              /* Show alert message */
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
        }
      }
    );
  }

  async LoadDropdownList() {
    /* Load currencies to currencies dropdown */
    await this.baseService.currencyService.GetCurrencies(
      currencies => {
        this.currencies = currencies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    /* Load location to locations dropdown */
    await this.baseService.locationService.GetLocations(
      locations => {
        this.locations = locations;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    /* Load checked out reasons to checked out reason dropdown */
    await this.baseService.checkOutReasonService.GetCheckOutReason(
      checkedOutReasons => {
        this.checkedOutReasons = checkedOutReasons;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
