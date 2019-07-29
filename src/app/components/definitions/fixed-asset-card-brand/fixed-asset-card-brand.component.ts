import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { FixedAssetCardBrand } from "../../../models/FixedAssetCardBrand";
import { BaseService } from "../../../services/base.service";

import { HttpErrorResponse } from "@angular/common/http";
import { BaseComponent } from "../../base/base.component";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

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

  /* Is waiting for update? */
  isWaitingInsertOrUpdate: boolean = false;
  
  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;

  /* Is Table Exporting */
  isTableExporting: boolean = false;

  /* Store The table list */
  fixedAssetCardBrands: FixedAssetCardBrand[] = [];

  /* Current brand */
  fixedAssetCardBrand: FixedAssetCardBrand = new FixedAssetCardBrand();

  /* Tables */
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
  }

  ngOnInit() { }

  resetForm(data: NgForm, isNewItem: boolean) {

    /* Reset form if required create a new object */
    data.resetForm(this.fixedAssetCardBrand);
    if (isNewItem == true) {
      this.fixedAssetCardBrand = new FixedAssetCardBrand();
    }

  }

  onSubmit(data: NgForm) {

    if (data.form.invalid == true) return;

    /* if id is empty means it is insert otherwise update */
    if (this.fixedAssetCardBrand.FixedAssetCardBrandId == null)
      this.addFixedAssetCardBrand(data);
    else 
    {
      this.popupComponent.ShowModal('#modalShowQuestionPopupForFixedAssetCardBrand');
      this.popupComponent.CloseModal('#modalFixedAssetCardBrand');
    }

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
          this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('Delete_operation_successful'));
        else
          this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('All_records_deleted'));

        /* Clear ids from source */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Get current table source */
        this.fixedAssetCardBrands = <FixedAssetCardBrand[]>this.dataTable.TGT_copySource();

      }, (itemIds:NotDeletedItem[],error: HttpErrorResponse) => {
        
        let barcode:FixedAssetCardBrand;

        let notDeletedCode : string[]=[];

        let faBrands = <FixedAssetCardBrand[]>this.dataTable.TGT_copySource();
        
        /* Deactive the spinner */
        this.baseService.spinner.hide();

        itemIds.forEach((e:NotDeletedItem) => {
          for(let i=0; i<itemIds.length; i++){
        barcode = faBrands.find(x=>x.FixedAssetCardBrandId == e[i].Id);
        }     
          notDeletedCode.push(barcode.FixedAssetCardBrandCode);
        });

        /* Show error message */
        if(itemIds.length>0)
        this.baseService.popupService.ShowDeletePopup(error,notDeletedCode);
        else
        this.baseService.popupService.ShowErrorPopup(error);

      });

    });
  }

  async addFixedAssetCardBrand(data: NgForm) {

    /* Check form validation */
    if (data.form.invalid == true) return;

    /* Hide button then show loader */
    this.isWaitingInsertOrUpdate = true;

    /* Insert fixed asset card brand to server */
    await this.baseService.fixedAssetCardBrandService.InsertFixedAssetCardBrand(this.fixedAssetCardBrand, (insertedItem: FixedAssetCardBrand, message) => {

      /* Show button then hide loader */
      this.isWaitingInsertOrUpdate = false;

      /* Show success pop up */
      this.baseService.popupService.ShowSuccessPopup(message);

      /* Get inserted item id */
      this.fixedAssetCardBrand.FixedAssetCardBrandId = insertedItem.FixedAssetCardBrandId;

      /* Push inserted item to array */
      this.fixedAssetCardBrands.push(this.fixedAssetCardBrand);

      /* Reload datatable */
      this.dataTable.TGT_loadData(this.fixedAssetCardBrands);

      /* Reset form */
      this.resetForm(data, true);

    }, (error: HttpErrorResponse) => {

      /* Show button then hide loader */
      this.isWaitingInsertOrUpdate = false;

      /* Show error pop up */
      this.baseService.popupService.ShowErrorPopup(error);

    });

  }

  async updateFixedAssetCardBrand(data: NgForm) {

        /* Change button to loading */
        this.isWaitingInsertOrUpdate = true;

        let willUpdateItem = new FixedAssetCardBrand();
        Object.assign(willUpdateItem, this.fixedAssetCardBrand);

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

          /* Get original source */
          this.fixedAssetCardBrands = <FixedAssetCardBrand[]>this.dataTable.TGT_copySource();

        }, (error: HttpErrorResponse) => {

          /* Change loading to button */
          this.isWaitingInsertOrUpdate = false;

          /* Show error message */
          this.baseService.popupService.ShowErrorPopup(error);

        });
        this.popupComponent.CloseModal('#modalShowQuestionPopupForFixedAssetCardBrand');    
  }

  async loadFixedAssetCardBrands() {

    /* Get Fixed Asset Brands */
    await this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
      (facbs: FixedAssetCardBrand[]) => {
        this.fixedAssetCardBrands = facbs;
        this.dataTable.TGT_loadData(this.fixedAssetCardBrands);
        if(this.fixedAssetCardBrands.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async onDoubleClickItem(item: FixedAssetCardBrand) {

    /* Create a new FixedAssetCard */
    this.fixedAssetCardBrand = new FixedAssetCardBrand();

    /* Show spinner for loading */
    this.baseService.spinner.show();

    await this.baseService.fixedAssetCardBrandService.GetFixedAssetBrandById(item.FixedAssetCardBrandId, (result: FixedAssetCardBrand) => {
      setTimeout(() => {

        /* Hide  the spinner */
        this.baseService.spinner.hide();

        /* Trigger to model to show it */
        $("#btnAddFixedAssetCardBrand").trigger("click");

        /* bind result to model */
        this.fixedAssetCardBrand = result;

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

    await this.loadFixedAssetCardBrands();

    this.isTableRefreshing = false;

  }

}
