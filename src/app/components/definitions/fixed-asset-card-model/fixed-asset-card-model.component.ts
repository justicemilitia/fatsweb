import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { FixedAssetCardBrand } from "../../../models/FixedAssetCardBrand";
import { FixedAssetCardModel } from "../../../models/FixedAssetCardModel";
import { BaseService } from "../../../services/base.service";
import { TreeGridTable } from "src/app/extends/TreeGridTable";
import { HttpErrorResponse } from "@angular/common/http";
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-fixed-asset-card-model',
  templateUrl: './fixed-asset-card-model.component.html',
  styleUrls: ['./fixed-asset-card-model.component.css']
})

@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [FixedAssetCardModelComponent],
  providers: [FixedAssetCardModelComponent]
})
export class FixedAssetCardModelComponent extends BaseComponent implements OnInit, DoCheck {

  insertingfixedAssetCardModels: any = {};
  fixedAssetCardModels: FixedAssetCardModel[] = [];
  fixedAssetCardBrands: FixedAssetCardBrand[] = [];

  public dataTable: TreeGridTable = new TreeGridTable(
    [
      {
        columnDisplayName: 'İsim',
        columnName: 'Name',
        isActive: true
      },
      {
        columnDisplayName: 'Marka',
        columnName: 'FixedAssetCardBrand',
        isActive: true
      },
      {
        columnDisplayName: 'Açıklama',
        columnName: 'Description',
        isActive: true
      }
    ],
    {
      Name: '',
      FixedAssetCardBrand: '',
      Description: ''
    },
    {
      isDesc: false,
      column: 'Name'
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetCardModels();
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    this.dataTable.TGT_doFilter();
  }
 insertFixedAssetCardModel(data: NgForm) {
    this.insertingfixedAssetCardModels = <FixedAssetCardModel>data.value;
    this.baseService.fixedAssetCardModelService.InsertFixedAssetCardModel(
      this.insertingfixedAssetCardModels
    );
  }

  loadFixedAssetCardModels() {
    this.baseService.fixedAssetCardModelService.GetFixedAssetCardModels((facms: FixedAssetCardModel[]) => {
      this.fixedAssetCardModels = facms;
      this.dataTable.TGT_loadData(this.fixedAssetCardModels);

    }, (error: HttpErrorResponse) => {
      this.errorManager(error);
    });
  }
  loadDropdownList() {
    debugger;
    this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands((facbs: FixedAssetCardBrand[]) => {

      this.fixedAssetCardBrands = facbs;
      this.dataTable.TGT_loadData(this.fixedAssetCardBrands);

    }, (error: HttpErrorResponse) => {
      this.errorManager(error);
    });
  }
}
