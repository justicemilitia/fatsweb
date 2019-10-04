import { Component, OnInit } from '@angular/core';
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';
import { BaseService } from '../../../services/base.service';
import { BaseComponent } from '../../base/base.component';
import { Page } from '../../../extends/TreeGridTable/models/Page';
import { FixedAsset } from '../../../models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';
import { FixedAssetCardProperty } from '../../../models/FixedAssetCardProperty';
import { MatTabChangeEvent } from '@angular/material';
import { Maintenance } from '../../../models/Maintenance';
import { MaintenanceStatus } from '../../../declarations/maintenance-status.enum';

@Component({
  selector: 'app-work-order-list',
  templateUrl: './work-order-list.component.html',
  styleUrls: ['./work-order-list.component.css']
})
export class WorkOrderListComponent extends BaseComponent implements OnInit {

  /* List Of Work Orders */
  workOrders: Maintenance[] = [];
  
  currentPage: number = 1;
  perInPage: number = 25;
  totalPage: number = 1;
  pages: Page[] = [];

  tabIndex: number = 0;  

  currentTab:number = 0;
  
  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;

  /* Is Table Exporting */
  isTableExporting: boolean = false;
  
  fixedAssets: FixedAsset[] = [];
  
  fixedAssetCardProperties: FixedAssetCardProperty[] = [];
  

  public dataTableFixedAssetList: TreeGridTable = new TreeGridTable(
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
        columnDisplayName: this.getLanguageValue('Staff'),
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
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );

