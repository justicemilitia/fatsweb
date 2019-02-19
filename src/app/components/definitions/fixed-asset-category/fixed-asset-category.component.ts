import { Component, OnInit, NgModule } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  NgForm
} from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCategory } from "../../../models/FixedAssetCategory";

@Component({
  selector: "app-fixed-asset-category",
  templateUrl: "./fixed-asset-category.component.html",
  styleUrls: ["./fixed-asset-category.component.css"]
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [FixedAssetCategoryComponent],
  providers: [FixedAssetCategoryComponent]
})
export class FixedAssetCategoryComponent extends BaseComponent
  implements OnInit {
  constructor(public baseService: BaseService) {
    super(baseService);
    this.LoadDropdownList();
  }

  insertingFixedAssetCategory: any = {};
  fixedAssetCategoriesInAdd: FixedAssetCategory[] = [];
  fixedAssetCategories: FixedAssetCategory[] = [];

  ngOnInit() {}

  InsertFixedAssetCategories(data: NgForm) {
    console.log(data.value);
    this.insertingFixedAssetCategory = <FixedAssetCategory>data.value;
    this.baseService.fixedAssetCategoryService.InsertFixedAssetCategory(
      this.insertingFixedAssetCategory
    );
  }

  LoadDropdownList() {
    debugger;
    this.baseService.fixedAssetCategoryService.GetFixedAssetCategories(fixedAssetCategories => {
      this.fixedAssetCategoriesInAdd = fixedAssetCategories;
    });
  }

  LoadFixedAssetCategory() {
    this.baseService.fixedAssetCategoryService.GetFixedAssetCategories((facs: FixedAssetCategory[]) => {
      facs.forEach(e => {
        let nwFacs: FixedAssetCategory[] = this.SubToUp(e, 0);
        nwFacs.forEach(x => {
          this.fixedAssetCategories.push(x);
        });
      });
    });
  }

  SubToUp(fixedAssetCategories: FixedAssetCategory, index: number): FixedAssetCategory[] {
    let nwFAC: FixedAssetCategory[] = [];
    fixedAssetCategories.Name = fixedAssetCategories.Name.padStart(
      fixedAssetCategories.Name.length + index,
      ">"
    );
    nwFAC.push(fixedAssetCategories);
    if (
      fixedAssetCategories.InverseParentCategory &&
      fixedAssetCategories.InverseParentCategory.length > 0
    ) {
      fixedAssetCategories.InverseParentCategory.forEach(e => {
        this.SubToUp(e, index + 5).forEach(x => {
          nwFAC.push(x);
        });
      });
    }
    return nwFAC;
  }
}
