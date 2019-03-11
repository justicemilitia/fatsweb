import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardBrand } from "../../../models/FixedAssetCardBrand";
import { FixedAssetCardModel } from "../../../models/FixedAssetCardModel";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";

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
        columnDisplayName: "Kod",
        columnName: ["FixedAssetCardModelCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Marka",
        columnName: ["FixedAssetCardBrand", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Model",
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
    if (data.value.FixedAssetCardModelId == null)
      this.addFixedAssetCardModel(data);
    else this.updateFixedAssetCardModel(data);
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
        this.fixedAssetCardModel.FixedAssetCardBrandId = insertedItem.FixedAssetCardBrandId;

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

    /* Check form validation */
    if (data.form.invalid == true) return;

    /* Update model */
    await this.baseService.popupService.ShowQuestionPopupForUpdate((response: boolean) => {
      if (response == true) {

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
      }
    });
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

  async deleteFixedAssetCardModel() {

    /* get selected items from table */
    let selectedItems = this.dataTableModel.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup("Lütfen en az bir kayıt seçiniz");
      return;
    }

    /* Show Question Message */
    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {

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
          this.baseService.popupService.ShowAlertPopup("Kayıt Başarıyla silindi!");
        else
          this.baseService.popupService.ShowAlertPopup("Tüm kayıtlar başarıyla silindi!");

        /* Clear ids from source */
        this.dataTableModel.TGT_removeItemsByIds(itemIds);

        /* Get current table source */
        this.fixedAssetCardModels = <FixedAssetCardModel[]>this.dataTableModel.TGT_copySource();

      }, (error: HttpErrorResponse) => {
        
        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* Show alert pop up */
        this.baseService.popupService.ShowErrorPopup(error);

      });
    });
  }

}
