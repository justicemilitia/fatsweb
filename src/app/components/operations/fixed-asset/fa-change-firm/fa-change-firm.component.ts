import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { TreeGridTable } from "../../../../extends/TreeGridTable/modules/TreeGridTable";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import * as $ from "jquery";
import { Firm } from "../../../../models/Firm";

@Component({
  selector: "app-fa-change-firm",
  templateUrl: "./fa-change-firm.component.html",
  styleUrls: ["./fa-change-firm.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaChangeFirmComponent],
  providers: [FaChangeFirmComponent]
})
export class FaChangeFirmComponent extends BaseComponent implements OnInit {
  @Input() faBarcode: FixedAsset = new FixedAsset();
  newFirmId: number;

  /* List Of Firms */
  firms: Firm[] = [];

  constructor(baseService: BaseService) {
    super(baseService);
    this.loadDropdownList();
  }
  ngOnInit() {}

  async ChangeFirm(data: NgForm) {
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    await this.baseService.popupService.ShowQuestionPopupForFirmUpdate(
      (response: boolean) => {
        if (response == true) {
          let cloneItem = new FixedAsset();
          Object.assign(cloneItem, this.faBarcode);

          cloneItem.FirmId = data.value.firmIds;

            this.baseService.fixedAssetService.ChangeFirm(
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
    );
  }

  async loadDropdownList() {
    /* Load firms to firm dropdown */
    await this.baseService.userService.GetFirms(
      firms => {
        this.firms = firms;
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
