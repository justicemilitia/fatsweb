import { Component, OnInit, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { FixedAssetCardBrand } from "../../../models/FixedAssetCardBrand";
import { FixedAssetCardModel } from "../../../models/FixedAssetCardModel";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { BaseComponent } from "../../base/base.component";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";

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
  fixedAssetCardModel: FixedAssetCardModel = new FixedAssetCardModel();
  fixedAssetCardModels: FixedAssetCardModel[] = [];
  fixedAssetCardBrands: FixedAssetCardBrand[] = [];

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
        columnName: ["FixedAssetCardBrand","Name"],
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

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetCardModels();
  }

  ngOnInit() {}

  onSubmit(data: NgForm) {
    if (data.value.FixedAssetCardModelId == null)
      this.insertFixedAssetCardModel(data);
    else this.updateFixedAssetCardModel(data);
  }

  resetForm() {
    this.fixedAssetCardModel = new FixedAssetCardModel();
  }

  async insertFixedAssetCardModel(data: NgForm) {
    if (data.value.invalid == true) return;

    await this.baseService.fixedAssetCardModelService.InsertFixedAssetCardModel(
      this.fixedAssetCardModel,
      (data: FixedAssetCardModel, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.fixedAssetCardModel.FixedAssetCardBrandId =
          data.FixedAssetCardBrandId;
        this.fixedAssetCardModels.push(this.fixedAssetCardModel);
        this.dataTableModel.TGT_loadData(this.fixedAssetCardModels);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
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
   await this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
      (facbs: FixedAssetCardBrand[]) => {
        this.fixedAssetCardBrands = facbs;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async updateFixedAssetCardModel(data: NgForm) {
    this.fixedAssetCardModel = <FixedAssetCardModel>data.value;
    await this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {
          this.baseService.fixedAssetCardModelService.UpdateFixedAssetCardModel(
            this.fixedAssetCardModel,
            (_fixedAssetCardModel, message) => {
              this.baseService.popupService.ShowSuccessPopup(message);
              this.dataTableModel.TGT_updateData(this.fixedAssetCardModel);
              this.resetForm();
            },
            (error: HttpErrorResponse) => {
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
        }
      }
    );
  }

  async onDoubleClickItem(item: FixedAssetCardModel) {
    this.baseService.spinner.show();

    await this.loadBrands();

    await this.baseService.fixedAssetCardModelService.GetFixedAssetCardModelById(
      item.FixedAssetCardModelId,
      (result: FixedAssetCardModel) => {
        setTimeout(() => {
          $("#btnAddFixedAssetCardModel").trigger("click");

          this.fixedAssetCardModel = result;
          this.baseService.spinner.hide();
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        this.baseService.spinner.hide();
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
