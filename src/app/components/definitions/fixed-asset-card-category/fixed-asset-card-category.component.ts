import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardCategory } from "../../../models/FixedAssetCardCategory";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

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

  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;

  /* Is Table Exporting */
  isTableExporting: boolean = false;

  /* Store Fixed Categories */
  fixedAssetCardCategories: FixedAssetCardCategory[] = [];

  /* Current Fixed Asset Category */
  fixedAssetCardCategory: FixedAssetCardCategory = new FixedAssetCardCategory();

  notDeletedBarcode: string = '';
  
  selectedItems:any[]=[];
  /* Data Table */
  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedassetcardcategory",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Category_Name'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Category_Code'),
        columnName: ["FixedAssetCardCategoryCode"],
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

    /* Is Form Valid */
    if (data.form.invalid == true) return;

    /* if fixed asset card category id exists means update it, otherwise insert it */
    if (this.fixedAssetCardCategory.FixedAssetCardCategoryId == null) {
      this.addFixedAssetCardCategory(data);
    } 
    else {
      this.popupComponent.ShowModal('#modalShowQuestionPopupForFixedAssetCardCategory');
      this.popupComponent.CloseModal('#modalFixedAssetCardCategory');
    }
  }
  

  onDelete(){
    
    /* get selected items from table */
    this.selectedItems = this.dataTable.TGT_getSelectedItems();
   
     /* if count of items equals 0 show message for no selected item */
     if (!this.selectedItems || this.selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(this.getLanguageValue('Choose_at_least_one_category'));
      return;
    }
   else
   this.popupComponent.ShowModal('#modalShowDeletePopupForFixedAssetCardCategory');
   
 }

  async deleteFixedAssetCardCategories() {

    this.notDeletedBarcode = '';    

    /* if count of items equals 0 show message for no selected item */
    if (!this.selectedItems || this.selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(this.getLanguageValue('Choose_at_least_one_category'));
      return;
    }

    /* Show Question Message */
    // this.baseService.popupService.ShowQuestionPopupForDelete(() => {

      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = this.selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.fixedAssetCardCategoryService.DeleteFixedAssetCardCategories(itemIds, () => {

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
        this.fixedAssetCardCategories = <FixedAssetCardCategory[]>this.dataTable.TGT_copySource();

      }, (itemIds:NotDeletedItem[],error: HttpErrorResponse) => {

        let barcode:FixedAssetCardCategory;

        let notDeletedCode : string[]=[];

        let faCategories = <FixedAssetCardCategory[]>this.dataTable.TGT_copySource();

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        itemIds.forEach((e:NotDeletedItem) => {
          for(let i=0; i<itemIds.length; i++){
            let id:NotDeletedItem = e;
            let ids:NotDeletedItem[]=[];
            ids.push(id);

            ids.forEach(t=>{
              for(let j=0; j<ids.length; j++)
              barcode= faCategories.find(x=>x.FixedAssetCardCategoryId == t[j].Id);
            });        
        }     
        notDeletedCode.push(barcode.FixedAssetCardCategoryCode);
        });

        /* Show error message */
        if(itemIds.length>0)
        {
          // this.baseService.popupService.ShowDeletePopup(error,notDeletedCode);
          
          notDeletedCode.forEach((e, i) => {
            this.notDeletedBarcode +=
              e + (i == this.selectedItems.length - 1 ? "" : ", ");
          });

           this.popupComponent.ShowModal('#modalShowErrorPopup');          
          }
        else
        this.baseService.popupService.ShowErrorPopup(error);

      });
      this.popupComponent.CloseModal('#modalShowDeletePopupForFixedAssetCardCategory');      
    // });
  }

  async addFixedAssetCardCategory(data: NgForm) {

    /* Close waiting loader */
    this.isWaitingInsertOrUpdate = true;

    /* Insert Fixed Asset Card Category */
    this.baseService.fixedAssetCardCategoryService.InsertFixedAssetCardCategory(
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

        /* Change button to loading */
        this.isWaitingInsertOrUpdate = true;

        let willUpdateItem = new FixedAssetCardCategory();
        Object.assign(willUpdateItem, this.fixedAssetCardCategory);
        
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
        this.popupComponent.CloseModal('#modalShowQuestionPopupForFixedAssetCardCategory');          
  }

  async loadFixedAssetCardCategories() {

    /* Load all fixed asset card cateogories to datatable */
    await this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
      (fixedAssetCardCategories: FixedAssetCardCategory[]) => {

        /* Bind Fixed Categories to model */
        this.fixedAssetCardCategories = fixedAssetCardCategories;

        /* Load data to table */
        this.dataTable.TGT_loadData(this.fixedAssetCardCategories);
        if(fixedAssetCardCategories.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
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

    /* Load fixed asset card categories if not loaded */
    this.loadFixedAssetCardCategories();

    /* Get company information from server */
    await this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategoryById(item.FixedAssetCardCategoryId,
      (result: FixedAssetCardCategory) => {

        /* Then bind it to fixed asset card category model to update */
        setTimeout(() => {

          /* Hide Spinner */
          this.baseService.spinner.hide();

          /* Trigger edit button to show modal */
          $("#btnEditFixedAssetCardCategory").trigger("click");

          /* bind result to model */
          this.fixedAssetCardCategory = result;

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

    await this.loadFixedAssetCardCategories();

    this.isTableRefreshing = false;

  }

}
