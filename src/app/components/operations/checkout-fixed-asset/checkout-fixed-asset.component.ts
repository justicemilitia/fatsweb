import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { BaseService } from 'src/app/services/base.service';
import { FixedAsset } from 'src/app/models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-checkout-fixed-asset',
  templateUrl: './checkout-fixed-asset.component.html',
  styleUrls: ['./checkout-fixed-asset.component.css']
})
export class CheckoutFixedAssetComponent extends BaseComponent implements OnInit {

  exitFixedAssetList: FixedAsset[] = [];

  isTableRefreshing: boolean = false;

  isTableExporting: boolean = false;

  public dataTable: TreeGridTable = new TreeGridTable(
    "exitfixedasset",
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
        columnDisplayName: "Departman",
        columnName: ["Department", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon",
        columnName: ["Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Çıkış Tipi",
        columnName: ["CheckOutReasonName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Çıkış Tarihi",
        columnName: ["TransactionDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value ? value.TransactionDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      }
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadExitList();
    this.dataTable.isMultipleSelectedActive = false;
  }

  ngOnInit() {
  }


  loadExitList() {
    this.baseService.fixedAssetService.GetExitFixedAssetList(
      (exitFixedAsset: FixedAsset[]) => {
        this.exitFixedAssetList = exitFixedAsset;
        this.dataTable.TGT_loadData(this.exitFixedAssetList);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadExitList();

    this.isTableRefreshing = false;
  }

}
