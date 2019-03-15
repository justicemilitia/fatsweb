import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "src/app/services/base.service";
import { User } from "src/app/models/LoginUser";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { FixedAsset } from "src/app/models/FixedAsset";
import { FixedAssetCardProperty } from "src/app/models/FixedAssetCardProperty";

@Component({
  selector: "app-fixed-asset",
  templateUrl: "./fixed-asset.component.html",
  styleUrls: ["./fixed-asset.component.css"]
})
export class FixedAssetComponent extends BaseComponent implements OnInit {
  fixedAssets: FixedAsset[] = [];
  faProperties: FixedAssetCardProperty[] = [];
  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedasset",
    [
      {
        columnDisplayName: "Barkod",
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Adı",
        columnName: ["FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Kategorisi",
        columnName: ["FixedAssetCardCategory", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Seri No",
        columnName: ["SerialNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Marka",
        columnName: ["FixedAssetCardBrand", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Model",
        columnName: ["FixedAssetCardModel", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü",
        columnName: ["FixedAssetStatus", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Fiyat",
        columnName: ["Price"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );
  constructor(baseService: BaseService) {
    super(baseService);
    this.loadFixedAsset();
    this.loadFixedAssetProperties();
  }

  ngOnInit() {}
  Page: string = "1";
  PerPage: string = "100";
  Barcode: string = "223";
  sortOrder: string = "asc";
  SerialNumber: string = "1";
  FixedAssetCardId: string = "3";
  filter: FixedAsset = new FixedAsset();

  loadFixedAsset() {
    this.baseService.fixedAssetService.GetFixedAsset(
      this.Page,
      this.PerPage,
      this.Barcode,
      this.sortOrder,
      this.SerialNumber,
      this.FixedAssetCardId,
      this.filter,
      (fa: FixedAsset[]) => {
        this.fixedAssets = fa;
        this.fixedAssets.forEach(e => {
          let fa: FixedAsset = new FixedAsset();
          Object.assign(fa, e);
          this.fixedAssets.push(fa);
        });

        this.faProperties.forEach(e => {
          this.dataTable.dataColumns.push({
            columnName: ["FixedAssetCard", "FixedAssetCardProperty"],
            columnDisplayName: e.Name,
            isActive: true,
            type: "text"
          });
        });
        this.dataTable.TGT_loadData(this.fixedAssets);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadFixedAssetProperties() {
    this.baseService.fixedAssetService.GetFixedAssetProperties(
      (faProperties: FixedAssetCardProperty[]) => {
        this.faProperties = faProperties;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
// e.FixedAssetCard.FixedAssetCardProperty.forEach(t => {
//let faProperty: FixedAssetCardProperty = new FixedAssetCardProperty();
// Object.assign(faProperty, t);
//this.faProperties.push(faProperty);
// console.log(this.faProperties);
//});
