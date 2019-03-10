import { Component, OnInit, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { FixedAssetCard } from "../../../models/FixedAssetCard";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardCategory } from "../../../models/FixedAssetCardCategory";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";

@Component({
  selector: "app-fixed-asset-card",
  templateUrl: "./fixed-asset-card.component.html",
  styleUrls: ["./fixed-asset-card.component.css"]
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [FixedAssetCardComponent],
  providers: [FixedAssetCardComponent]
})
export class FixedAssetCardComponent extends BaseComponent implements OnInit {
 
  fixedAssetCards: FixedAssetCard[] = [];
  fixedAssetCardCategories: FixedAssetCardCategory[] = [];
  fixedAssetCard: FixedAssetCard = new FixedAssetCard();

  public dataTable: TreeGridTable = new TreeGridTable("fixedassetcard",
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
        columnDisplayName: "Kod",
        columnName: ["FixedAssetCardCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Kategori",
        columnName: ["FixedAssetCardCategory", "Name"],
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
    this.loadFixedAssetCards();
    this.loadFixedAssetCardCategories();
  }

  ngOnInit() {}

  resetForm() {
    this.fixedAssetCard = new FixedAssetCard();
  }

  onSubmit(data: NgForm) {
    /* if fixed asset card id exists means update it otherwise insert it */
    if (data.value.FixedAssetCardId == null) {
      this.addFixedAssetCard(data);
    } else {
      this.updateFixedAssetCard(data);
    }
  }

  async deleteFixedAssetCards() {
    /* get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş kartı seçiniz"
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
      this.baseService.fixedAssetCardService.DeleteFixedAssetCards(
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
              " Tüm kayıtlar başarıyla silindi!"
            );
          }

          /* Now Delete items from the source */
          for (let ii = 0; ii < itemIds.length; ii++) {
            let index = this.fixedAssetCardCategories.findIndex(
              x => x.FixedAssetCardCategoryId == itemIds[ii]
            );
            if (index > -1) {
              this.fixedAssetCards.splice(index, 1);
            }
          }

          /* Reload Page */
          this.dataTable.TGT_loadData(this.fixedAssetCards);
        },
        (error: HttpErrorResponse) => {
          this.baseService.spinner.hide();
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    });
  }

  async addFixedAssetCard(data: NgForm) {
    /* Check model state is valid */
    if (data.form.invalid == true) return;

    /* Insert Company service */
    await this.baseService.fixedAssetCardService.InsertFixedAssetCard(
      this.fixedAssetCard,
      (data: FixedAssetCard, message) => {
        /* Show pop up, get inserted fixed asset card then set it fixed asset card id, then load data. */
        this.baseService.popupService.ShowSuccessPopup(message);
        this.fixedAssetCard.FixedAssetCardId = data.FixedAssetCardId;
        this.fixedAssetCards.push(this.fixedAssetCard);
        this.dataTable.TGT_loadData(this.fixedAssetCards);
        this.resetForm();
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async updateFixedAssetCard(data: NgForm) {
    /* Check model state */
    if (data.form.invalid == true) return;

    /* Ask for approve question if its true then update the fixed asset card */
    await this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {
          this.baseService.fixedAssetCardService.UpdateFixedAssetCard(
            this.fixedAssetCard,
            (_fixedAssetCard, message) => {
              /* Show pop up then update data in datatable */
              this.baseService.popupService.ShowSuccessPopup(message);
              this.dataTable.TGT_updateData(this.fixedAssetCard);
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

  async loadFixedAssetCards() {
    /* Load all fixed asset cards to datatable */
    await this.baseService.fixedAssetCardService.GetFixedAssetCards(
      (fixedAssetCards: FixedAssetCard[]) => {
        this.fixedAssetCards = fixedAssetCards;
        this.dataTable.TGT_loadData(this.fixedAssetCards);
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadFixedAssetCardCategories() {

    await this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories((fixedAssetCategories: FixedAssetCardCategory[]) => {
        
      this.fixedAssetCardCategories = fixedAssetCategories;
      this.dataTable.TGT_loadData(this.fixedAssetCards);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async onDoubleClickItem(item: FixedAssetCard) {
    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* load fixed asset cards if not loaded */
    await this.loadFixedAssetCards();

    /* load fixed asset card categories if not loaded */
    await this.loadFixedAssetCardCategories();

    /* get company information from server */
    await this.baseService.fixedAssetCardService.GetFixedAssetCardById(
      item.FixedAssetCardId,
      (result: FixedAssetCard) => {
        /* then bind it to fixed asset card category model to update */
        setTimeout(() => {
          /* bind result to model */
          this.fixedAssetCard = result;
          this.baseService.spinner.hide();

          /* Trigger to model to show it */
          $("#btnAddFixedAssetCard").trigger("click");
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
