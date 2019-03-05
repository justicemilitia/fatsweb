import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { FixedAssetCardBrand } from "../../../models/FixedAssetCardBrand";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { BaseComponent } from "../../base/base.component";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import { FixedAssetCardModel } from "src/app/models/FixedAssetCardModel";

@Component({
  selector: "app-fixed-asset-card-brand",
  templateUrl: "./fixed-asset-card-brand.component.html",
  styleUrls: ["./fixed-asset-card-brand.component.css"]
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [FixedAssetCardBrandComponent],
  providers: [FixedAssetCardBrandComponent]
})
export class FixedAssetCardBrandComponent extends BaseComponent
  implements OnInit {
  fixedAssetCardBrands: FixedAssetCardBrand[] = [];
  fixedAssetCardBrand: FixedAssetCardBrand = new FixedAssetCardBrand();

  fixedAssetCardModels: FixedAssetCardModel[] = [];
  fixedAssetCardModel: FixedAssetCardModel = new FixedAssetCardModel();

  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedassetcardbrand",
    [
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

  public dataTableModel: TreeGridTable = new TreeGridTable(
    "fixedassetcardmodel",
    [
      {
        columnDisplayName: "Marka",
        columnName: ["FixedAssetCardModel","FixedAssetCardBrand","Name"],
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
      },
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetCardBrands();
    this.loadFixedAssetCardModels();    
  }

  ngOnInit() {}

  resetForm() {
    this.fixedAssetCardBrand = new FixedAssetCardBrand();
    this.fixedAssetCardModel = new FixedAssetCardModel();
  }

  OnSubmit(data: NgForm) {
    if (data.value.FixedAssetCardBrandId == null)
      this.InsertFixedAssetCardBrand(data);
    else this.UpdateFixedAssetCardBrand(data);
  }

  InsertFixedAssetCardBrand(data: NgForm) {
    if (data.form.invalid == true) return;
    this.fixedAssetCardBrand = <FixedAssetCardBrand>data.value;
    this.baseService.fixedAssetCardBrandService.InsertFixedAssetCardBrand(
      this.fixedAssetCardBrand,
      (data: FixedAssetCardBrand, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.fixedAssetCardBrands.push(data);
        this.dataTable.TGT_loadData(this.fixedAssetCardBrands);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  UpdateFixedAssetCardBrand(data: NgForm) {
    this.fixedAssetCardBrand = <FixedAssetCardBrand>data.value;
    this.baseService.popupService.ShowQuestionPopupForUpdate(response => {
      if (response == true) {
        this.baseService.fixedAssetCardBrandService.UpdateFixedAssetCardBrand(
          this.fixedAssetCardBrand,
          (fixedAssetCardBrand, message) => {
            this.baseService.popupService.ShowSuccessPopup(message);
            this.dataTable.TGT_updateData(fixedAssetCardBrand);
          },
          (error: HttpErrorResponse) => {
            this.baseService.popupService.ShowErrorPopup(error);
          }
        );
      }
    });
  }

  loadFixedAssetCardBrands() {
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

  loadFixedAssetCardModels() {
    this.baseService.fixedAssetCardModelService.GetFixedAssetCardModels(
      (facbs: FixedAssetCardModel[]) => {
        this.fixedAssetCardModels = facbs;
        this.dataTableModel.TGT_loadData(this.fixedAssetCardModels);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  onDoubleClickItem(item: any) {
    this.baseService.fixedAssetCardBrandService.GetFixedAssetBrandById(
      item.FixedAssetCardBrandId,
      result => {
        this.fixedAssetCardBrand = result;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
    $("#btnAddFixedAssetCardBrand").trigger("click");
  }
}
