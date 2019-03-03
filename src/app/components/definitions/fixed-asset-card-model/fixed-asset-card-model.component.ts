import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
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
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [FixedAssetCardModelComponent],
  providers: [FixedAssetCardModelComponent]
})
export class FixedAssetCardModelComponent extends BaseComponent
  implements OnInit {
  fixedAssetCardModel: FixedAssetCardModel = new FixedAssetCardModel();
  fixedAssetCardModels: FixedAssetCardModel[] = [];
  fixedAssetCardBrands: FixedAssetCardBrand[] = [];

  public dataTable: TreeGridTable = new TreeGridTable(
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
        columnDisplayName: "Marka",
<<<<<<< HEAD
        columnName: ["FixedAssetCardModel","FixedAssetCardBrand","Name"],
=======
        columnName: ["FixedAssetCardBrand"],
>>>>>>> 4a96a010b2b61329e19161a1df602ca79422c478
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
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

  OnSubmit(data: NgForm) {
    if (data.value.FixedAssetCardModelId == null)
      this.InsertFixedAssetCardModel(data);
    else this.UpdateFixedAssetCardModel(data);
  }

  InsertFixedAssetCardModel(data: NgForm) {
    if (data.value.invalid == true) return;
    this.fixedAssetCardModel = <FixedAssetCardModel>data.value;
    this.baseService.fixedAssetCardModelService.InsertFixedAssetCardModel(
      this.fixedAssetCardModel,
      (data: FixedAssetCardModel, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.fixedAssetCardModels.push(data);
        this.dataTable.TGT_loadData(this.fixedAssetCardModels);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadFixedAssetCardModels() {
    debugger;
    this.baseService.fixedAssetCardModelService.GetFixedAssetCardModels(
      (facms: FixedAssetCardModel[]) => {
        this.fixedAssetCardModels = facms;
        this.dataTable.TGT_loadData(this.fixedAssetCardModels);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadDropdownList() {
    debugger;
    this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
      (facbs: FixedAssetCardBrand[]) => {
        this.fixedAssetCardBrands = facbs;
        this.dataTable.TGT_loadData(this.fixedAssetCardBrands);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  UpdateFixedAssetCardModel(data: NgForm) {
    this.fixedAssetCardModel = <FixedAssetCardModel>data.value;
    this.baseService.popupService.ShowQuestionPopupForUpdate(response => {
      if (response == true) {
        this.baseService.fixedAssetCardModelService.UpdateFixedAssetCardModel(
          this.fixedAssetCardModel,
          (fixedAssetCardModel, message) => {
            this.baseService.popupService.ShowSuccessPopup(message);
            this.dataTable.TGT_updateData(fixedAssetCardModel);
          },
          (error: HttpErrorResponse) => {
            this.baseService.popupService.ShowErrorPopup(error);
          }
        );
      }
    });
  }

  onDoubleClickItem(item: FixedAssetCardModel) {
    this.baseService.fixedAssetCardModelService.GetFixedAssetCardModelById(
      item.FixedAssetCardModelId,
      result => {
        this.fixedAssetCardModel = result;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
    $("#btnAddFixedAssetCardModel").trigger("click");
    $("btnCreateOrUpdateFixedAssetCardModel").html("Güncelle");
  }
}
