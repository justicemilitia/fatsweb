import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FixedAssetCardCategoryService } from "../../../services/fixed-asset-card-category-service/fixed-asset-card-category.service";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardCategory } from "../../../models/FixedAssetCardCategory";
import { HttpErrorResponse } from "@angular/common/http";
import { IData } from "src/app/extends/TreeGridTable/models/interfaces/IData";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";

@Component({
  selector: "app-fixed-asset-card-category",
  templateUrl: "./fixed-asset-card-category.component.html",
  styleUrls: ["./fixed-asset-card-category.component.css"]
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [FixedAssetCardCategoryComponent],
  providers: [FixedAssetCardCategoryComponent]
})
export class FixedAssetCardCategoryComponent extends BaseComponent
  implements OnInit {
  insertingFixedAssetCardCategory: any = {};
  fixedAssetCategories: FixedAssetCardCategory[] = [];
  fixedAssetCardCategory: FixedAssetCardCategory = new FixedAssetCardCategory();

  public dataTable: TreeGridTable = new TreeGridTable(
    [
      {
        columnDisplayName: "İsim",
        columnName: "Name",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Açıklama",
        columnName: "Description",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      Name: "",
      Description: ""
    },
    {
      isDesc: false,
      column: "Name"
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetCardCategory();
  }

  ngOnInit() {}

  loadFixedAssetCardCategory() {
    this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
      (faccs: FixedAssetCardCategory[]) => {
        debugger;
        this.fixedAssetCategories = faccs;
        this.dataTable.TGT_loadData(this.fixedAssetCategories);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  ResetForm(form?: NgForm) {
    if (form != null) this.ResetForm();
    this.fixedAssetCardCategory = new FixedAssetCardCategory();
  }

  OnSubmit(data: NgForm) {
    if (data.value.CompanyId == null) this.insertFixedAssetCardCategory(data);
    else this.updateFixedAssetCardCategory(data);
  }

  insertFixedAssetCardCategory(data: NgForm) {
      if (data.form.invalid == true)
      return;
    this.fixedAssetCardCategory = <FixedAssetCardCategory>data.value;
    this.baseService.fixedAssetCardCategoryService.InsertFixedAssetCardCategory(
      this.fixedAssetCardCategory,
      (data: FixedAssetCardCategory, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.companies.push(data);
        this.dataTable.TGT_loadData(this.fixedAssetCardCategory);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  updateFixedAssetCardCategory(data: NgForm) {
    debugger;
    this.fixedAssetCardCategory = <FixedAssetCardCategory>data.value;
    this.baseService.popupService.ShowQuestionPopupForUpdate(response => {
      if (response == true) {
        this.baseService.fixedAssetCardCategoryService.UpdateFixedAssetCategory(
          this.fixedAssetCardCategory,
          (error: HttpErrorResponse) => {
            this.baseService.popupService.ShowErrorPopup(error);
          }
        );
      }
    });
  }

  loadDropdownList() {
    this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
      fixedAssetCardCategory =>
        (this.fixedAssetCardCategory = fixedAssetCardCategory), 
        (error) =>console.error(error)
    );
  }

  onDoubleClickItem(item: any) {
    this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategoryById(result => {
      this.fixedAssetCardCategory = result;
    }, item.FixedAssetCardCategoryId);
    $("#btnAddCompany").trigger("click");
    $("#btnInsertOrUpdateCompany").html("Güncelle");
  }
}
