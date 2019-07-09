import { Component, OnInit, NgModule } from '@angular/core';
import { ReactiveFormsModule, NgForm } from '@angular/forms';
import { BaseComponent } from '../../base/base.component';
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';
import { ConsumableCategory } from '../../../models/ConsumableCategory';
import { BaseService } from '../../../services/base.service';
import { NotDeletedItem } from '../../../models/NotDeletedItem';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-consumable-category',
  templateUrl: './consumable-category.component.html',
  styleUrls: ['./consumable-category.component.css']
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [ConsumableCategoryComponent],
  providers: [ConsumableCategoryComponent]
})
export class ConsumableCategoryComponent extends BaseComponent implements OnInit {

   /* Is Waititing for a request */
   isWaitingInsertOrUpdate: boolean = false;

   /* Is Table Refreshing */
   isTableRefreshing: boolean = false;
 
   /* Is Table Exporting */
   isTableExporting: boolean = false;
 
   /* Store Fixed Categories */
   consumableCategories: ConsumableCategory[] = [];
 
   consumableCategoriesWithoutCurrent: ConsumableCategory[] = [];

   /* Current Fixed Asset Category */
   consumableCategory: ConsumableCategory = new ConsumableCategory();
 
   /* Data Table */
   public dataTable: TreeGridTable = new TreeGridTable(
     "fixedassetcardcategory",
     [
       {
         columnDisplayName: "Kategori Adı",
         columnName: ["ConsumableCategoryName"],
         isActive: true,
         classes: [],
         placeholder: "",
         type: "text"
       },
       {
         columnDisplayName: "Kategori Kodu",
         columnName: ["ConsumableCategoryCode"],
         isActive: true,
         classes: [],
         placeholder: "",
         type: "text"
       }
     ],
     {
       isDesc: false,
       column: ["ConsumableCategoryName"]
     }
   );
   
  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadConsumableCategories();
   }

  ngOnInit() {
  }

  resetForm(data: NgForm, isNewItem: boolean) {

    /* Reset form if required create a new object */
    data.resetForm(this.consumableCategory);
    this.getCategoryWithoutCurrent();    
    if (isNewItem == true) {
      this.consumableCategory = new ConsumableCategory();
    }
  }
  
  onSubmit(data: NgForm) {

    /* Is Form Valid */
    if (data.form.invalid == true) return;

    /* if fixed asset card category id exists means update it, otherwise insert it */
    if (this.consumableCategory.ConsumableCategoryId == null) {
      this.addConsumableCategory(data);
    } else {
      this.updateConsumableCategory(data);
    }
  }

  async loadConsumableCategories(){
         
    /* Load all fixed asset card cateogories to datatable */
    await this.baseService.consumableCategoryService.GetConsumableCategories(
      (consumableCategories: ConsumableCategory[]) => {

        /* Bind Fixed Categories to model */
        this.consumableCategories = consumableCategories;

        /* Load data to table */
        this.dataTable.TGT_loadData(this.consumableCategories);
        if(consumableCategories.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {

        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);

      }
    );
  }

   getCategoryWithoutCurrent() {
    this.consumableCategoriesWithoutCurrent = this.consumableCategories.filter(
      x => x.ConsumableCategoryId != this.consumableCategory.ConsumableCategoryId
    );
  }

  async addConsumableCategory(data: NgForm) {

    /* Close waiting loader */
    this.isWaitingInsertOrUpdate = true;

    /* Insert Fixed Asset Card Category */
    this.baseService.consumableCategoryService.InsertConsumableCategory(
      this.consumableCategory,
      (insertedItem: ConsumableCategory, message) => {

        /* Close waiting loader */
        this.isWaitingInsertOrUpdate = false;

        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Set inserted Item id to model */
        this.consumableCategory.ConsumableCategoryId = insertedItem.ConsumableCategoryId;

        /* Bind Parent category to bind */
        this.consumableCategory.ConsumableParentCategory =
          this.consumableCategories.find(x => x.ConsumableCategoryId == this.consumableCategory.ConsumableParentCategoryId);

        /* Push inserted item to category list */
        this.consumableCategories.push(this.consumableCategory);

        /* Reload data table */
        this.dataTable.TGT_loadData(this.consumableCategories);

        /* Reset Forms */
        this.resetForm(data, true);

      }, (error: HttpErrorResponse) => {

        /* Close waiting loader */
        this.isWaitingInsertOrUpdate = false;

        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);

      });
  }

  async updateConsumableCategory(data:NgForm){
    /* Ask for approve question if its true then update the fixed asset card category */
    this.baseService.popupService.ShowQuestionPopupForUpdate((response: boolean) => {
      if (response == true) {

        /* Change button to loading */
        this.isWaitingInsertOrUpdate = true;

        /* Update Model to database */
        this.baseService.consumableCategoryService.UpdateConsumableCategory(
          this.consumableCategory,
          (_consumableCategory, message) => {

            /* Change loading to button */
            this.isWaitingInsertOrUpdate = false;

            /* Show pop up then update data in datatable */
            this.baseService.popupService.ShowSuccessPopup(message);

            /* Create a fixed asset for updated item to create a refrences */
            let updatedModel = new ConsumableCategory();
            Object.assign(updatedModel, this.consumableCategory);

            /* Binding selected brand */
            updatedModel.ConsumableParentCategory =
              this.consumableCategories.find(x => x.ConsumableCategoryId == updatedModel.ConsumableParentCategoryId);

            /* Update in datatable */
            this.dataTable.TGT_updateData(updatedModel);

            /* Get original source */
            this.consumableCategories = <ConsumableCategory[]>this.dataTable.TGT_copySource();

           }, (error: HttpErrorResponse) => {

            /* Change loading to button */
            this.isWaitingInsertOrUpdate = false;

            /* Show error message */
            this.baseService.popupService.ShowErrorPopup(error);

          });
      }
    });
  }

  async deleteConsumableCategories() {
    /* get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(this.getLanguageValue('Choose_at_least_one_category'));
      return;
    }

    /* Show Question Message */
    this.baseService.popupService.ShowQuestionPopupForDelete(() => {

      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.consumableCategoryService.DeleteConsumableCardCategories(itemIds, () => {

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* if all of them removed */
        if (itemIds.length == 1)
          this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('Delete_operation_successful'));
        else
          this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('All_records_deleted'));

        /* Clear ids from source */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Get current table source */
        this.consumableCategories = <ConsumableCategory[]>this.dataTable.TGT_copySource();

      }, (itemIds:NotDeletedItem[],error: HttpErrorResponse) => {

        let barcode:ConsumableCategory;

        let notDeletedCode : string[]=[];

        let faCategories = <ConsumableCategory[]>this.dataTable.TGT_copySource();

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        itemIds.forEach((e:NotDeletedItem) => {
          for(let i=0; i<itemIds.length; i++){
        barcode = faCategories.find(x=>x.ConsumableCategoryId == e[i].Id);
        }     
          notDeletedCode.push(barcode.ConsumableCategoryCode);
        });

        /* Show error message */
        if(itemIds.length>0)
        this.baseService.popupService.ShowDeletePopup(error,notDeletedCode);
        else
        this.baseService.popupService.ShowErrorPopup(error);

      });
    });
  }

  async onDoubleClickItem(item: ConsumableCategory) {

    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* Load fixed asset card categories if not loaded */
    this.loadConsumableCategories();

    /* Get company information from server */
    await this.baseService.consumableCategoryService.GetConsumableCategoryById(item.ConsumableCategoryId,
      (result: ConsumableCategory) => {

        /* Then bind it to fixed asset card category model to update */
        setTimeout(() => {

          /* Hide Spinner */
          this.baseService.spinner.hide();

          /* Trigger edit button to show modal */
          $("#btnEditConsumableCategory").trigger("click");

          /* bind result to model */
          this.consumableCategory = result;

        }, 1000);
      }, (error: HttpErrorResponse) => {

        /* hide spinner */
        this.baseService.spinner.hide();

        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);

      });
  }
  
  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadConsumableCategories();
    
    this.isTableRefreshing = false;

  }

}
