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

  loadConsumableCategories(){

  }

  async addConsumableCategory(data: NgForm) {

   
  }

  updateConsumableCategory(data:NgForm){

  }

  async deleteConsumableCategories() {
    /* get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup("Lütfen en az bir kategori seçiniz");
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
          this.baseService.popupService.ShowAlertPopup("Kayıt Başarıyla silindi!");
        else
          this.baseService.popupService.ShowAlertPopup("Tüm kayıtlar başarıyla silindi!");

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


}
