import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "src/app/services/base.service";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { FixedAssetStatus } from "src/app/models/FixedAssetStatus";
import { HttpErrorResponse } from "@angular/common/http";
import { ColorPickerService, Cmyk } from "ngx-color-picker";
import { NgForm } from "@angular/forms";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

@Component({
  selector: "app-status",
  templateUrl: "./fixed-asset-status.component.html",
  styleUrls: ["./fixed-asset-status.component.css"]
})
export class FixedAssetStatusComponent extends BaseComponent implements OnInit {
  
  isWaitingInsertOrUpdate: boolean = false;

  /* Is Table Refreshing */
  isTableRefreshing:boolean = false;

  /* Is Table Exporting */
  isTableExporting:boolean = false;

  statuses: FixedAssetStatus[] = [];

  status: FixedAssetStatus = new FixedAssetStatus();

  selectedColor: string;

  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedassetstatus",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Statu_Code'),
        columnName: ["FixedAssetStatuCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Statu_Name'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Statu_Color'),
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
    if (this.status.FixedAssetStatusId == null) {
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
        if(this.statuses.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
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
      this.baseService.popupService.ShowAlertPopup( this.getLanguageValue('Please_choose_at_least_one_record'));
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
          this.baseService.popupService.ShowAlertPopup(this.getLanguageValue('Delete_operation_successful'));
        else
          this.baseService.popupService.ShowAlertPopup(this.getLanguageValue('All_records_deleted'));

        /* Clear all the ids from table */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Copy original source to current locations */
        this.statuses = <FixedAssetStatus[]>this.dataTable.TGT_copySource();

      }, (itemIds:NotDeletedItem[],error: HttpErrorResponse) => {

        let barcode:FixedAssetStatus;

        let notDeletedCode : string[]=[];

        let faStatus = <FixedAssetStatus[]>this.dataTable.TGT_copySource();
        
        /* Hide spinner then show error message */
        this.baseService.spinner.hide();

        itemIds.forEach((e:NotDeletedItem) => {
          for(let i=0; i<itemIds.length; i++){
        barcode = faStatus.find(x=>x.FixedAssetStatusId == e[i].Id);
        }     
          notDeletedCode.push(barcode.FixedAssetStatuCode);
        });

        /* Show error message */
        if(itemIds.length>0)
        this.baseService.popupService.ShowDeletePopup(error,notDeletedCode);
        else
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

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.LoadFixedAssetStatus();

    this.isTableRefreshing = false;

  }

}
