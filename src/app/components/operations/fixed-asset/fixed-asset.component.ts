import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "src/app/services/base.service";
import { User } from "src/app/models/LoginUser";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { FixedAsset } from 'src/app/models/FixedAsset';

@Component({
  selector: "app-fixed-asset",
  templateUrl: "./fixed-asset.component.html",
  styleUrls: ["./fixed-asset.component.css"]
})
export class FixedAssetComponent extends BaseComponent implements OnInit {
  
  fixedAssets:FixedAsset[]=[];
  constructor(baseService: BaseService) {
    super(baseService);
    this.loadFixedAsset();
  }

  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedasset",
    [
      {
        columnDisplayName: "Barkod",
        columnName: [],
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
        columnName: ["FixedAssetCardBrand","Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Model",
        columnName: ["FixedAssetCardModel","Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü",
        columnName: ["FixedAssetStatus","Name"],
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
      column: ["Role", "Name"]
    }
  );

  ngOnInit() {}

  loadFixedAsset() {
    this.baseService.fixedAssetService.GetFixedAsset((fixedasset:FixedAsset[])=>{
      this.fixedAssets=fixedasset;
      this.dataTable.TGT_loadData(this.fixedAssets);
    },(error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    })
  }
}
