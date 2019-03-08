import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";

import { FixedAssetCardBrand } from "../../../models/FixedAssetCardBrand";
import { FixedAssetCardModel } from "../../../models/FixedAssetCardModel";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";

@Component({
  selector: "app-fixed-asset-card-model",
  templateUrl: "./fixed-asset-card-model.component.html",
  styleUrls: ["./fixed-asset-card-model.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FixedAssetCardModelComponent],
  providers: [FixedAssetCardModelComponent]
})
export class FixedAssetCardModelComponent extends BaseComponent
  implements OnInit {

  isWaitingInsertOrUpdate: boolean = false;

  fixedAssetCardBrands: FixedAssetCardBrand[] = [];
    
  fixedAssetCardModels: FixedAssetCardModel[] = [];
  fixedAssetCardModel: FixedAssetCardModel = new FixedAssetCardModel();

  public dataTableModel: TreeGridTable = new TreeGridTable(
    "fixedassetcardmodel",
    [
      {
        columnDisplayName: "Kod",
        columnName: ["FixedAssetCardModelCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Marka",
        columnName: ["FixedAssetCardBrand","Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Model",
        columnName: ["Name"],
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

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetCardModels();
  }

  ngOnInit() {}

  onSubmit(data: NgForm) {
    if (data.value.FixedAssetCardModelId == null)
      this.addFixedAssetCardModel(data);
    else this.updateFixedAssetCardModel(data);
  }

  resetForm() {
    this.fixedAssetCardModel = new FixedAssetCardModel();
  }

  async addFixedAssetCardModel(data: NgForm) {
    if (data.value.invalid == true) return;

    this.isWaitingInsertOrUpdate=true;

    await this.baseService.fixedAssetCardModelService.InsertFixedAssetCardModel(
      this.fixedAssetCardModel,
      (data: FixedAssetCardModel, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.fixedAssetCardModel.FixedAssetCardBrandId =
          data.FixedAssetCardBrandId;
        this.fixedAssetCardModels.push(this.fixedAssetCardModel);
        this.dataTableModel.TGT_loadData(this.fixedAssetCardModels);
      
        this.resetForm();
        this.isWaitingInsertOrUpdate = false;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadFixedAssetCardModels() {

   await this.baseService.fixedAssetCardModelService.GetFixedAssetCardModels(
      (facms: FixedAssetCardModel[]) => {
        this.fixedAssetCardModels = facms;
        this.dataTableModel.TGT_loadData(this.fixedAssetCardModels);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadBrands() {

   await this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
      (facbs: FixedAssetCardBrand[]) => {
        this.fixedAssetCardBrands = facbs;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async updateFixedAssetCardModel(data: NgForm) {

    this.fixedAssetCardModel = <FixedAssetCardModel>data.value;

    await this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {
          this.baseService.fixedAssetCardModelService.UpdateFixedAssetCardModel(
            this.fixedAssetCardModel,
            (_fixedAssetCardModel, message) => {
              this.baseService.popupService.ShowSuccessPopup(message);             
              this.dataTableModel.TGT_updateData(this.fixedAssetCardModel);
              this.isWaitingInsertOrUpdate = false;
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

  async onDoubleClickItem(item: FixedAssetCardModel) {

    this.baseService.spinner.show();

    await this.loadBrands();

    await this.baseService.fixedAssetCardModelService.GetFixedAssetCardModelById(
      item.FixedAssetCardModelId,
      (result: FixedAssetCardModel) => {

        setTimeout(() => {          
          $("#btnAddFixedAssetCardModel").trigger("click");

          this.fixedAssetCardModel = result;
          this.baseService.spinner.hide();
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        this.baseService.spinner.hide();
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async deleteFixedAssetCardModel() {
    /* get selected items from table */
    let selectedItems = this.dataTableModel.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir model seçiniz"
      );
      return;
    }

    /* Show Question Message */
    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {
      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.fixedAssetCardModelService.DeleteFixedAssetCarModels(
        itemIds,
        () => {
          /* Deactive the spinner */
          this.baseService.spinner.hide();

          /* if all of them removed */
          if (itemIds.length == 1)
            this.baseService.popupService.ShowAlertPopup("Kayıt Başarıyla silindi!");
          else
            this.baseService.popupService.ShowAlertPopup("Tüm kayıtlar başarıyla silindi!");

          /* Clear all the ids from table */
          for (let ii = 0; ii < itemIds.length; ii++) {
            let index = this.fixedAssetCardModels.findIndex(x => x.FixedAssetCardModelId == itemIds[ii]);
            if (index > -1)
              this.fixedAssetCardModels.splice(index, 1);

          }

          /* Reload Page */
          this.dataTableModel.TGT_loadData(this.fixedAssetCardModels);
        },
        (failedItems: []) => {
          this.baseService.spinner.hide();
          this.baseService.popupService.ShowAlertPopup(
            "Kayıtlar ilişkili olduğundan silinemedi!"
          );
        }
      );
    });
  }
}
