import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { FixedAssetCardBrand } from "../../../models/FixedAssetCardBrand";
import { BaseService } from "../../../services/base.service";
import { TreeGridTable } from "src/app/extends/TreeGridTable";
import { HttpErrorResponse } from "@angular/common/http";
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-fixed-asset-card-brand',
  templateUrl: './fixed-asset-card-brand.component.html',
  styleUrls: ['./fixed-asset-card-brand.component.css']
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [FixedAssetCardBrandComponent],
  providers: [FixedAssetCardBrandComponent]
})

export class FixedAssetCardBrandComponent extends BaseComponent implements OnInit, DoCheck {

  insertingfixedAssetCardBrands: any = {};
  fixedAssetCardBrands: FixedAssetCardBrand[] = [];

  public dataTable: TreeGridTable = new TreeGridTable(
    [
      {
        columnDisplayName: 'İsim',
        columnName: 'Name',
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
      Description: ''
    },
    {
      isDesc: false,
      column: 'Name'
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);

    this.loadFixedAssetCardBrands();

  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    this.dataTable.TGT_doFilter();
  }

  insertFixedAssetCardBrand(data: NgForm) {
    this.insertingfixedAssetCardBrands = <FixedAssetCardBrand>data.value;
    this.baseService.fixedAssetCardBrandService.InsertFixedAssetCardBrand(
      this.insertingfixedAssetCardBrands
    );
  }

  loadFixedAssetCardBrands() {
    this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands((facbs: FixedAssetCardBrand[]) => {

      this.fixedAssetCardBrands = facbs;
      this.dataTable.TGT_loadData(this.fixedAssetCardBrands);

    }, (error: HttpErrorResponse) => {
      this.errorManager(error);
    });
  }
}
