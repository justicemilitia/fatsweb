import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FixedAssetCardCategoryService } from "../../../services/fixed-asset-card-category-service/fixed-asset-card-category.service";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardCategory } from "../../../models/FixedAssetCardCategory";
import { HttpErrorResponse } from "@angular/common/http";
import { IData } from "src/app/extends/TreeGridTable/models/interfaces/IData";
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
export class FixedAssetCardCategoryComponent extends BaseComponent
  implements OnInit {
  fixedAssetCardCategories: FixedAssetCardCategory[] = [];
  fixedAssetCardCategory: FixedAssetCardCategory = new FixedAssetCardCategory();

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

  ngOnInit() {}

  resetForm() {
    this.fixedAssetCardCategory = new FixedAssetCardCategory();
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
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir şirket seçiniz"
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
      this.baseService.fixedAssetCardCategoryService.DeleteFixedAssetCardCategories(
        itemIds,
        (notDeletedItemIds: number[]) => {
          /* Deactive the spinner */
          this.baseService.spinner.hide();

          /* if any item exists in not deleted items */
          if (notDeletedItemIds) {
            /* Service return us not deleted ids. We will delete ids which exists in notDeletedItemIds number array */
            for (let ii = 0; ii < itemIds.length; ii++) {
              if (notDeletedItemIds.includes(itemIds[ii])) {
                itemIds.splice(ii, 1);
                ii--;
              }
            }

            /* if any value couldnt delete then show popup */
            if (itemIds.length == 0) {
              this.baseService.popupService.ShowAlertPopup(
                "Hiçbir Kayıt Silinemedi!"
              );
              return;
            }

            /* if some of them is deleted show this */
            if (itemIds.length > 0) {
              this.baseService.popupService.ShowAlertPopup(
                selectedItems.length.toString() +
                  " kayıttan " +
                  itemIds.length.toString() +
                  "'i silinebildi!"
              );
            }
          } else {
            /* if all of them removed */
            this.baseService.popupService.ShowAlertPopup(
              "Tüm kayıtlar başarıyla silindi!"
            );
          }

          /* Now Delete items from the source */
          for (let ii = 0; ii < itemIds.length; ii++) {
            let index = this.fixedAssetCardCategories.findIndex(
              x => x.FixedAssetCardCategoryId == itemIds[ii]
            );
            if (index > -1) {
              this.fixedAssetCardCategories.splice(index, 1);
            }
          }

          /* Reload Page */
          this.dataTable.TGT_loadData(this.fixedAssetCardCategories);
        },
        (error: HttpErrorResponse) => {
          this.baseService.spinner.hide();
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    });
  }

  async addFixedAssetCardCategory(data: NgForm) {
    if (data.form.invalid == true) return;

    /* Insert FixedAssetCardCatgory service */

    await this.baseService.fixedAssetCardCategoryService.InsertFixedAssetCardCategory(
      this.fixedAssetCardCategory,
      (data: FixedAssetCardCategory, message) => {
        /* Show pop up, get inserted fixed asset card then set it fixed asset card id, then load data. */
        this.baseService.popupService.ShowSuccessPopup(message);
        this.fixedAssetCardCategory.FixedAssetCardCategoryId =
          data.FixedAssetCardCategoryId;
        this.fixedAssetCardCategories.push(this.fixedAssetCardCategory);
        this.dataTable.TGT_loadData(this.fixedAssetCardCategories);
        this.resetForm();
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async updateFixedAssetCardCategory(data: NgForm) {
    /* Check model state */
    if (data.form.invalid == true) return;

    /* Ask for approve question if its true then update the fixed asset card category */
    await this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {
          this.baseService.fixedAssetCardCategoryService.UpdateFixedAssetCardCategory(
            this.fixedAssetCardCategory,
            (_fixedAssetCardCategory, message) => {
              /* Show pop up then update data in datatable */
              this.baseService.popupService.ShowSuccessPopup(message);
              this.dataTable.TGT_updateData(this.fixedAssetCardCategory);
              this.resetForm();
            },
            (error: HttpErrorResponse) => {
              /* Show error message */
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
        }
      }
    );
  }

  async loadFixedAssetCardCategories() {
    /* Load all fixed asset card cateogories to datatable */

    await this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
      (fixedAssetCardCategories: FixedAssetCardCategory[]) => {
        this.fixedAssetCardCategories = fixedAssetCardCategories;
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
  }}