  public dataTableWorkOrder: TreeGridTable = new TreeGridTable(
    "workOrder",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Name'),
        columnName: ["FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('BreakdownMaintenanceNo'),
        columnName: ["MaintenanceNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Requested_User'),
        columnName: ["|RequestedUser"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.RequestedUser == null ? value.RequestedUser.User.FirstName + ' ' + value.RequestedUser.User.LastName : '';
          }
          else {
            return '';
          }
        }
      },
      {
        columnDisplayName: this.getLanguageValue('RequestDate'),
        columnName: ["RequestDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.RequestDate ? value.RequestDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('CompletionDate'),
        columnName: ["CompletionDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.CompletionDate ? value.CompletionDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Attendant_User'),
        columnName: ["|AttendantUser"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.AttendantUser == null ? value.AttendantUser.User.FirstName + ' ' + value.AttendantUser.User.LastName : '';
          }
          else {
            return '';
          }
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Maintenance_Status'),
        columnName: ["MaintenanceStatus", "StatuName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Maintenance_Time'),
        columnName: ["MaintenanceTime"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Maintenance_Type'),
        columnName: ["MaintenanceTypes", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["FixedAssetCard", "Name"]
    }
  );

  public dataTablePlannedWorkOrders: TreeGridTable = new TreeGridTable(
    "plannedWorkOrder",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Name'),
        columnName: ["FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('BreakdownMaintenanceNo'),
        columnName: ["MaintenanceNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Requested_User'),
        columnName: ["|RequestedUser"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.RequestedUser == null ? value.RequestedUser.User.FirstName + ' ' + value.RequestedUser.User.LastName : '';
          }
          else {
            return '';
          }
        }
      },
      {
        columnDisplayName: this.getLanguageValue('RequestDate'),
        columnName: ["RequestDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.RequestDate ? value.RequestDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('CompletionDate'),
        columnName: ["CompletionDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.CompletionDate ? value.CompletionDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Attendant_User'),
        columnName: ["|AttendantUser"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.AttendantUser == null ? value.AttendantUser.User.FirstName + ' ' + value.AttendantUser.User.LastName : '';
          }
          else {
            return '';
          }
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Maintenance_Time'),
        columnName: ["MaintenanceTime"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Maintenance_Type'),
        columnName: ["MaintenanceTypes", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["FixedAssetCard", "Name"]
    }
  );

  public dataTableCompletedWorkOrders: TreeGridTable = new TreeGridTable(
    "completedWorkOrder",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Name'),
        columnName: ["FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('BreakdownMaintenanceNo'),
        columnName: ["MaintenanceNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Requested_User'),
        columnName: ["|RequestedUser"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.RequestedUser == null ? value.RequestedUser.User.FirstName + ' ' + value.RequestedUser.User.LastName : '';
          }
          else {
            return '';
          }
        }
      },
      {
        columnDisplayName: this.getLanguageValue('RequestDate'),
        columnName: ["RequestDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.RequestDate ? value.RequestDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('CompletionDate'),
        columnName: ["CompletionDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.CompletionDate ? value.CompletionDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Attendant_User'),
        columnName: ["|AttendantUser"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.AttendantUser == null ? value.AttendantUser.User.FirstName + ' ' + value.AttendantUser.User.LastName : '';
          }
          else {
            return '';
          }
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Maintenance_Time'),
        columnName: ["MaintenanceTime"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Maintenance_Type'),
        columnName: ["MaintenanceTypes", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["FixedAssetCard", "Name"]
    }
  );

  public dataTableCancelledWorkOrders: TreeGridTable = new TreeGridTable(
    "cancelledWorkOrder",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Name'),
        columnName: ["FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('BreakdownMaintenanceNo'),
        columnName: ["MaintenanceNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Requested_User'),
        columnName: ["|RequestedUser"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.RequestedUser == null ? value.RequestedUser.User.FirstName + ' ' + value.RequestedUser.User.LastName : '';
          }
          else {
            return '';
          }
        }
      },
      {
        columnDisplayName: this.getLanguageValue('RequestDate'),
        columnName: ["RequestDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.RequestDate ? value.RequestDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('CompletionDate'),
        columnName: ["CompletionDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.CompletionDate ? value.CompletionDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Attendant_User'),
        columnName: ["|AttendantUser"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.AttendantUser == null ? value.AttendantUser.User.FirstName + ' ' + value.AttendantUser.User.LastName : '';
          }
          else {
            return '';
          }
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Maintenance_Time'),
        columnName: ["MaintenanceTime"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Maintenance_Type'),
        columnName: ["MaintenanceTypes", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["FixedAssetCard", "Name"]
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

  constructor(protected baseService: BaseService) { 
    super(baseService);
    this.loadFixedAsset(this.perInPage, this.currentPage);    
    this.loadFixedAssetProperties();
    
    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isFilterActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isScrollActive = false;

    this.dataTableFixedAssetList.isPagingActive=false;
    this.dataTableWorkOrder.isPagingActive=false;
    this.dataTablePlannedWorkOrders.isPagingActive=false;
    this.dataTableCompletedWorkOrders.isPagingActive=false;
    this.dataTableCancelledWorkOrders.isPagingActive=false;
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

  ngOnInit() {
  }

  
  async loadFixedAsset(_perInPage: number = 25, _currentPage: number = 1) {

    this.dataTableFixedAssetList.TGT_clearData();
    this.dataTableFixedAssetList.isLoading = true;

    this.baseService.fixedAssetService.GetFixedAsset(_perInPage, _currentPage, false,
      (fa: FixedAsset[], totalPage: number, message: string) => {

        let valueA: string = '';
        
        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.dataTableFixedAssetList.perInPage = _perInPage;
        this.fixedAssets = fa;
        this.totalPage = totalPage ? totalPage : 1;

        fa.forEach(e => {
          e.FixedAssetPropertyDetails.forEach(p => {
            if (p.FixedAssetCardPropertyId) {
              // e.FixedAssetPropertyDetails.length>1
              for (let i = 0; i < e.FixedAssetPropertyDetails.length; i++) {
                valueA+= e.FixedAssetPropertyDetails[i].Value + ( e.FixedAssetPropertyDetails.length - i == 1 ? "" : "|");                                  
              }
  
              e["PROP_" + p.FixedAssetCardPropertyId.toString()] = valueA;
            }
            valueA='';            
          });
        });
        this.dataTableFixedAssetList.TGT_loadData(this.fixedAssets);
        this.TGT_calculatePages();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadFixedAssetProperties() {
    this.baseService.fixedAssetService.GetFixedAssetProperties(
      (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
        this.fixedAssetCardProperties = fixedAssetCardProperties;

        this.fixedAssetCardProperties.forEach(e => {

          this.dataTableFixedAssetList.dataColumns.push({
            columnDisplayName: e.Name,            
            columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
            isActive: true,
            type: "text"
            // ,
            // formatter: value => {
            //   if (value) {
            //     return e.FixedAssetAsDisplay;
            //   }
            // }
          });
        });
        this.dataTableFixedAssetList.TGT_bindActiveColumns();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadWorkOrderList(tabIndex:number, _perInPage: number = 25, _currentPage: number = 1) {
    let maintenanceStatus: number[] = [];    

    switch(tabIndex){
      case 1:
      this.tabIndex = 1;
      maintenanceStatus.push(MaintenanceStatus.PLANNED);
      maintenanceStatus.push(MaintenanceStatus.PENDING);
      maintenanceStatus.push(MaintenanceStatus.DELAYED);      
      break; 
      case 2:
      this.tabIndex = 2;
      maintenanceStatus.push(MaintenanceStatus.PLANNED);
      break;
      case 3:
      this.tabIndex = 3;
      maintenanceStatus.push(MaintenanceStatus.DONE);
      break;
      case 3:
      this.tabIndex = 4;
      maintenanceStatus.push(MaintenanceStatus.CANCELLED);
      break;
    }

    let workOrder: Maintenance = new Maintenance;
    
    workOrder.MaintenanceStatusIds = maintenanceStatus;

    /* Load all departments to datatable */
    await this.baseService.workOrderService.GetWorkOrdersAndBreakdownRequestList(workOrder,
      (workOrders: Maintenance[], totalPage: number, message: string) => {

        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.totalPage = totalPage ? totalPage : 1;

        this.workOrders = workOrders;
        this.dataTableWorkOrder.TGT_loadData(this.workOrders);
        this.TGT_calculatePages();
        

        switch(this.tabIndex){
          case 1:
          this.dataTableWorkOrder.perInPage = _perInPage;
          break; 
          case 2:
          this.dataTablePlannedWorkOrders.perInPage = _perInPage;
          break;
          case 3:
          this.dataTableCompletedWorkOrders.perInPage = _perInPage;
          break;
          case 4:
          this.dataTableCancelledWorkOrders.perInPage = _perInPage;
          break;
        }

        if(this.workOrders.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.totalPage = 0;
        this.TGT_calculatePages();
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.perInPage = 25;
    this.currentPage = 1
    this.totalPage=0;

    this.tabIndex=tabChangeEvent.index;
    
    switch(tabChangeEvent.index){
      case 0:
      this.loadFixedAsset(this.perInPage, this.currentPage);
      this.loadFixedAssetProperties();
      break;
      case 1:
      this.loadWorkOrderList(1, this.perInPage, this.currentPage);      
      break; 
      case 2:
      this.loadWorkOrderList(2, this.perInPage, this.currentPage);      
      break;
      case 3:
      this.loadWorkOrderList(3, this.perInPage, this.currentPage);            
      break;
      case 4:
      this.loadWorkOrderList(4, this.perInPage, this.currentPage);            
      break;
    }
  }

  exportExcel(){
    switch(this.tabIndex){
      case 0:
      this.exportAsExcelFile(this.dataTableFixedAssetList);
      break;
      case 1:
      this.exportAsExcelFile(this.dataTableWorkOrder);
      break; 
      case 2:
      this.exportAsExcelFile(this.dataTablePlannedWorkOrders);
      break;
      case 3:
      this.exportAsExcelFile(this.dataTableCompletedWorkOrders);
      break;
      case 4:
      this.exportAsExcelFile(this.dataTableCancelledWorkOrders);
      break;
    }
  }

  refreshTable(){
    this.isTableRefreshing = true;
    this.perInPage = 25;
    this.currentPage = 1

    switch(this.tabIndex){
      case 0:
      this.dataTableFixedAssetList.isLoading = true;
      this.dataTableFixedAssetList.TGT_clearData();
      this.loadFixedAsset(this.perInPage,this.currentPage);
      break;
      case 1:
      this.dataTableWorkOrder.isLoading = true;
      this.dataTableWorkOrder.TGT_clearData();
      this.loadWorkOrderList(this.tabIndex);
      break;
      case 2:
      this.dataTablePlannedWorkOrders.isLoading = true;
      this.dataTablePlannedWorkOrders.TGT_clearData();
      this.loadWorkOrderList(this.tabIndex);
      break;
      case 3:
      this.dataTableCompletedWorkOrders.isLoading = true;
      this.dataTableCompletedWorkOrders.TGT_clearData();
      this.loadWorkOrderList(this.tabIndex); 
      break;
      case 4:
      this.dataTableCancelledWorkOrders.isLoading = true;
      this.dataTableCancelledWorkOrders.TGT_clearData();
      this.loadWorkOrderList(this.tabIndex);
      break;
    }
    this.isTableRefreshing = false;
  }

}
