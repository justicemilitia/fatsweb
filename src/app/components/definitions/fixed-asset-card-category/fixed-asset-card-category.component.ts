import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardCategory } from "../../../models/FixedAssetCardCategory";
import { HttpErrorResponse } from "@angular/common/http";
import { IData } from "src/app/extends/TreeGridTable/models/interfaces/IData";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";

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

  InsertFixedAssetCardCategory(data: NgForm) {
    debugger;
    this.insertingFixedAssetCardCategory = <FixedAssetCardCategory>data.value;
    this.baseService.fixedAssetCardCategoryService.InsertFixedAssetCardCategory(
      this.insertingFixedAssetCardCategory
    );
  }

  // loadDropdownList() {
  //   debugger;
  //   this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
  //     faccfixedAssetCategories => {
  //       this.fixedAssetCategoriesInAdd = fixedAssetCategories;
  //     },
  //     (error: HttpErrorResponse) => {
  //       this.errorManager(error);
  //     }
  //   );
  // }

  loadFixedAssetCardCategory() {
    this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
      (faccs: FixedAssetCardCategory[]) => {
        this.fixedAssetCategories = faccs;
        this.dataTable.TGT_loadData(this.fixedAssetCategories);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
  onDoubleClickItem(item: any) {
    console.log(item);
  }
}
