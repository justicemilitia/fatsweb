import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from '../../../../services/base.service';
import { TreeGridTable } from '../../../../extends/TreeGridTable/modules/TreeGridTable';
import { FixedAsset } from '../../../../models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';
import * as $ from "jquery";

@Component({
  selector: "app-fa-change-barcode",
  templateUrl: "./fa-change-barcode.component.html",
  styleUrls: ["./fa-change-barcode.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaChangeBarcodeComponent],
  providers: [FaChangeBarcodeComponent]
})
export class FaChangeBarcodeComponent extends BaseComponent implements OnInit {

  @Input() faBarcode: FixedAsset = new FixedAsset();
  newBarcode: string = '';

  constructor(baseService: BaseService) {
    super(baseService);
  }
  
  ngOnInit() {}

  async ChangeBarcode(data: NgForm) {

    /* Is Form Valid */
    if (data.form.invalid == true) return;
    let cloneItem=new FixedAsset();
    Object.assign(cloneItem, this.faBarcode);


    cloneItem.Barcode=this.newBarcode;

    await this.baseService.fixedAssetService.ChangeBarcode(
      cloneItem,
      (insertedItem: FixedAsset, message) => {
        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Set inserted Item id to model */
        this.faBarcode.Barcode = cloneItem.Barcode;

      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
