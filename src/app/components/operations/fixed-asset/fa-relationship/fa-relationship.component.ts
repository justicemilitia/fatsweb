import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { TreeGridTable } from "../../../../extends/TreeGridTable/modules/TreeGridTable";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import * as $ from "jquery";
import { TransactionLog } from "../../../../models/TransactionLog";
import { FixedAssetComponent } from '../fixed-asset.component';

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
  // transactionLog: TransactionLog = new TransactionLog();
  // transactionLogs: TransactionLog[] = [];
  fixedAsset: FixedAsset = new FixedAsset();
  fixedAssets: FixedAsset[]=[];
  @Input() faDataTable: TreeGridTable;
  @Input() faBarcode: string;
  @Input() selectedFixedAssetId: number;
  @Input() faComponent: FixedAssetComponent;

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

    this.fixedAsset.Barcode=data.value.newBarcodes;
    this.fixedAsset.FixedAssetIds = (<FixedAsset[]>(
      this.faDataTable.TGT_getSelectedItems()
    )).map(x => x.FixedAssetId);

    await this.baseService.popupService.ShowQuestionPopupForChangeRelationhip(
      (response: boolean) => {
        if (response == true) {
          this.baseService.fixedAssetService.ChangeRelationship(
            this.fixedAsset,
            (insertedItem: FixedAsset, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              /* Set inserted Item id to model */
              this.fixedAsset.FixedAssetId =
                insertedItem.FixedAssetId;

              /* Push inserted item to Property list */
              this.fixedAssets.push(this.fixedAsset);

              this.resetForm(data);
              
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

  resetForm(data: NgForm) {
    data.resetForm();
    this.fixedAsset.Barcode = null;
  }
}
