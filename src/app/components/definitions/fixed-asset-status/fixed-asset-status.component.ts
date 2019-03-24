import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "src/app/services/base.service";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { FixedAssetStatus } from "src/app/models/FixedAssetStatus";
import { HttpErrorResponse } from "@angular/common/http";
import { ColorPickerService, Cmyk } from "ngx-color-picker";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-status",
  templateUrl: "./fixed-asset-status.component.html",
  styleUrls: ["./fixed-asset-status.component.css"]
})
export class FixedAssetStatusComponent extends BaseComponent implements OnInit {
  isWaitingInsertOrUpdate: boolean = false;

  statuses: FixedAssetStatus[] = [];

  status: FixedAssetStatus = new FixedAssetStatus();

  selectedColor: string;

  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedassetstatus",
    [
      {
        columnDisplayName: "Statü Kodu",
        columnName: ["FixedAssetStatuCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü Adı",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Renk",
        columnName: ["Color"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "color"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  constructor(
    baseService: BaseService,
    public vcRef: ViewContainerRef,
    private cpService: ColorPickerService
  ) {
    super(baseService);
    this.LoadFixedAssetStatus();
    this.dataTable.isColumnOffsetActive = false;
    this.dataTable.isPagingActive = false;
  }

  ngOnInit() {}

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.status);
    if (isNewItem == true) {
      this.status = new FixedAssetStatus();
    }
  }

  onSubmit(data: NgForm) {

    if (data.form.invalid == true) return;

    /* if company id exists means update it otherwise insert it */
    if (data.value.FixedAssetStatusId == null) {
      this.addStatus(data);
    } else {
      this.updateStatus(data);
    }

  }
  LoadFixedAssetStatus() {
    this.baseService.fixedAssetStatusService.GetStatus(
      (statuses: FixedAssetStatus[]) => {
        this.statuses = statuses;
        this.dataTable.TGT_loadData(this.statuses);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  addStatus(data: NgForm) {

    this.isWaitingInsertOrUpdate = true;

    this.status.Color = this.selectedColor;

    this.baseService.fixedAssetStatusService.InsertStatus(
      this.status,
      (insertedStatus: FixedAssetStatus, message) => {
        this.isWaitingInsertOrUpdate = false;
        this.baseService.popupService.ShowSuccessPopup(message);
        this.status.FixedAssetStatusId = insertedStatus.FixedAssetStatusId;
        this.statuses.push(this.status);
        this.dataTable.TGT_loadData(this.statuses);
        this.resetForm(data, true);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.isWaitingInsertOrUpdate = false;
      }
    );
  }

  updateStatus(data: NgForm) {

    this.status.Color = this.selectedColor;

    this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {
          this.isWaitingInsertOrUpdate = true;

          this.baseService.fixedAssetStatusService.UpdateStatus(this.status,
            (_updatedStatus: FixedAssetStatus, message) => {
              this.isWaitingInsertOrUpdate = false;
              this.baseService.popupService.ShowSuccessPopup(message);
              let updatedStatus: FixedAssetStatus = new FixedAssetStatus();
              Object.assign(updatedStatus, this.status);
              this.dataTable.TGT_updateData(updatedStatus);
              this.statuses = <FixedAssetStatus[]>this.dataTable.TGT_copySource();
            },(error: HttpErrorResponse) => {
              this.baseService.popupService.ShowErrorPopup(error);

              this.isWaitingInsertOrUpdate = false;
            });
        }
      }
    );
  }

  async onDoubleClickItem(item: FixedAssetStatus) {
    this.status = new FixedAssetStatus();

    this.baseService.spinner.show();

    await this.baseService.fixedAssetStatusService.GetStatusById(
      item.FixedAssetStatusId,
      (result: FixedAssetStatus) => {
        setTimeout(() => {
          this.baseService.spinner.hide();

          $("#btnAddStatus").trigger("click");
          this.status.Color = result.Color;
          this.selectedColor = result.Color;
          this.status = result;
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        this.baseService.spinner.hide();

        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async deleteStatus() {

    /* get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup("Lütfen en az bir kayıt seçiniz");
      return;
    }

    /* Show Question Message */
    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {

      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.fixedAssetStatusService.DeleteLocations(itemIds, () => {

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* if all of them removed */
        if (itemIds.length == 1)
          this.baseService.popupService.ShowAlertPopup("Kayıt Başarıyla silindi!");
        else
          this.baseService.popupService.ShowAlertPopup("Tüm kayıtlar başarıyla silindi!");

        /* Clear all the ids from table */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Copy original source to current locations */
        this.statuses = <FixedAssetStatus[]>this.dataTable.TGT_copySource();

      }, (error: HttpErrorResponse) => {

        /* Hide spinner then show error message */
        this.baseService.spinner.hide();

        /* Show error message */
        this.baseService.popupService.ShowErrorPopup(error);

      });

    });
  }


  public onEventLog(event: string, data: any): void {
    console.log(this.selectedColor);
    console.log(event, data);
  }

  public onChangeColorCmyk(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);
    if (hsva) {
      const rgba = this.cpService.hsvaToRgba(hsva);

      return this.cpService.rgbaToCmyk(rgba);
    }
    return new Cmyk(0, 0, 0, 0);
  }

  public onChangeColorHex8(color: string): string {
    const hsva = this.cpService.stringToHsva(color, true);
    if (hsva) {
      return this.cpService.outputFormat(hsva, "rgba", null);
    }
    return "";
  }
}
