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
import { FixedAssetService } from "../../../services/FixedAssetService/fixedAsset.service";
import { FixedAsset } from "../../../models/FixedAsset";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCategory } from '../../../models/FixedAssetCategory';

@Component({
  selector: 'app-fixed-asset',
  templateUrl: './fixed-asset.component.html',
  styleUrls: ['./fixed-asset.component.css']
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [FixedAssetComponent],
  providers: [FixedAssetComponent]
})
export class FixedAssetComponent extends BaseComponent implements OnInit {

  constructor(public baseService: BaseService) { 
    super(baseService);
    // this.LoadDropdownList();
  }
  insertingFixedAsset: any = {};
  fixedAssets: FixedAsset[] = [];  
  fixedAssetCategoryInAdd: FixedAssetCategory[] = [];
  fixedAssetCategory: FixedAssetCategory[] = [];

  ngOnInit() {}

  InsertFixedAsset(data: NgForm) {
    console.log(data.value);
    this.insertingFixedAsset = <FixedAsset>data.value;
    this.baseService.fixedAssetService.InsertFixedAsset(
      this.insertingFixedAsset
    );
  }

  LoadDropdownList() {
    this.baseService.fixedAssetCategoryService.GetFixedAssetCategories(fixedAssetCategories => {
      this.fixedAssetCategory = fixedAssetCategories;
    });
  }
}
