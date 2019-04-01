import {
  Component,
  OnInit,
  Input,
  NgModule,
  DoCheck,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { TreeGridTable } from "../../../../extends/TreeGridTable/modules/TreeGridTable";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { TransactionLog } from "../../../../models/TransactionLog";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-fa-lost",
  templateUrl: "./fa-lost.component.html",
  styleUrls: ["./fa-lost.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaLostComponent],
  providers: [FaLostComponent]
})
export class FaLostComponent extends BaseComponent
  implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["faBarcode"]) {
      this.loadLostFixedAsset();
    }
  }

  transactionLog: TransactionLog = new TransactionLog();
  transactionLogs: TransactionLog[] = [];
  @Input() faDataTable: TreeGridTable;
  @Input() faBarcode: FixedAsset[] = [];
  fixedAssets: FixedAsset[] = [];

  /* Lost Fixed Asset Data Table */
  public dataTable: TreeGridTable = new TreeGridTable(
    "lostfixedasset",
    [
      {
        columnDisplayName: "Demirbaş Barkodu",
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Adı",
        columnName: ["FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );

  constructor(baseService: BaseService) {
    super(baseService);

    this.dataTable.isPagingActive = false;
    this.dataTable.isColumnOffsetActive = false;
    this.dataTable.isColumnOffsetActive = false;
    this.dataTable.isDeleteable = false;
    this.dataTable.isTableEditable = true;
    this.dataTable.isMultipleSelectedActive = false;
    this.dataTable.isLoading = false;
    this.dataTable.isFilterActive=false;
  }

  ngOnInit() {
    this.loadLostFixedAsset();
  }

  async lostFixedAsset(data: NgForm) {
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    await this.baseService.popupService.ShowQuestionPopupForLocationUpdate(
      (response: boolean) => {
        if (response == true) {
          this.transactionLog.FixedAssetIds = (<FixedAsset[]>(
            this.faDataTable.TGT_getSelectedItems()
          )).map(x => x.FixedAssetId);

            this.baseService.fixedAssetService.LostFixedAsset(
            this.transactionLog,
            (insertedItem: TransactionLog, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              /* Set inserted Item id to model */
              this.transactionLog.TransactionLogId =
                insertedItem.TransactionLogId;

              /* Push inserted item to Property list */
              this.transactionLogs.push(this.transactionLog);
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

  loadLostFixedAsset() {
    this.dataTable.TGT_loadData(this.faBarcode);
  }
}
