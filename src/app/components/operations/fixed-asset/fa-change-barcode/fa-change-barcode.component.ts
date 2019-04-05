import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { InputTrimDirective } from 'ng2-trim-directive';

@Component({
  selector: "app-fa-change-barcode",
  templateUrl: "./fa-change-barcode.component.html",
  styleUrls: ["./fa-change-barcode.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule, InputTrimDirective],
  declarations: [FaChangeBarcodeComponent],
  providers: [FaChangeBarcodeComponent]
})
export class FaChangeBarcodeComponent extends BaseComponent implements OnInit {

  @Input() faBarcode: FixedAsset = new FixedAsset();
  newBarcode: string = "";
  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;

  constructor(baseService: BaseService) {
    super(baseService);
  }

  ngOnInit() { }


  resetForm(data: NgForm) {
    data.resetForm();
    this.newBarcode = null;
  }

  async ChangeBarcode(data: NgForm) {
    /* Is Form Valid */
if (data.form.invalid == true) return;

    await this.baseService.popupService.ShowQuestionPopupForBarcodeUpdate(
      (response: boolean) => {
        if (response == true) {
          
          let cloneItem = new FixedAsset();
          Object.assign(cloneItem, this.faBarcode);

          cloneItem.Barcode = data.value.newBarcodes;

          this.isWaitingInsertOrUpdate = true;

          this.baseService.fixedAssetService.ChangeBarcode(
            cloneItem,
            (insertedItem: FixedAsset, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              /* Set inserted Item id to model */
              this.faBarcode.Barcode = cloneItem.Barcode;
              this.resetForm(data);

              this.isWaitingInsertOrUpdate = false;

            },
            (error: HttpErrorResponse) => {
              /* Show alert message */
              this.baseService.popupService.ShowErrorPopup(error);
              this.isWaitingInsertOrUpdate = false;
            }
          );
        }
      }
    );
  }

}
