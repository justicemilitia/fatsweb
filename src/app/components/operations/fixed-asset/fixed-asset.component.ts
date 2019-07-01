import { Component, OnInit, OnChanges, AfterViewInit, AfterContentChecked } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "src/app/services/base.service";
import { HttpErrorResponse, HttpHeaders, HttpClient } from "@angular/common/http";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { FixedAsset } from "src/app/models/FixedAsset";
import { FixedAssetCardProperty } from "src/app/models/FixedAssetCardProperty";
import { FixedAssetOperations } from "../../../declarations/fixed-asset-operations";
import * as $ from "jquery";
import { FixedAssetPropertyDetails } from 'src/app/models/FixedAssetPropertyDetails';
import { IMAGE_URL, GET_FIXEDASSET_BY_ID, DOCUMENT_URL } from "src/app/declarations/service-values";
import { AuthenticationService } from 'src/app/services/authenticationService/authentication.service';
import { ResponseContentType } from '@angular/http';

import { Page } from 'src/app/extends/TreeGridTable/models/Page';
import { FixedAssetForm } from 'src/app/models/FixedAssetForm';
import { FixedAssetFile } from 'src/app/models/FixedAssetFile';



@Component({
  selector: "app-fixed-asset",
  templateUrl: "./fixed-asset.component.html",
  styleUrls: ["./fixed-asset.component.css"]
})

export class FixedAssetComponent extends BaseComponent implements OnInit, AfterViewInit {

  searchDescription: string = '';

  ngAfterViewInit(): void {
    this.baseService.activeRoute.queryParams.subscribe(params => {
      let search = params.search;
      if (search) {
        search = search.trimEnd();
        if (search != this.searchDescription) {
          this.searchDescription = search; // --> Name must match wanted parameter
          this.loadFixedAssetForDescription(this.perInPage, this.currentPage);
        }
      } else if (this.searchDescription) {
        this.loadFixedAsset(this.perInPage, this.currentPage);
      } else
        this.loadFixedAsset(this.perInPage, this.currentPage);
    });
  }

  isWaitingValidBarcode: boolean = false;

  barcode: number;

  isWaitingInsertOrUpdate: boolean = false;

  isTableRefreshing: boolean = false;

  isTableExporting: boolean = false;

  fixedAssets: FixedAsset[] = [];

  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();
  faPropertyDetails: FixedAssetPropertyDetails[] = [];
  fixedAssetPropertyDetails: FixedAssetPropertyDetails[] = [];
  fixedAssetFiles:FixedAssetFile[]=[];

  fixedAsset: FixedAsset = new FixedAsset();

  filter: FixedAsset = new FixedAsset();

  faProperties: FixedAssetCardProperty[] = [];

  fixedAssetIds: number[] = [];
  fixedAssetBarcodes: string;
  fixedAssetName: string;

  selectedItems: FixedAsset[];
  users = [];
  fixedAssetUsers:string;

  fixedAssetInfo = new FixedAsset();

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
  
