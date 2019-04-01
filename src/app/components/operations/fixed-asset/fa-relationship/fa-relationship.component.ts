import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { TreeGridTable } from "../../../../extends/TreeGridTable/modules/TreeGridTable";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import * as $ from "jquery";
import { TransactionLog } from "../../../../models/TransactionLog";

@Component({
  selector: "app-fa-relationship",
  templateUrl: "./fa-relationship.component.html",
  styleUrls: ["./fa-relationship.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaRelationshipComponent],
  providers: [FaRelationshipComponent]
})
export class FaRelationshipComponent extends BaseComponent implements OnInit {
  transactionLog: TransactionLog = new TransactionLog();
  transactionLogs: TransactionLog[] = [];
  @Input() faDataTable: TreeGridTable;
  @Input() faBarcode: string;

  constructor(baseService: BaseService) {
    super(baseService);
  }
  ngOnInit() {}

  onSubmit(data: NgForm) {
    this.ChangeRelationship(data);
  }

  async ChangeRelationship(data: NgForm) {
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    await this.baseService.popupService.ShowQuestionPopupForChangeRelationhip(
      (response: boolean) => {
        if (response == true) {
          this.transactionLog.FixedAssetIds = (<FixedAsset[]>(
            this.faDataTable.TGT_getSelectedItems()
          )).map(x => x.FixedAssetId);

          this.baseService.fixedAssetService.ChangeRelationship(
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
}
