import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { BaseService } from 'src/app/services/base.service';
import { FixedAsset } from 'src/app/models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';
import { FixedAssetPropertyDetails } from 'src/app/models/FixedAssetPropertyDetails';
import { IMAGE_URL, GET_FIXEDASSET_BY_ID, DOCUMENT_URL } from "src/app/declarations/service-values";
import { FixedAssetFile } from 'src/app/models/FixedAssetFile';


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

  fixedAssetFiles:FixedAssetFile[]=[];

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
        columnDisplayName: this.getLanguageValue('Barcode'),
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Name'),
        columnName: ["FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Department'),
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
        columnDisplayName: this.getLanguageValue('Exit_Type'),
        columnName: ["CheckOutReasonName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Exit_Date'),
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
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Property_Name'),
        columnName: ["FixedAssetCardProperty", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Property_Value'),
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
        columnDisplayName: this.getLanguageValue('File_Name'),
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

    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isFilterActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isScrollActive=false;

    this.dataTableFixedAssetFile.isPagingActive = false;
    this.dataTableFixedAssetFile.isColumnOffsetActive = false;
    this.dataTableFixedAssetFile.isTableEditable = true;
    this.dataTableFixedAssetFile.isMultipleSelectedActive = false;
    this.dataTableFixedAssetFile.isLoading = false;
    this.dataTableFixedAssetFile.isFilterActive = false;
    this.dataTableFixedAssetFile.isScrollActive=false;
  }

  ngOnInit() {
  }


  loadExitList() {
    this.baseService.fixedAssetService.GetExitFixedAssetList(
      (exitFixedAsset: FixedAsset[]) => {
        this.exitFixedAssetList = exitFixedAsset;
        this.dataTable.TGT_loadData(this.exitFixedAssetList);
        if(this.exitFixedAssetList.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
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

        if(result.FixedAssetFiles.length > 0){
          this.fixedAssetInfo.FixedAssetFiles.forEach(e=>{
            let faFiles:FixedAssetFile = new FixedAssetFile();
            faFiles.FileName=e.FileName;
            faFiles.FixedAssetFileId=e.FixedAssetFileId; 

            this.fixedAssetFiles.push(faFiles);
          });
          this.dataTableFixedAssetFile.TGT_loadData(this.fixedAssetFiles);
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

  resetForm() {
  
    this.fixedAssetInfo.FixedAssetPropertyDetails = [];

    this.dataTablePropertyValue.TGT_clearData();

  }

  async downloadForm(){
      let formList: string[]=[];
      let selectedItems: FixedAsset[]=[];

      selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

      selectedItems.forEach(e=> {
        for(let i=0; i<e.FixedAssetForms.length; i++){
        if(e.FixedAssetForms[i].FixedAssetFormTypeId==6){
        formList.push(e.FixedAssetForms[i].FixedAssetFormCode);
      }
    }
      });
    
      for(let i=0;i<formList.length;i++){
        this.PressExitForm(formList[i]);
      }
  }

  PressExitForm(formName: string){
    let url:string;
    url=DOCUMENT_URL + formName + ".pdf";
    // this.router.navigate([url]); 
    window.open(url,"_blank");    
  }
}