  currentPage: number = 1;
  perInPage: number = 25;
  totalPage: number = 1;
  pages: Page[] = [];

  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedasset",
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
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Category_Name'),
        columnName: ["FixedAssetCard", "FixedAssetCardCategory", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Serial_Number'),
        columnName: ["SerialNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Brand_Name'),
        columnName: ["FixedAssetCardModel", "FixedAssetCardBrand", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Model_Name'),
        columnName: ["FixedAssetCardModel", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Statu_Name'),
        columnName: ["Status", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Statu_Code'),
        columnName: ["Status", "FixedAssetStatuCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
  
      {
        columnDisplayName:  this.getLanguageValue('Fixed_Asset_Price'),
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
          if (value) {
            return value.FixedAssetUsers.length > 0 ? value.FixedAssetUsers[0].User.FirstName + ' ' + value.FixedAssetUsers[0].User.LastName : '';
          }
          else {
            return '';
          }
        }

      },
      // {
      //   columnDisplayName: "Demirbaş Giriş Tarihi",
      //   columnName: ["CreationDate"],
      //   isActive: true,
      //   classes: [],
      //   placeholder: "",
      //   type: "text",
      //   formatter: value => {
      //     return value.CreationDate ? value.CreationDate.substring(0, 10).split("-").reverse().join("-") : "";
      //   }
      // },
      {
        columnDisplayName: this.getLanguageValue('Location_Name'),
        columnName: ["Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Supplier'),
        columnName: ["Company", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      // {
      //   columnDisplayName: "Sözleşme Adı",
      //   columnName: ["Agreement", "Name"],
      //   isActive: true,
      //   classes: [],
      //   placeholder: "",
      //   type: "text"
      // },
      {
        columnDisplayName:  this.getLanguageValue('Insurance_Company'),
        columnName: ["InsuranceCompany", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Code'),
        columnName: ["Location", "LocationCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName:  this.getLanguageValue('Location_Barcode'),
        columnName: ["Location", "Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Coordinate'),
        columnName: ["Location", "Coordinate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Address'),
        columnName: ["Location", "Address"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Description'),
        columnName: ["Location", "Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Statu_Color'),
        columnName: ["Status","Color"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "color",   
      },
      {
        columnDisplayName: this.getLanguageValue('Receipt_Date'),
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
        columnDisplayName: this.getLanguageValue('Invoice_No'),
        columnName: ["InvoiceNo"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Invoice_Date'),
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
        columnDisplayName: this.getLanguageValue('Will_Depreciation_Be_Calculated'),
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
        columnDisplayName: this.getLanguageValue('Depreciation_Period'),
        columnName: ["DepreciationPeriod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('IFRS_Price'),
        columnName: ["Ifrsprice"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Will_IFRS_Be_Calculated'),
        columnName: ["WillIfrsbeCalculated"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: this.getLanguageValue('IFRS_Period'),
        columnName: ["Ifrsperiod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Has_Inflation_Indexation'),
        columnName: ["HasInflationIndexation"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName:  this.getLanguageValue('Guarentee_Start_Date'),
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
        columnDisplayName: this.getLanguageValue('Guarentee_End_Date'),
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
        columnDisplayName:  this.getLanguageValue('Fixed_Asset_Add_Date'),
        columnName: ["CreationDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.CreationDate ? value.CreationDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Activation_Date'),
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
        columnDisplayName:  this.getLanguageValue('Department_Code'),
        columnName: ["Department", "DepartmentCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Department_Name'),
        columnName: ["Department", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Department_Description'),
        columnName: ["Department", "Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Description'),
        columnName: ["Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('File_Name'),
        columnName: ["FixedAssetFiles","FileName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.FixedAssetFiles.length > 0 ? value.FixedAssetFiles[0].FileName : '';
          }
          else {
            return '';
          }
        }
      },
      {
        columnDisplayName:  this.getLanguageValue('Fixed_Asset_Is_Active'),
        columnName: ["IsActive"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      }
      // {
      //   columnDisplayName: "Masraf Yeri",
      //   columnName: ["ExpenseCenter", "Name"],
      //   isActive: true,
      //   classes: [],
      //   placeholder: "",
      //   type: "text"
      // }
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
        columnName: ["FileName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["FileName"]
    }
  )

  imageToShow: any;
  page: number;

  constructor(protected baseService: BaseService) {

    super(baseService);
    this.loadFixedAssetProperties();

    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isFilterActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isScrollActive = false;

    this.dataTableFixedAssetFile.isPagingActive = false;
    this.dataTableFixedAssetFile.isColumnOffsetActive = false;
    this.dataTableFixedAssetFile.isTableEditable = true;
    this.dataTableFixedAssetFile.isMultipleSelectedActive = false;
    this.dataTableFixedAssetFile.isLoading = false;
    this.dataTableFixedAssetFile.isFilterActive = false;
    this.dataTableFixedAssetFile.isScrollActive = false;
    this.dataTable.isPagingActive = false;

  }

  async  TGT_calculatePages() {

    let items: Page[] = [];
    let totalPage = this.totalPage;

    /* if user in a diffrent page we will render throw the first page */
    if (this.currentPage > totalPage)
      this.currentPage = 1;
    else if (this.currentPage < 1)
      this.currentPage = 1

    /* We will always put first page in to pagination items */
    items.push({
      value: 1,
      display: '1',
      isDisabled: false,
      isActive: this.currentPage == 1 ? true : false
    });

    /* if the total page is 1 return the items no more need calculation */
    if (totalPage <= 1) {
      this.pages = items;
      return;
    }

    /* we will store the last inserted item */
    let lastInsertedItem = this.currentPage - 3;

    /* if current user far enough page we will show ... (you passed many page) */
    if (lastInsertedItem > 2) {
      items.push({
        value: 0,
        display: '...',
        isDisabled: true,
        isActive: false
      });
    }

    /* We loop all pages to add pagination items */
    for (let ii = this.currentPage - 3; ii < totalPage; ii++) {
      lastInsertedItem = ii;

      /* first pages ii may be minus so we should check ii is bigger 1 */
      if (ii > 1) {
        /* Insert pagination item */
        items.push({
          value: ii,
          display: ii.toString(),
          isDisabled: false,
          isActive: this.currentPage == ii ? true : false
        });
      }

      /* maximum item we will show is 7 */
      if (items.length > 7) {
        ii = totalPage;
        break;
      }
    }

    /* After calculation if we still far from totalpage we insert ... page item */
    if (lastInsertedItem < totalPage - 1 && lastInsertedItem > 0) {
      items.push({
        value: 0,
        display: '...',
        isDisabled: true,
        isActive: false
      });
    }

    /* We always push the last page to the pagination items */
    if (!items.find(x => x.value == totalPage)) {
      items.push({
        value: totalPage,
        display: totalPage.toString(),
        isDisabled: false,
        isActive: this.currentPage == totalPage ? true : false
      });
    }

    /* We set pages to new pagination items. */
    this.pages = items;

  }


  ngOnInit() { }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    this.perInPage = 25;
    this.currentPage = 1;

    await this.loadFixedAsset(this.perInPage, this.currentPage);

    this.isTableRefreshing = false;
  }


  async loadFixedAssetForDescription(_perInPage: number = 1000, _currentPage: number = 1) {

    this.dataTable.TGT_clearData();
    this.dataTable.isLoading = true;

    this.baseService.fixedAssetService.GetFixedAssetForDescription(_perInPage, _currentPage, this.searchDescription,
      (fa: FixedAsset[], totalPage: number, message: string) => {

        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.dataTable.perInPage = _perInPage;
        this.fixedAssets = fa;
        this.totalPage = totalPage ? totalPage : 1;

        fa.forEach(e => {
          e.FixedAssetPropertyDetails.forEach(p => {
            if (p.FixedAssetCardPropertyId) {
              e["PROP_" + p.FixedAssetCardPropertyId.toString()] = p.Value;
            }
          });
        });
        this.dataTable.TGT_loadData(this.fixedAssets);
        this.TGT_calculatePages();
      },
      (error: HttpErrorResponse) => {
        this.totalPage = 0;
        this.TGT_calculatePages();
      }
    );
  }

  async loadFixedAsset(_perInPage: number = 25, _currentPage: number = 1) {

    this.searchDescription = '';
    this.dataTable.TGT_clearData();
    this.dataTable.isLoading = true;

    this.baseService.fixedAssetService.GetFixedAsset(_perInPage, _currentPage, false,
      (fa: FixedAsset[], totalPage: number, message: string) => {

        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.dataTable.perInPage = _perInPage;
        this.fixedAssets = fa;
        this.totalPage = totalPage ? totalPage : 1;

        fa.forEach(e => {
          e.FixedAssetPropertyDetails.forEach(p => {
            if (p.FixedAssetCardPropertyId) {
              e["PROP_" + p.FixedAssetCardPropertyId.toString()] = p.Value;
            }
          });
        });
        this.dataTable.TGT_loadData(this.fixedAssets);
        this.TGT_calculatePages();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadFixedAssetProperties() {
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
        
      case FixedAssetOperations.editFile:
        this.EditFile();
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
      this.currentOperation = null;
      return;
    }

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      this.currentOperation = null;
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
      this.currentOperation = null;
      return;
    }

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      this.currentOperation = null;
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
      this.currentOperation = null;
      return;
    }

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      this.currentOperation = null;
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
      this.currentOperation = null;
      return;
    }

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      this.currentOperation = null;
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
      this.currentOperation = null;
      return;
    }

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      this.currentOperation = null;
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
      this.currentOperation = null;
      return;
    }

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      this.currentOperation = null;
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
      this.currentOperation = null;
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
      this.currentOperation = null;
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
      this.currentOperation = null;
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
      this.currentOperation = null;
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
      this.currentOperation = null;
      return;
    }

    this.lost_selectedBarcodes = selectedItems;

    $("#showModal").trigger("click");
  }

  //#endregion

  //#region Change Filter Parameter
  FilterOperation() {
    $("#showModal").trigger("click");
  }
  //#endregion

  //#region Create Fixed Asset Operation
  CreateFixedAssetOperation() {
    $("#showModal").trigger("click");
  }
  //#endregion

  //#region Edit Fixed Asset File
  editFile_selectedBarcodes: FixedAsset[];
  EditFile(){

    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz!"
      );
      this.currentOperation = null;
      return;
    }
    
    this.editFile_selectedBarcodes=selectedItems;

    $("#showModal").trigger("click");
  }
  //#endregion

  onDoubleClickItem(item: FixedAsset) {

    this.dataTablePropertyValue.TGT_clearData();

    this.fixedAssetPropertyDetails = [];

    this.fixedAsset = new FixedAsset();

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
          let fixedassetusers="";
          this.fixedAssetInfo.FixedAssetUsers.forEach((e,i) => {
            let user:string = e.User.FirstName + " " + e.User.LastName;
            fixedassetusers += user + (i == this.fixedAssetInfo.FixedAssetUsers.length - 1 ? "" : ", ");
            this.fixedAssetUsers = fixedassetusers;
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

  downloadDebitForm() {
    let fixedAssetId: number;

    let selectedItems = this.dataTable.TGT_getSelectedItems();

    if (selectedItems.length != 1) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen bir demirbaş seçiniz"
      );
      return;
    }

    let itemId: number[] = selectedItems.map(x => x.getId());
    fixedAssetId = itemId[0];
    this.baseService.fixedAssetService.GetFixedAssetDebitForms(fixedAssetId,
      (faForms: any[]) => {

        let formName: string[] = [];
        Object.assign(formName, faForms);
        let dataURL: string
        // const link = document.createElement('a');

        for (let i = 0; i < formName.length; i++) {
          dataURL = DOCUMENT_URL + formName[i] + ".pdf";
          window.open(dataURL,"_blank");    

          //link.href = dataURL;
          // link.setAttribute('href', DOCUMENT_URL + formName[i] + ".pdf");
          // link.download = dataURL;
        }
        
        // link.click();
        // setTimeout(() => {
        //   window.URL.revokeObjectURL(dataURL);
        // }, 100);
      },
      ()=>{})

    }

    resetForm() {
  
      this.fixedAssetInfo.FixedAssetPropertyDetails = [];

      this.fixedAssetInfo.FixedAssetFiles=[];

      this.dataTablePropertyValue.TGT_clearData();

      this.dataTableFixedAssetFile.TGT_clearData();
    }
 
  }



