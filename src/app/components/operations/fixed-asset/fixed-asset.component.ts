import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "src/app/services/base.service";
import { HttpErrorResponse, HttpHeaders, HttpClient } from "@angular/common/http";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { FixedAsset } from "src/app/models/FixedAsset";
import { FixedAssetCardProperty } from "src/app/models/FixedAssetCardProperty";
import { FixedAssetOperations } from "../../../declarations/fixed-asset-operations";
import * as $ from "jquery";
import { FixedAssetPropertyDetails } from 'src/app/models/FixedAssetPropertyDetails';
import {IMAGE_URL} from "src/app/declarations/service-values";
import { AuthenticationService } from 'src/app/services/authenticationService/authentication.service';
import { ResponseContentType } from '@angular/http';


@Component({
  selector: "app-fixed-asset",
  templateUrl: "./fixed-asset.component.html",
  styleUrls: ["./fixed-asset.component.css"]
})

export class FixedAssetComponent extends BaseComponent implements OnInit {
  

  isWaitingValidBarcode: boolean = false;

  barcode: number;

  isWaitingInsertOrUpdate: boolean = false;

  isTableRefreshing: boolean = false;

  isTableExporting: boolean = false;

  fixedAssets: FixedAsset[] = [];

  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();
  faPropertyDetails: FixedAssetPropertyDetails[] = [];
  fixedAssetPropertyDetails:FixedAssetPropertyDetails[]=[];

  fixedAsset: FixedAsset = new FixedAsset();

  filter: FixedAsset = new FixedAsset();

  faProperties: FixedAssetCardProperty[] = [];

  fixedAssetIds: number[] = [];
  fixedAssetBarcodes: string;
  fixedAssetName: string;

  selectedItems: FixedAsset[];
  users = [];

  fixedAssetInfo=new FixedAsset();

  category:string;
  status:string;
  fixedAssetBrand:string;
  fixedAssetModel:string;
  department:string;
  fixedassetcard:string;
  location:string;

