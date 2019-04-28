import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { BaseService } from 'src/app/services/base.service';
import { FixedAsset } from 'src/app/models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';
import { FixedAssetPropertyDetails } from 'src/app/models/FixedAssetPropertyDetails';
import { IMAGE_URL, GET_FIXEDASSET_BY_ID, DOCUMENT_URL } from "src/app/declarations/service-values";


@Component({
  selector: 'app-checkout-fixed-asset',
  templateUrl: './checkout-fixed-asset.component.html',
  styleUrls: ['./checkout-fixed-asset.component.css']
})
export class CheckoutFixedAssetComponent extends BaseComponent implements OnInit {

  exitFixedAssetList: FixedAsset[] = [];
  fixedAsset: FixedAsset = new FixedAsset();

  isTableRefreshing: boolean = false;

  isTableExporting: boolean = false;

  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();

  fixedAssetInfo: FixedAsset = new FixedAsset();

  faPropertyDetails: FixedAssetPropertyDetails[] = [];
  
  fixedAssetPropertyDetails: FixedAssetPropertyDetails[] = [];

  category: string;
  status: string;
  fixedAssetBrand: string;
  fixedAssetModel: string;
  department: string;
  fixedassetcard: string;
  location: string;
  user: string;
  debitUser: string[] = [];

  path: string;
  imagePath:string;

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
          return value.TransactionDate ? value.TransactionDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      }
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );

  
  public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
    "fixedassetpropertyvalue", [
      {
        columnDisplayName: "Özellik Adı",
        columnName: ["FixedAssetCardProperty", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Özellik Değeri",
        columnName: ["Value"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["FixedAssetCardProperty", "Name"]
    }
  )

  public dataTableFixedAssetFile: TreeGridTable = new TreeGridTable(
    "fixedassetfile", [
      {
        columnDisplayName: "Dosya Adı",
        columnName: [],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: []
    }
  )

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
        if(this.exitFixedAssetList.length==0){
          this.baseService.popupService.ShowWarningPopup("Record_not_found");
        }
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  onDoubleClickItem(item: FixedAsset) {

    this.dataTablePropertyValue.TGT_clearData();

    this.fixedAssetPropertyDetails = [];


    this.baseService.spinner.show();

    this.baseService.fixedAssetService.GetFixedAssetById(item.FixedAssetId,
      (result: FixedAsset) => {
        
        $("#btnFixedAssetInfo").trigger("click");
        
        Object.assign(this.fixedAssetInfo, result);

        this.status = result.Status.Name == null ? " " : result.Status.Name;

        if (result.FixedAssetCard != null)
          this.fixedassetcard = result.FixedAssetCard.Name;
        if (result.FixedAssetCard.FixedAssetCardCategory != null)
          this.category = result.FixedAssetCard.FixedAssetCardCategory.Name;
        if (result.FixedAssetCardModel != null) {
          this.fixedAssetBrand = result.FixedAssetCardModel.FixedAssetCardBrand.Name;
          this.fixedAssetModel = result.FixedAssetCardModel.Name;
        }
        if (result.Department != null)
          this.department = result.Department.Name;

        if (result.FixedAssetPropertyDetails.length > 0) {
            this.fixedAssetInfo.FixedAssetPropertyDetails.forEach(e => {

            let fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();

            fixedAssetPropertyDetail.Value = e.Value;
            fixedAssetPropertyDetail.FixedAssetCardProperty = e.FixedAssetCardProperty;
            fixedAssetPropertyDetail.FixedAssetPropertyDetailId=e.FixedAssetPropertyDetailId;

            this.fixedAssetPropertyDetails.push(fixedAssetPropertyDetail);
          });

            this.dataTablePropertyValue.TGT_loadData(this.fixedAssetPropertyDetails);
        }

        if (result.FixedAssetUsers != null) {
          this.fixedAssetInfo.FixedAssetUsers.forEach(e => {
            this.user = e.User.FirstName + " " + e.User.LastName;
          });
        }

        if (result.Picture != null) {
          this.path = IMAGE_URL + result.Picture.replace("ThumbImages/thumb_", "");
          this.imagePath=this.path;
          this.fixedAssetInfo.Picture = this.path;
        }

        this.baseService.spinner.hide();

      }, 
      (error: HttpErrorResponse) => {
        /* hide spinner */
        this.baseService.spinner.hide();

        /* show error message */
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
