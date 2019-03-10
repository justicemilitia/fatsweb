import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { FixedAssetCardBrand } from "../../../models/FixedAssetCardBrand";
import { BaseService } from "../../../services/base.service";

import { HttpErrorResponse } from "@angular/common/http";
import { BaseComponent } from "../../base/base.component";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";

@Component({
  selector: "app-fixed-asset-card-brand",
  templateUrl: "./fixed-asset-card-brand.component.html",
  styleUrls: ["./fixed-asset-card-brand.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FixedAssetCardBrandComponent],
  providers: [FixedAssetCardBrandComponent]
})
export class FixedAssetCardBrandComponent extends BaseComponent
  implements OnInit {

  /* is waiting for update? */
  isWaitingInsertOrUpdate: boolean = false;

  fixedAssetCardBrands: FixedAssetCardBrand[] = [];
  fixedAssetCardBrand: FixedAssetCardBrand = new FixedAssetCardBrand();

  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedassetcardbrand",
    [
      {
        columnDisplayName: "Kod",
        columnName: ["FixedAssetCardBrandCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Marka",
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

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetCardBrands();
    //this.loadFixedAssetCardModels();
  }

  ngOnInit() { }

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.fixedAssetCardBrand);
    if (isNewItem == true) {
      this.fixedAssetCardBrand = new FixedAssetCardBrand();
    }
  }

  onSubmit(data: NgForm) {
    if (data.value.FixedAssetCardBrandId == null)
      this.addFixedAssetCardBrand(data);
    else this.updateFixedAssetCardBrand(data);
  }

  async deleteFixedAssetCardBrand() {

    /* Get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* If count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir marka seçiniz"
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
      this.baseService.fixedAssetCardBrandService.DeleteFixedAssetCardBrands(itemIds, () => {

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* if all of them removed */
        if (itemIds.length == 1)
          this.baseService.popupService.ShowAlertPopup("Kayıt Başarıyla silindi!");
        else
          this.baseService.popupService.ShowAlertPopup("Tüm kayıtlar başarıyla silindi!");

        /* Clear ids from source */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Get current table source */
        this.fixedAssetCardBrands = <FixedAssetCardBrand[]>this.dataTable.TGT_copySource();

      }, (error: HttpErrorResponse) => {

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* Show alert pop up */
        this.baseService.popupService.ShowErrorPopup(error);

      });

    });
  }

  async addFixedAssetCardBrand(data: NgForm) {
    if (data.form.invalid == true) return;

    await this.baseService.fixedAssetCardBrandService.InsertFixedAssetCardBrand(
      this.fixedAssetCardBrand,
      (insertedItem: FixedAssetCardBrand, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.fixedAssetCardBrand.FixedAssetCardBrandId =
          insertedItem.FixedAssetCardBrandId;

        this.fixedAssetCardBrands.push(this.fixedAssetCardBrand);
        this.dataTable.TGT_loadData(this.fixedAssetCardBrands);

        this.resetForm(data, true);
        this.isWaitingInsertOrUpdate = false;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.isWaitingInsertOrUpdate = false;
      }
    );
  }

  async updateFixedAssetCardBrand(data: NgForm) {

    if (data.form.invalid == true) return;

    await this.baseService.popupService.ShowQuestionPopupForUpdate((response: boolean) => {
      if (response == true) {

        /* Change button to loading */
        this.isWaitingInsertOrUpdate = true;

        this.baseService.fixedAssetCardBrandService.UpdateFixedAssetCardBrand(this.fixedAssetCardBrand, (_fixedAssetCardBrand, message) => {

          /* Change loading to button */
          this.isWaitingInsertOrUpdate = false;

          /* Show success message */
          this.baseService.popupService.ShowSuccessPopup(message);

          /* Create a fixed asset for updated item to create a refrences */
          let updatedBrand = new FixedAssetCardBrand();
          Object.assign(updatedBrand, this.fixedAssetCardBrand);

          /* Update in datatable */
          this.dataTable.TGT_updateData(updatedBrand);

        }, (error: HttpErrorResponse) => {

          /* Change loading to button */
          this.isWaitingInsertOrUpdate = false;

          /* Show error message */
          this.baseService.popupService.ShowErrorPopup(error);

        });
      }
    });

  }

  async loadFixedAssetCardBrands() {
    await this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
      (facbs: FixedAssetCardBrand[]) => {
        this.fixedAssetCardBrands = facbs;
        this.dataTable.TGT_loadData(this.fixedAssetCardBrands);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async onDoubleClickItem(item: FixedAssetCardBrand) {
    this.fixedAssetCardBrand = new FixedAssetCardBrand();

    /* Show spinner for loading */
    this.baseService.spinner.show();

    await this.baseService.fixedAssetCardBrandService.GetFixedAssetBrandById(
      item.FixedAssetCardBrandId,
      (result: FixedAssetCardBrand) => {
        setTimeout(() => {
          /* Trigger to model to show it */
          $("#btnAddFixedAssetCardBrand").trigger("click");

          /* bind result to model */
          this.fixedAssetCardBrand = result;
          this.baseService.spinner.hide();
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        /* hide spinner */
        this.baseService.spinner.hide();

        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