  path:string;

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
        columnName: ["FixedAssetCard","FixedAssetCardCategory","Name"],
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
        columnName: ["FixedAssetCardModel","FixedAssetCardBrand", "Name"],
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
        columnName: ["Status", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü Kodu",
        columnName: ["Status", "FixedAssetStatuCode"],
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
      },
      {
        columnDisplayName: "Personel",
        columnName: ["|FixedAssetUsers"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if(value){
            return value.FixedAssetUsers.length>0 ? value.FixedAssetUsers[0].User.FirstName + ' ' + value.FixedAssetUsers[0].User.LastName : '';
          }
          else{ 
            return '';
          }
          }
        
      },   
      {
        columnDisplayName: "Lokasyon Adı",
        columnName: ["Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Kodu",
        columnName: ["Location", "LocationCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Barkodu",
        columnName: ["Location", "Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Koordinatı",
        columnName: ["Location", "Coordinate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Adresi",
        columnName: ["Location", "Address"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Açıklaması",
        columnName: ["Location", "Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Makbuz Tarihi",
        columnName: ["ReceiptDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.ReceiptDate ? value.ReceiptDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Fatura No",
        columnName: ["InvoiceNo"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Fatura Tarihi",
        columnName: ["InvoiceDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.InvoiceDate ? value.InvoiceDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Amortisman hesaplanacak mı ?",
        columnName: ["WillDepreciationBeCalculated"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      // {    NESNE DÖNÜLECEK
      //   columnDisplayName: "Amortisman Yöntemi",
      //   columnName: ["DepreciationCalculationType","Name"],
      //   isActive: true,
      //   classes: [],
      //   placeholder: "",
      //   type: "text"
      // },
      {
        columnDisplayName: "Amortisman Periyodu",
        columnName: ["DepreciationPeriod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Ifrs Fiyatı",
        columnName: ["Ifrsprice"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Ifrs hesaplanacak mı ?",
        columnName: ["WillIfrsbeCalculated"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Ifrs Periyodu",
        columnName: ["Ifrsperiod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Enflasyon İndekslemesi",
        columnName: ["HasInflationIndexation"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Garanti Başlangıç Tarihi",
        columnName: ["GuaranteeStartDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.GuaranteeStartDate ? value.GuaranteeStartDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Garanti Bitiş Tarihi",
        columnName: ["GuaranteeEndDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.GuaranteeEndDate ? value.GuaranteeEndDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Aktivasyon Tarihi",
        columnName: ["ActivationDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.ActivationDate ? value.ActivationDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Departman Kodu",
        columnName: ["Department", "DepartmentCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Departman Adı",
        columnName: ["Department", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Departman Açıklama",
        columnName: ["Department", "Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Masraf Yeri",
        columnName: ["ExpenseCenter", "Name"],
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

  public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
    "fixedassetpropertyvalue",[
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
    "fixedassetpropertyvalue",[
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

  imageToShow: any;
  page:number;

  constructor(protected baseService: BaseService,   
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
    super(baseService);
    this.loadFixedAsset();
    this.loadFixedAssetProperties();

    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isFilterActive=false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTableFixedAssetFile.isPagingActive = false;
    this.dataTableFixedAssetFile.isColumnOffsetActive = false;
    this.dataTableFixedAssetFile.isTableEditable = true;
    this.dataTableFixedAssetFile.isMultipleSelectedActive = false;
    this.dataTableFixedAssetFile.isLoading = false;
    this.dataTableFixedAssetFile.isFilterActive=false;

    
  }

  ngOnInit() {}

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadFixedAsset();

    this.isTableRefreshing = false;
  }

  loadFixedAsset() {

    // let page:number=this.dataTable.perInPage;
    // let currentPage:number=this.dataTable.currentPage;
    //page,currentPage,
    this.baseService.fixedAssetService.GetFixedAsset(
      (fa: FixedAsset[]) => {
        this.fixedAssets = fa;
        fa.forEach(e => {
          e.FixedAssetPropertyDetails.forEach(p => {
            if (p.FixedAssetCardPropertyId) {
              e["PROP_" + p.FixedAssetCardPropertyId.toString()] = p.Value;
            }
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
        this.faProperties.forEach(e => {
          this.dataTable.dataColumns.push({
            columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
            columnDisplayName: e.Name,
            isActive: true,
            type: "text"
          });
        });
        this.dataTable.TGT_bindActiveColumns();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }


  public selectedIds() {
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz"
      );
      return;
    }

    let itemIds: number[] = selectedItems.map(x => x.getId());
    this.fixedAssetIds = itemIds;
    return this.fixedAssetIds;
  }

  public selectedBarcodes() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();
    let fixedAssetBarcodes = "";
    selectedItems.forEach((e, i) => {
      fixedAssetBarcodes +=
        e.Barcode + (i == selectedItems.length - 1 ? "" : ", ");
    });

    return fixedAssetBarcodes;
  }

  public selectedFixedAssetName() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();
    let fixedAssetName = "";
    selectedItems.forEach((e, i) => {
      fixedAssetName +=
        e.FixedAssetCard.Name + (i == selectedItems.length - 1 ? "" : ", ");
    });

    return fixedAssetName;
  }
  currentOperation: FixedAssetOperations = null;
  public doOperation(operationType: FixedAssetOperations) {
    this.currentOperation = operationType;
    switch (operationType) {
      case FixedAssetOperations.changeBarcodes:
        this.ChangeBarcodeOperation();
        break;

      case FixedAssetOperations.changeLocation:
        this.ChangeLocationOperation();
        break;

      case FixedAssetOperations.changeDepartment:
        this.ChangeDepartmentOperation();
        break;

      case FixedAssetOperations.changeFirm:
        this.ChangeFirmOperation();
        break;

      case FixedAssetOperations.changeDebit:
        this.ChangeDebitOperation();
        break;

      case FixedAssetOperations.deleteDebit:
        this.DeleteDebitOperation();
        break;

      case FixedAssetOperations.exitFixedAsset:
        this.ExitFixedAssetOperation();
        break;

      case FixedAssetOperations.changeCollectiveParameter:
        this.ChangeCollectiveParameterOperation();
        break;

      case FixedAssetOperations.createFixedAsset:
        this.CreateFixedAssetOperation();
        break;

      case FixedAssetOperations.suspendFixedAsset:
        this.SuspendFixedAssetOperation();
        break;

      case FixedAssetOperations.lostFixedAsset:
        this.LostFixedAssetOperation();
        break;

      case FixedAssetOperations.changeRelationship:
      this.FixedAssetRelationshipOperation();
      break;

      case FixedAssetOperations.filter:
      this.FilterOperation();
      break;
    }
  }

  //#region Change Barcode Operation
  changeBarcode_selectedItem: FixedAsset = new FixedAsset();
  ChangeBarcodeOperation() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (selectedItems.length > 1) {
      this.baseService.popupService.ShowAlertPopup(
        "Birden fazla demirbaş seçtiniz.!"
      );
      return;
    }

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      return;
    }

    this.changeBarcode_selectedItem = selectedItems[0];

    $("#showModal").trigger("click");
  }
  //#endregion

  //#region Change Location Operation
  changeLocation_selectedItem: FixedAsset = new FixedAsset();
  ChangeLocationOperation() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (selectedItems.length > 1) {
      this.baseService.popupService.ShowAlertPopup(
        "Birden fazla demirbaş seçtiniz.!"
      );
      return;
    }

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      return;
    }

    this.changeLocation_selectedItem = selectedItems[0];

    $("#showModal").trigger("click");
  }
  //#endregion

  //#region Change Department Operation
  changeDepartment_selectedItem: FixedAsset = new FixedAsset();
  ChangeDepartmentOperation() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (selectedItems.length > 1) {
      this.baseService.popupService.ShowAlertPopup(
        "Birden fazla demirbaş seçtiniz.!"
      );
      return;
    }

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      return;
    }

    this.changeDepartment_selectedItem = selectedItems[0];

    $("#showModal").trigger("click");
  }
  //#endregion

  //#region Change Firm Operation
  changeFirm_selectedItem: FixedAsset = new FixedAsset();
  ChangeFirmOperation() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (selectedItems.length > 1) {
      this.baseService.popupService.ShowAlertPopup(
        "Birden fazla demirbaş seçtiniz.!"
      );
      return;
    }

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      return;
    }

    this.changeFirm_selectedItem = selectedItems[0];

    $("#showModal").trigger("click");
  }
  //#endregion

  //#region Change Debit Operation
  changeDebit_selectedItem: FixedAsset = new FixedAsset();
  ChangeDebitOperation() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (selectedItems.length > 1) {
      this.baseService.popupService.ShowAlertPopup(
        "Birden fazla demirbaş seçtiniz.!"
      );
      return;
    }

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      return;
    }

    this.changeDebit_selectedItem = selectedItems[0];

    $("#showModal").trigger("click");
  }
  //#endregion

  //#region Delete Debit Operation
  deleteDebit_selectedItem: FixedAsset = new FixedAsset();
  DeleteDebitOperation() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (selectedItems.length > 1) {
      this.baseService.popupService.ShowAlertPopup(
        "Birden fazla demirbaş seçtiniz.!"
      );
      return;
    }

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      return;
    }

    this.deleteDebit_selectedItem = selectedItems[0];

    $("#showModal").trigger("click");
  }
  //#endregion

  //#region ExitFixedAssetOperation
  exit_selectedBarcodes: string;
  ExitFixedAssetOperation() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      return;
    }

    this.exit_selectedBarcodes = this.selectedBarcodes();

    $("#showModal").trigger("click");
  }
  //#endregion

  //#region FixedAssetRelationshipOperation
  relationship_selectedItem: string;
  FixedAssetRelationshipOperation() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      return;
    }

    this.relationship_selectedItem = this.selectedBarcodes();

    $("#showModal").trigger("click");
  }
  //#endregion

  //#region Change Collective Parameter
  changeCollectiveParameter_selectedBarcodes: string;
  ChangeCollectiveParameterOperation() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      return;
    }

    this.changeCollectiveParameter_selectedBarcodes = this.selectedBarcodes();

    $("#showModal").trigger("click");
  }
  //#endregion

  //#region Suspend Fixed Asset
  suspend_selectedBarcodes: string;
  SuspendFixedAssetOperation() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      return;
    }

    this.suspend_selectedBarcodes = this.selectedBarcodes();

    $("#showModal").trigger("click");
  }

  //#endregion

  //#region Lost Fixed Asset
  lost_selectedBarcodes: FixedAsset[];
  LostFixedAssetOperation() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      return;
    }

    this.lost_selectedBarcodes = selectedItems;

    $("#showModal").trigger("click");
  }

  //#endregion

 //#region Change Collective Parameter
 FilterOperation() {
   $("#showModal").trigger("click");
 }
 //#endregion

  //#region Create Fixed Asset Operation
  CreateFixedAssetOperation() {  
    $("#showModal").trigger("click");
  }
  //#endregion


  onDoubleClickItem(item: FixedAsset) {

    this.fixedAsset=new FixedAsset();

    this.baseService.spinner.show();

    this.baseService.fixedAssetService.GetFixedAssetById(item.FixedAssetId,
      (result:FixedAsset)=>{
      
      this.baseService.spinner.hide();
      Object.assign(this.fixedAssetInfo,result);
      
      this.status=result.Status.Name == null ? " " : result.Status.Name;    

      if(result.FixedAssetCard !=null)
      this.fixedassetcard = result.FixedAssetCard.Name;
      if(result.FixedAssetCard.FixedAssetCardCategory != null)
      this.category=result.FixedAssetCard.FixedAssetCardCategory.Name;
      if(result.FixedAssetCardModel != null){
      this.fixedAssetBrand=result.FixedAssetCardModel.FixedAssetCardBrand.Name;
      this.fixedAssetModel=result.FixedAssetCardModel.Name;
      }
      if(result.Department !=null)
      this.department=result.Department.Name;

      if(result.FixedAssetPropertyDetails.length > 0){
        this.fixedAssetInfo.FixedAssetPropertyDetails.forEach(e => {
          let fixedAssetPropertyDetail:FixedAssetPropertyDetails=new FixedAssetPropertyDetails();
            fixedAssetPropertyDetail.FixedAssetPropertyDetailId = (this.faPropertyDetails.length + 1) * -1;
            fixedAssetPropertyDetail.Value=e.Value;  
            fixedAssetPropertyDetail.FixedAssetCardProperty=e.FixedAssetCardProperty;
            
            this.fixedAssetPropertyDetails.push(fixedAssetPropertyDetail);
        });

        this.dataTablePropertyValue.TGT_loadData(this.fixedAssetPropertyDetails);
      }
      
      if(result.Picture !=null){
      this.path= IMAGE_URL + result.Picture.replace("ThumbImages/thumb_","");
      this.fixedAssetInfo.Picture = this.path;
      }
      
      $("#btnFixedAssetInfo").trigger("click");
      
    },(error:HttpErrorResponse)=>{
         /* hide spinner */
        this.baseService.spinner.hide();

        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  downloadDebitForm(){

    

    }

  }

