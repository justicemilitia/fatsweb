import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardCategory } from "../../../models/FixedAssetCardCategory";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";

@Component({
  selector: "app-fixed-asset-card-category",
  templateUrl: "./fixed-asset-card-category.component.html",
  styleUrls: ["./fixed-asset-card-category.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FixedAssetCardCategoryComponent],
  providers: [FixedAssetCardCategoryComponent]
})
export class FixedAssetCardCategoryComponent extends BaseComponent implements OnInit {

  /* Is Waititing for a request */
  isWaitingInsertOrUpdate: boolean = false;

  /* Store Fixed Categories */
  fixedAssetCardCategories: FixedAssetCardCategory[] = [];

  /* Current Fixed Asset Category */
  fixedAssetCardCategory: FixedAssetCardCategory = new FixedAssetCardCategory();

  /* Data Table */
  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedassetcardcategory",
    [
      {
        columnDisplayName: "İsim",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Açıklama",
        columnName: ["Description"],
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
    this.loadFixedAssetCardCategories();
  }

  ngOnInit() { }

  resetForm(data: NgForm, isNewItem: boolean) {

    /* Reset form if required create a new object */
    data.resetForm(this.fixedAssetCardCategory);
    if (isNewItem == true) {
      this.fixedAssetCardCategory = new FixedAssetCardCategory();
    }

  }

  onSubmit(data: NgForm) {
    /* if fixed asset card category id exists means update it, otherwise insert it */
    if (data.value.FixedAssetCardCategoryId == null) {
      this.addFixedAssetCardCategory(data);
    } else {
      this.updateFixedAssetCardCategory(data);
    }
  }

  async deleteFixedAssetCardCategories() {
    /* get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup("Lütfen en az bir şirket seçiniz");
      return;
    }

    /* Show Question Message */
    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {

      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.fixedAssetCardCategoryService.DeleteFixedAssetCardCategories(itemIds, () => {

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
        this.fixedAssetCardCategories = <FixedAssetCardCategory[]>this.dataTable.TGT_copySource();

      }, (error: HttpErrorResponse) => {

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* Show alert pop up */
        this.baseService.popupService.ShowErrorPopup(error);

      });
    });
  }

  async addFixedAssetCardCategory(data: NgForm) {

    /* Is Form Valid */
    if (data.form.invalid == true) return;

    /* Insert Fixed Asset Card Category */
    await this.baseService.fixedAssetCardCategoryService.InsertFixedAssetCardCategory(
      this.fixedAssetCardCategory,
      (insertedItem: FixedAssetCardCategory, message) => {

        /* Close waiting loader */
        this.isWaitingInsertOrUpdate = false;

        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Set inserted Item id to model */
        this.fixedAssetCardCategory.FixedAssetCardCategoryId = insertedItem.FixedAssetCardCategoryId;

        /* Bind Parent category to bind */
        this.fixedAssetCardCategory.ParentCategory =
          this.fixedAssetCardCategories.find(x => x.FixedAssetCardCategoryId == this.fixedAssetCardCategory.ParentFixedAssetCardCategoryId);

        /* Push inserted item to category list */
        this.fixedAssetCardCategories.push(this.fixedAssetCardCategory);

        /* Reload data table */
        this.dataTable.TGT_loadData(this.fixedAssetCardCategories);

        /* Reset Forms */
        this.resetForm(data, true);

      }, (error: HttpErrorResponse) => {

        /* Close waiting loader */
        this.isWaitingInsertOrUpdate = false;

        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);

      });
  }

  async updateFixedAssetCardCategory(data: NgForm) {

    /* Check model state */
    if (data.form.invalid == true) return;

    /* Ask for approve question if its true then update the fixed asset card category */
    await this.baseService.popupService.ShowQuestionPopupForUpdate((response: boolean) => {
      if (response == true) {

        /* Change button to loading */
        this.isWaitingInsertOrUpdate = true;

        /* Update Model to database */
        this.baseService.fixedAssetCardCategoryService.UpdateFixedAssetCardCategory(
          this.fixedAssetCardCategory,
          (_fixedAssetCardCategory, message) => {

            /* Change loading to button */
            this.isWaitingInsertOrUpdate = false;

            /* Show pop up then update data in datatable */
            this.baseService.popupService.ShowSuccessPopup(message);

            /* Create a fixed asset for updated item to create a refrences */
            let updatedModel = new FixedAssetCardCategory();
            Object.assign(updatedModel, this.fixedAssetCardCategory);

            /* Binding selected brand */
            updatedModel.ParentCategory =
              this.fixedAssetCardCategories.find(x => x.FixedAssetCardCategoryId == updatedModel.ParentFixedAssetCardCategoryId);

            /* Update in datatable */
            this.dataTable.TGT_updateData(updatedModel);

            /* Get original source */
            this.fixedAssetCardCategories = <FixedAssetCardCategory[]>this.dataTable.TGT_copySource();

          }, (error: HttpErrorResponse) => {

            /* Change loading to button */
            this.isWaitingInsertOrUpdate = false;

            /* Show error message */
            this.baseService.popupService.ShowErrorPopup(error);

          });
      }
    });
  }

  async loadFixedAssetCardCategories() {

    /* Load all fixed asset card cateogories to datatable */
    await this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
      (fixedAssetCardCategories: FixedAssetCardCategory[]) => {

        /* Bind Fixed Categories to model */
        this.fixedAssetCardCategories = fixedAssetCardCategories;

        /* Load data to table */
        this.dataTable.TGT_loadData(this.fixedAssetCardCategories);

      },
      (error: HttpErrorResponse) => {

        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);

      }
    );
  }

  async onDoubleClickItem(item: FixedAssetCardCategory) {
    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* load fixed asset card categories if not loaded */
    await this.loadFixedAssetCardCategories();

    /* get company information from server */
    await this.baseService.fixedAssetCardService.GetFixedAssetCardById(
      item.FixedAssetCardCategoryId,
      (result: FixedAssetCardCategory) => {
        /* then bind it to fixed asset card category model to update */
        setTimeout(() => {
          /* bind result to model */
          this.fixedAssetCardCategory = result;
          this.baseService.spinner.hide();

          /* Trigger to model to show it */
          $("#btnAddFixedAssetCardCategory").trigger("click");
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
