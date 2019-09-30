import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { InputTrimDirective } from 'ng2-trim-directive';
import { FixedAssetComponent } from '../fixed-asset.component';

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
  @Input() faComponent: FixedAssetComponent;
  newBarcode: string = "";
  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;
  errorMessage: HttpErrorResponse;

  constructor(baseService: BaseService) {
    super(baseService);
  }

  ngOnInit() { }


  resetForm(data: NgForm) {
    data.resetForm();
    this.newBarcode = null;
  }

  onSubmit(data: NgForm) {

    if (data.form.invalid == true) return;

      this.popupComponent.ShowModal('#modalShowQuestionPopupForChangeBarcode');
  }

  async ChangeBarcode(data: NgForm) {
    /* Is Form Valid */
          
          let cloneItem = new FixedAsset();
          Object.assign(cloneItem, this.faBarcode);

          cloneItem.Barcode = data.value.newBarcodes;

          this.isWaitingInsertOrUpdate = true;

          this.baseService.spinner.show();

          this.baseService.fixedAssetService.ChangeBarcode(
            cloneItem,
            (insertedItem: FixedAsset, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              this.baseService.spinner.hide();

              /* Set inserted Item id to model */
              this.faBarcode.Barcode = cloneItem.Barcode;
              this.resetForm(data);

              this.isWaitingInsertOrUpdate = false;

              this.faComponent.loadFixedAsset();
            },
            (error: HttpErrorResponse) => {
              /* Show alert message */
              // this.baseService.popupService.ShowErrorPopup(error);
              this.errorMessage=error;

              this.popupComponent.ShowModal("#modalShowErrorMessage");

              this.baseService.spinner.hide();
              
              this.isWaitingInsertOrUpdate = false;
            }
          );
          this.popupComponent.CloseModal('#modalShowQuestionPopupForChangeBarcode');      
          this.popupComponent.ShowModal('#modalChangeBarcode');              
        }

}
