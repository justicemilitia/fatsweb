import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardCategory } from "../../../models/FixedAssetCardCategory";
import { TreeGridTable } from '../../../extends/TreeGridTable';
import { IData } from '../../../models/interfaces/IData';
import { HttpErrorResponse } from '@angular/common/http';

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
implements OnInit, DoCheck {
  insertingFixedAssetCardCategory: any = {};
  fixedAssetCategoriesInAdd: FixedAssetCardCategory[] = [];
  fixedAssetCategories: FixedAssetCardCategory[] = [];

  filter: any = {
    Name: "",
    Description: ""
  };

  order: any = {
    isDesc: false,
    column: "Name"
  };

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetCardCategory();
  }

  ngOnInit() {}

  ngDoCheck(): void {
    this.doFilter();
  }

  //#region Grid Methods
  
  doFilter() {
    //this.TGT_doFilter(this.fixedAssetCategories, this.filter);
  }

  doOrder(column: string) {
    this.order.isDesc = !this.order.isDesc;
    this.order.column = column;
    //this.TGT_doOrder(this.fixedAssetCategories, this.filter, this.order);
  }

  doCollapse(data: IData) {
    data.isExtended = !data.isExtended;
    //this.TGT_loadData(this.fixedAssetCategories);
  }

  //#endregion


  InsertFixedAssetCardCategory(data: NgForm) {
    debugger;
    this.insertingFixedAssetCardCategory = <FixedAssetCardCategory>data.value;
    this.baseService.fixedAssetCardCategoryService.InsertFixedAssetCardCategory(
      this.insertingFixedAssetCardCategory
    );
  }

  loadDropdownList() {
    debugger;
    this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(fixedAssetCategories => {
      this.fixedAssetCategoriesInAdd = fixedAssetCategories;
    },(error: HttpErrorResponse) => {
      this.errorManager(error);
    });
  }

  loadFixedAssetCardCategory() {
    this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
      (faccs: FixedAssetCardCategory[]) => {
        //this.fixedAssetCategories = <FixedAssetCardCategory[]>this.convertDataToTree(faccs);
      //  this.TGT_loadData(this.fixedAssetCategories);
      },
      (error: HttpErrorResponse) => {
        this.errorManager(error);
      }
    );
  }
}
