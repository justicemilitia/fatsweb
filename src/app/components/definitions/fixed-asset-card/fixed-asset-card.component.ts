import { Component, OnInit, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { FixedAssetCard } from "../../../models/FixedAssetCard";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardCategory } from "../../../models/FixedAssetCardCategory";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

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

  /* Is Waiting For an update or insert */
  isWaitingInsertOrUpdate: boolean = false;

  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;

  /* Is Table Exporting */
  isTableExporting: boolean = false;

  /* Store Fixed Asset Cards */
  fixedAssetCards: FixedAssetCard[] = [];

  /* Store Fixed Asset Card Categories */
  fixedAssetCardCategories: FixedAssetCardCategory[] = [];

  /* Store the current fixed asset card */
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

  ngOnInit() { }

  resetForm(data: NgForm, isNewItem: boolean) {
    /* Reset modal form then reload lists */
    data.resetForm(this.fixedAssetCard);
    this.loadFixedAssetCardCategories();
    if (isNewItem == true) {
      this.fixedAssetCard = new FixedAssetCard();
    }

  }

  onSubmit(data: NgForm) {

    /* Check model state */
    if (data.form.invalid == true) return;

    /* if fixed asset card id exists means update it otherwise insert it */
    if (this.fixedAssetCard.FixedAssetCardId == null) {
      this.addFixedAssetCard(data);
    } else {
      this.updateFixedAssetCard(data);
    }
  }

  async deleteFixedAssetCards() {

    /* Get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* If count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup("Lütfen en az bir demirbaş kartı seçiniz");
      return;
    }

    /* Show Question Message */
    this.baseService.popupService.ShowQuestionPopupForDelete(() => {

      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.fixedAssetCardService.DeleteFixedAssetCards(itemIds, (notDeletedItemIds: number[]) => {

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* if all of them removed */
        if (itemIds.length == 1)
          this.baseService.popupService.ShowSuccessPopup("Kayıt Başarıyla silindi!");
        else
          this.baseService.popupService.ShowAlertPopup("Tüm kayıtlar başarıyla silindi!");

        /* Clear all the ids from table */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Get current original sources */
        this.fixedAssetCards = <FixedAssetCard[]>this.dataTable.TGT_copySource();

      }, (itemIds:NotDeletedItem[],error: HttpErrorResponse) => {

        let barcode:FixedAssetCard;

        let notDeletedCode : string[]=[];

        let faCards = <FixedAssetCard[]>this.dataTable.TGT_copySource();
        
        /* Hide spinner then show error message */
        this.baseService.spinner.hide();

        itemIds.forEach((e:NotDeletedItem) => {
          for(let i=0; i<itemIds.length; i++){
        barcode = faCards.find(x=>x.FixedAssetCardId == e[i].Id);
        }     
          notDeletedCode.push(barcode.FixedAssetCardCode);
        });

        /* Show error message */
        if(itemIds.length>0)
        this.baseService.popupService.ShowDeletePopup(error,notDeletedCode);
        else
        this.baseService.popupService.ShowErrorPopup(error);

      });
    });
  }

  async addFixedAssetCard(data: NgForm) {

    /* Say user to wait */
    this.isWaitingInsertOrUpdate = true;

    /* Insert Fixed Asset Card service */
    this.baseService.fixedAssetCardService.InsertFixedAssetCard(this.fixedAssetCard,
      (insertedItem: FixedAssetCard, message) => {

        /* Change loading bar status */
        this.isWaitingInsertOrUpdate = false;

        /* Show Success popup */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Get inserted asset card id */
        this.fixedAssetCard.FixedAssetCardId = insertedItem.FixedAssetCardId;

        /* Bind Category object  */
        this.fixedAssetCard.FixedAssetCardCategory =
          this.fixedAssetCardCategories.find(x => x.FixedAssetCardCategoryId == this.fixedAssetCard.FixedAssetCardCategoryId);

        /* Push the items list */
        this.fixedAssetCards.push(this.fixedAssetCard);

        /* Reload Data Table */
        this.dataTable.TGT_loadData(this.fixedAssetCards);

        /* Reset Modal form */
        this.resetForm(data, true);

      }, (error: HttpErrorResponse) => {

        /* Change loading bar status */
        this.isWaitingInsertOrUpdate = false;

        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);

      });
  }

  async updateFixedAssetCard(data: NgForm) {

    /* Ask for approve question if its true then update the fixed asset card */
    this.baseService.popupService.ShowQuestionPopupForUpdate((response: boolean) => {
      if (response == true) {

        /* loading icon visible */
        this.isWaitingInsertOrUpdate = true;

        this.baseService.fixedAssetCardService.UpdateFixedAssetCard(this.fixedAssetCard,
          (_updatedFixedAssetCard, message) => {

            /* Close loading icon */
            this.isWaitingInsertOrUpdate = false;

            /* Show pop up then update data in datatable */
            this.baseService.popupService.ShowSuccessPopup(message);

            /* Bind Category object  */
            this.fixedAssetCard.FixedAssetCardCategory =
              this.fixedAssetCardCategories.find(x => x.FixedAssetCardCategoryId == this.fixedAssetCard.FixedAssetCardCategoryId);

            let updatedFixedAssetCard = new FixedAssetCard();
            Object.assign(updatedFixedAssetCard, this.fixedAssetCard);

            /* Update in table the current user */
            this.dataTable.TGT_updateData(updatedFixedAssetCard);

            /* Get original source after update completed */
            this.fixedAssetCards = <FixedAssetCard[]>this.dataTable.TGT_copySource();

          }, (error: HttpErrorResponse) => {

            /* Close loader */
            this.isWaitingInsertOrUpdate = false;

            /* Show error message */
            this.baseService.popupService.ShowErrorPopup(error);

          });
      }
    });
  }

  async loadFixedAssetCards() {
    /* Load all fixed asset cards to datatable */
    await this.baseService.fixedAssetCardService.GetFixedAssetCards(
      (fixedAssetCards: FixedAssetCard[]) => {
        this.fixedAssetCards = fixedAssetCards;
        this.dataTable.TGT_loadData(this.fixedAssetCards);
        if(fixedAssetCards.length==0){
          this.baseService.popupService.ShowWarningPopup("Record_not_found");
        }
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadFixedAssetCardCategories() {

    this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories((fixedAssetCategories: FixedAssetCardCategory[]) => {

      this.fixedAssetCardCategories = fixedAssetCategories;
      this.dataTable.TGT_loadData(this.fixedAssetCards);
    },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async onDoubleClickItem(item: FixedAssetCard) {

    /* Clear Model */
    this.fixedAssetCard = new FixedAssetCard();

    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* load fixed asset card categories if not loaded */
    this.loadFixedAssetCardCategories();

    /* get company information from server */
    await this.baseService.fixedAssetCardService.GetFixedAssetCardById(
      item.FixedAssetCardId,
      (result: FixedAssetCard) => {
        /* then bind it to fixed asset card category model to update */
        setTimeout(() => {

          /* close loading */
          this.baseService.spinner.hide();

          /* Trigger to model to show it */
          $("#btnEditFixedAssetCard").trigger("click");

          /* bind result to model */
          Object.assign(this.fixedAssetCard, result);

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

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadFixedAssetCards();

    this.isTableRefreshing = false;

  }

}
