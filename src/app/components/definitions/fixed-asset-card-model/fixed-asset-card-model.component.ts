import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardBrand } from "../../../models/FixedAssetCardBrand";
import { FixedAssetCardModel } from "../../../models/FixedAssetCardModel";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

@Component({
  selector: "app-fixed-asset-card-model",
  templateUrl: "./fixed-asset-card-model.component.html",
  styleUrls: ["./fixed-asset-card-model.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FixedAssetCardModelComponent],
  providers: [FixedAssetCardModelComponent]
})
export class FixedAssetCardModelComponent extends BaseComponent
  implements OnInit {

  /* Is Waititing for a request */
  isWaitingInsertOrUpdate: boolean = false;

   /* Is Table Refreshing */
   isTableRefreshing: boolean = false;

   /* Is Table Exporting */
   isTableExporting: boolean = false;

  /* Store Fixed Asset Card Brand */
  fixedAssetCardBrands: FixedAssetCardBrand[] = [];

  /* Store Fixed Asset Card Models */
  fixedAssetCardModels: FixedAssetCardModel[] = [];

  /* Current Fixed Asset Card Model */
  fixedAssetCardModel: FixedAssetCardModel = new FixedAssetCardModel();

  public dataTableModel: TreeGridTable = new TreeGridTable(
    "fixedassetcardmodel",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Model_Code'),
        columnName: ["FixedAssetCardModelCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Brand_Name'),
        columnName: ["FixedAssetCardBrand", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Model_Name'),
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

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetCardModels();
    this.loadBrands();
  }

  ngOnInit() { }

  onSubmit(data: NgForm) {

    /* Check model state is valid */
    if (data.form.invalid == true) return;

    if (this.fixedAssetCardModel.FixedAssetCardModelId == null)
      this.addFixedAssetCardModel(data);
    else 
    {
      this.popupComponent.ShowModal('#modalShowQuestionPopupForFixedAssetCardModel');
      this.popupComponent.CloseModal('#modalFixedAssetCardModel');
    }
  }

  resetForm(data: NgForm, isNewItem: boolean) {

    /* Reset form if required create a new object */
    data.resetForm(this.fixedAssetCardModel);
    if (isNewItem == true) {
      this.fixedAssetCardModel = new FixedAssetCardModel();
    }

  }

  async addFixedAssetCardModel(data: NgForm) {

    /* Check form is valid */
    if (data.form.invalid == true) return;

    /* Show waiting loader */
    this.isWaitingInsertOrUpdate = true;

    await this.baseService.fixedAssetCardModelService.InsertFixedAssetCardModel(this.fixedAssetCardModel,
      (insertedItem: FixedAssetCardModel, message) => {

        /* Close waiting loader */
        this.isWaitingInsertOrUpdate = false;

        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Binding selected brand */
        this.fixedAssetCardModel.FixedAssetCardBrand =
          this.fixedAssetCardBrands.find(x => x.FixedAssetCardBrandId == this.fixedAssetCardModel.FixedAssetCardBrandId);

        /* Get inserted item id and bind it to current item */
        this.fixedAssetCardModel.FixedAssetCardModelId = insertedItem.FixedAssetCardModelId;

        /* Push fixed asset card models to inserted item */
        this.fixedAssetCardModels.push(this.fixedAssetCardModel);

        /* Reload datatable */
        this.dataTableModel.TGT_loadData(this.fixedAssetCardModels);

        /* Reset forms */
        this.resetForm(data, true);

      }, (error: HttpErrorResponse) => {

        /* Close waiting loader */
        this.isWaitingInsertOrUpdate = false;

        /* Show error pop up */
        this.baseService.popupService.ShowErrorPopup(error);

      });

  }

  async loadFixedAssetCardModels() {

    await this.baseService.fixedAssetCardModelService.GetFixedAssetCardModels(
      (facms: FixedAssetCardModel[]) => {
        this.fixedAssetCardModels = facms;
        this.dataTableModel.TGT_loadData(this.fixedAssetCardModels);
        if(this.fixedAssetCardModels.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadBrands() {

    if (this.fixedAssetCardBrands.length == 0) {
      await this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
        (facbs: FixedAssetCardBrand[]) => {
          this.fixedAssetCardBrands = facbs;
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }
  }

  async updateFixedAssetCardModel(data: NgForm) {

        /* Change button to loading */
        this.isWaitingInsertOrUpdate = true;

        this.baseService.fixedAssetCardModelService.UpdateFixedAssetCardModel(this.fixedAssetCardModel, (_fixedAssetCardModel, message) => {

          /* Change loading to button */
          this.isWaitingInsertOrUpdate = false;

          /* Show success message */
          this.baseService.popupService.ShowSuccessPopup(message);

          /* Create a fixed asset for updated item to create a refrences */
          let updatedModel = new FixedAssetCardModel();
          Object.assign(updatedModel, this.fixedAssetCardModel);

          /* Binding selected brand */
          updatedModel.FixedAssetCardBrand =
            this.fixedAssetCardBrands.find(x => x.FixedAssetCardBrandId == updatedModel.FixedAssetCardBrandId);

          /* Update in datatable */
          this.dataTableModel.TGT_updateData(updatedModel);

          /* Get original source */
          this.fixedAssetCardModels = <FixedAssetCardModel[]>this.dataTableModel.TGT_copySource();

        }, (error: HttpErrorResponse) => {

          /* Change loading to button */
          this.isWaitingInsertOrUpdate = false;

          /* Show error message */
          this.baseService.popupService.ShowErrorPopup(error);

        });
    this.popupComponent.CloseModal('#modalShowQuestionPopupForFixedAssetCardModel');    
  }

  async onDoubleClickItem(item: FixedAssetCardModel) {

    /* Create a new FixedAssetCard model */
    this.fixedAssetCardModel = new FixedAssetCardModel();

    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* Load brands from service */
    this.loadBrands();

    /* Get double clicked item from server */
    await this.baseService.fixedAssetCardModelService.GetFixedAssetCardModelById(item.FixedAssetCardModelId,
      (result: FixedAssetCardModel) => {

        setTimeout(() => {

          /* Hide Spinner */
          this.baseService.spinner.hide();

          /* Trigger edit button to show modal */
          $("#btnEditFixedAssetCardModel").trigger("click");

          /* bind result to model */
          this.fixedAssetCardModel = result;

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

  async deleteFixedAssetCardModels() {

    /* get selected items from table */
    let selectedItems = this.dataTableModel.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup( this.getLanguageValue('Please_choose_at_least_one_record'));
      return;
    }

    /* Show Question Message */
    // await this.baseService.popupService.ShowQuestionPopupForDelete(() => {

      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.fixedAssetCardModelService.DeleteFixedAssetCarModels(itemIds, () => {

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* if all of them removed */
        if (itemIds.length == 1)
          this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('Delete_operation_successful'));
        else
          this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('All_records_deleted'));

        /* Clear ids from source */
        this.dataTableModel.TGT_removeItemsByIds(itemIds);

        /* Get current table source */
        this.fixedAssetCardModels = <FixedAssetCardModel[]>this.dataTableModel.TGT_copySource();

      }, (itemIds:NotDeletedItem[],error: HttpErrorResponse) => {

        let barcode:FixedAssetCardModel;

        let notDeletedCode : string[]=[];

        let faModels = <FixedAssetCardModel[]>this.dataTableModel.TGT_copySource();
        
        /* Deactive the spinner */
        this.baseService.spinner.hide();

        itemIds.forEach((e:NotDeletedItem) => {
          for(let i=0; i<itemIds.length; i++){
        barcode = faModels.find(x=>x.FixedAssetCardModelId == e[i].Id);
        }     
          notDeletedCode.push(barcode.FixedAssetCardModelCode);
        });

        /* Show error message */
        if(itemIds.length>0)
        this.baseService.popupService.ShowDeletePopup(error,notDeletedCode);
        else
        this.baseService.popupService.ShowErrorPopup(error);

      });
      this.popupComponent.CloseModal('#modalShowDeletePopupForFixedAssetCardModel');      
    // });
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTableModel.isLoading = true;

    this.dataTableModel.TGT_clearData();

    await this.loadFixedAssetCardModels();

    this.isTableRefreshing = false;

  }

}
