import { Component, OnInit, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { ConsumableCard } from "../../../models/ConsumableCard";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';
import { ConsumableCategory } from '../../../models/ConsumableCategory';
import { ConsumableUnit } from '../../../models/ConsumableUnit';

@Component({
  selector: 'app-consumable-card',
  templateUrl: './consumable-card.component.html',
  styleUrls: ['./consumable-card.component.css']
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [ConsumableCardComponent],
  providers: [ConsumableCardComponent]
})
export class ConsumableCardComponent extends BaseComponent implements OnInit {

   /* Is Waiting For an update or insert */
   isWaitingInsertOrUpdate: boolean = false;

   /* Is Table Refreshing */
   isTableRefreshing: boolean = false;
 
   /* Is Table Exporting */
   isTableExporting: boolean = false;
 
   /* Store Fixed Asset Cards */
   consumableCards: ConsumableCard[] = [];
 
   /* Store Fixed Asset Card Categories */
   consumableCategories: ConsumableCategory[] = [];
   consumableUnits: ConsumableUnit[]=[];
   /* Store the current fixed asset card */
   consumableCard: ConsumableCard = new ConsumableCard();

   public dataTable: TreeGridTable = new TreeGridTable("fixedassetcard",
   [
     {
       columnDisplayName: "Malzeme Kodu",
       columnName: ["ConsumableCardCode"],
       isActive: true,
       classes: [],
       placeholder: "",
       type: "text"
     },
     {
       columnDisplayName: "Malzeme Adı",
       columnName: ["ConsumableCardName"],
       isActive: true,
       classes: [],
       placeholder: "",
       type: "text"
     },
     {
       columnDisplayName: "Malzeme Kategorisi",
       columnName: ["ConsumableCategory", "ConsumableCategoryName"],
       isActive: true,
       classes: [],
       placeholder: "",
       type: "text"
     },
    //  {
    //    columnDisplayName: "Özellik",
    //    columnName: ["Description"],
    //    isActive: true,
    //    classes: [],
    //    placeholder: "",
    //    type: "text"
    //  },
     {
       columnDisplayName: "Birim",
       columnName: ["ConsumableUnit", "ConsumableUnitName"],
       isActive: true,
       classes: [],
       placeholder: "",
       type: "text"
     },
     {
       columnDisplayName: "Minimum Stok Seviyesi",
       columnName: ["MinimumStockLevel"],
       isActive: true,
       classes: [],
       placeholder: "",
       type: "text"
     }
   ],
   {
     isDesc: false,
     column: ["ConsumableCardName"]
   }
 );

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadConsumableCards();
    this.loadDropdownList();
  }

  ngOnInit() {
  }

  resetForm(data: NgForm, isNewItem: boolean) {
    /* Reset modal form then reload lists */
    data.resetForm(this.consumableCard);
    this.loadConsumableCards();
    this.loadDropdownList();
    if (isNewItem == true) {
      this.consumableCard = new ConsumableCard();
    }
  }

  onSubmit(data: NgForm) {

    /* Check model state */
    if (data.form.invalid == true) return;

    /* if fixed asset card id exists means update it otherwise insert it */
    if (this.consumableCard.ConsumableCardId == null) {
      this.addConsumableCard(data);
    } else {
      this.popupComponent.ShowModal('#modalShowQuestionPopupForConsumableCard');
      this.popupComponent.CloseModal('#modalConsumableCard');
    }
  }

  async deleteConsumableCards() {

    /* Get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* If count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup("Lütfen en az bir malzeme kartı seçiniz");
      return;
    }

    /* Show Question Message */
    this.baseService.popupService.ShowQuestionPopupForDelete(() => {

      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.consumableCardService.DeleteConsumableCards(itemIds, (notDeletedItemIds: number[]) => {

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* if all of them removed */
        if (itemIds.length == 1)
          this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('Delete_operation_successful'));
        else
          this.baseService.popupService.ShowAlertPopup(this.getLanguageValue('All_records_deleted'));

        /* Clear all the ids from table */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Get current original sources */
        this.consumableCards = <ConsumableCard[]>this.dataTable.TGT_copySource();

      }, (itemIds:NotDeletedItem[],error: HttpErrorResponse) => {

        let barcode:ConsumableCard;

        let notDeletedCode : string[]=[];

        let faCards = <ConsumableCard[]>this.dataTable.TGT_copySource();
        
        /* Hide spinner then show error message */
        this.baseService.spinner.hide();

        itemIds.forEach((e:NotDeletedItem) => {
          for(let i=0; i<itemIds.length; i++){
        barcode = faCards.find(x=>x.ConsumableCardId == e[i].Id);
        }     
          notDeletedCode.push(barcode.ConsumableCardCode);
        });

        /* Show error message */
        if(itemIds.length>0)
        this.baseService.popupService.ShowDeletePopup(error,notDeletedCode);
        else
        this.baseService.popupService.ShowErrorPopup(error);

      });
    });
  }

  async addConsumableCard(data: NgForm) {

    /* Say user to wait */
    this.isWaitingInsertOrUpdate = true;

    /* Insert Fixed Asset Card service */
    this.baseService.consumableCardService.InsertConsumableCard(this.consumableCard,
      (insertedItem: ConsumableCard, message) => {

        /* Change loading bar status */
        this.isWaitingInsertOrUpdate = false;

        /* Show Success popup */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Get inserted asset card id */
        this.consumableCard.ConsumableCardId = insertedItem.ConsumableCardId;

        /* Bind Consumable Category object  */
        this.consumableCard.ConsumableCategory =
          this.consumableCategories.find(x => x.ConsumableCategoryId == this.consumableCard.ConsumableCategoryId);

        /* Bind Consumable Units object  */          
          this.consumableCard.ConsumableUnit = this.consumableUnits.find(x=> x.ConsumableUnitId == this.consumableCard.ConsumableUnitId);
        
          /* Push the items list */
        this.consumableCards.push(this.consumableCard);

        /* Reload Data Table */
        this.dataTable.TGT_loadData(this.consumableCards);

        /* Reset Modal form */
        this.resetForm(data, true);

      }, (error: HttpErrorResponse) => {

        /* Change loading bar status */
        this.isWaitingInsertOrUpdate = false;

        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);

      });
  }

  async updateConsumableCard(data: NgForm) {

        /* loading icon visible */
        this.isWaitingInsertOrUpdate = true;

        let willUpdateItem = new ConsumableCard();
        Object.assign(willUpdateItem, this.consumableCard);

        this.baseService.consumableCardService.UpdateConsumableCard(this.consumableCard,
          (_updatedConsumableCard, message) => {

            /* Close loading icon */
            this.isWaitingInsertOrUpdate = false;

            /* Show pop up then update data in datatable */
            this.baseService.popupService.ShowSuccessPopup(message);

            /* Bind Consumable Category object  */
            this.consumableCard.ConsumableCategory =
            this.consumableCategories.find(x => x.ConsumableCategoryId == this.consumableCard.ConsumableCategoryId);

            /* Bind Consumable Units object  */          
            this.consumableCard.ConsumableUnit = this.consumableUnits.find(x=> x.ConsumableUnitId == this.consumableCard.ConsumableUnitId);
          
            let updatedConsumableCard = new ConsumableCard();
            Object.assign(updatedConsumableCard, this.consumableCard);

            /* Update in table the current user */
            this.dataTable.TGT_updateData(updatedConsumableCard);

            /* Get original source after update completed */
            this.consumableCards = <ConsumableCard[]>this.dataTable.TGT_copySource();

          }, (error: HttpErrorResponse) => {

            /* Close loader */
            this.isWaitingInsertOrUpdate = false;

            /* Show error message */
            this.baseService.popupService.ShowErrorPopup(error);

          });
        this.popupComponent.CloseModal('#modalShowQuestionPopupForConsumableCard');          
  }

  async loadConsumableCards() {
    /* Load all fixed asset cards to datatable */
    await this.baseService.consumableCardService.GetConsumableCards(
      (consumableCards: ConsumableCard[]) => {
        this.consumableCards = consumableCards;
        this.dataTable.TGT_loadData(this.consumableCards);
        if(consumableCards.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadDropdownList(){

    this.baseService.consumableCategoryService.GetConsumableCategories((consumableCategories: ConsumableCategory[]) => {

      this.consumableCategories = consumableCategories;
      this.dataTable.TGT_loadData(this.consumableCards);
    },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
    
     this.baseService.consumableUnitService.GetConsumableUnits((consumableUnits: ConsumableUnit[]) => {

        this.consumableUnits = consumableUnits;
        this.dataTable.TGT_loadData(this.consumableUnits);
      },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );

  }

  async onDoubleClickItem(item: ConsumableCard) {

    /* Clear Model */
    this.consumableCard = new ConsumableCard();

    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* load fixed asset card categories if not loaded */
    this.loadDropdownList();

    /* get company information from server */
    await this.baseService.consumableCardService.GetConsumableCardById(
      item.ConsumableCardId,
      (result: ConsumableCard) => {
        /* then bind it to fixed asset card category model to update */
        setTimeout(() => {

          /* close loading */
          this.baseService.spinner.hide();

          /* Trigger to model to show it */
         //$("#btnEditConsumableCard").trigger("click");

          /* bind result to model */
          Object.assign(this.consumableCard, result);

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

    await this.loadConsumableCards();

    this.isTableRefreshing = false;

  }

}
