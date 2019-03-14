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
        type: "text"
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
    this.dataTable.isMultipleSelectedActive = false;
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
    if (data.form.invalid == true) return;
    this.isWaitingInsertOrUpdate = true;

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
    if (data.form.invalid == true) return;

    this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {
          this.isWaitingInsertOrUpdate = true;

          this.baseService.fixedAssetStatusService.UpdateStatus(
            this.status,
            (_updatedStatus: FixedAssetStatus, message) => {
              this.isWaitingInsertOrUpdate = false;
              this.baseService.popupService.ShowSuccessPopup(message);
              let updatedStatus: FixedAssetStatus = new FixedAssetStatus();
              Object.assign(updatedStatus, this.status);
              this.dataTable.TGT_updateData(updatedStatus);

              this.statuses = <FixedAssetStatus[]>(
                this.dataTable.TGT_copySource()
              );
            },
            (error: HttpErrorResponse) => {
              this.baseService.popupService.ShowErrorPopup(error);

              this.isWaitingInsertOrUpdate = false;
            }
          );
        }
      }
    );
  }
  public onEventLog(event: string, data: any): void {
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
