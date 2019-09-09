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
  response: boolean = false;
  formData:NgForm = null;
  updatedBarcode: string = '';

  constructor(baseService: BaseService) {
    super(baseService);
  }
  ngOnInit() {}

  onSubmit(data: NgForm) {
    // this.ChangeRelationship(data);
    if (data.form.invalid == true) return;

    this.popupComponent.ShowModal('#modalShowQuestionPopupForRelationship');

    // Object.assign(this.fixedAsset, data);

    
  }

  async ChangeRelationship(data: NgForm) {
    /* Is Form Valid */

    if(data.form.invalid == true)return;    


    this.fixedAsset.Barcode=data.value.newBarcodes;
    this.fixedAsset.FixedAssetIds = (<FixedAsset[]>(
      this.faDataTable.TGT_getSelectedItems()
    )).map(x => x.FixedAssetId);
    this.baseService.spinner.show();
 
    // await this.baseService.popupService.ShowQuestionPopupForChangeRelationhip(
    //   (response: boolean) => {
        // if (this.response == true) {
          this.baseService.fixedAssetService.ChangeRelationship(
            this.fixedAsset,
            (insertedItem: FixedAsset, message) => {

              this.baseService.spinner.hide();

              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              /* Set inserted Item id to model */
              this.fixedAsset.FixedAssetId =
                insertedItem.FixedAssetId;

              /* Push inserted item to Property list */
              this.fixedAssets.push(this.fixedAsset);

              this.resetForm(data);
              
              this.faComponent.loadFixedAsset();

              $('#CloseModal').trigger('click');

            },
            (error: HttpErrorResponse) => {
              /* Show alert message */
              this.baseService.spinner.hide();              
              this.baseService.popupService.ShowErrorPopup(error);
              this.resetForm(data);              
            }
          );

          this.popupComponent.CloseModal('#modalShowQuestionPopupForRelationship');
        // }
    //   }
    // );
  }

  resetForm(data: NgForm) {
    data.resetForm();
    this.fixedAsset.Barcode = null;
  }

  // updateOperation(isUpdate: boolean){
  //   if(isUpdate)
  //     this.ChangeRelationship(this.updatedBarcode);
  //   else
  //     this.response=false;
  // }
}
