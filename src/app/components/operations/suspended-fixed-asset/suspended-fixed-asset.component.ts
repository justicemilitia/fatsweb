import { Component, OnInit, Input } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { BaseService } from "src/app/services/base.service";
import { FixedAsset } from "src/app/models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { TransactionLog } from "src/app/models/TransactionLog";
import { NgForm } from "@angular/forms";
import { Currency } from "src/app/models/Currency";
import { CheckOutReason } from "src/app/models/CheckOutReason";
import * as $ from "jquery";
import { FixedAssetUser } from '../../../models/FixedAssetUser';
import { convertNgbDateToDateString } from '../../../declarations/extends';
import { DOCUMENT_URL } from '../../../declarations/service-values';

@Component({
  selector: "app-suspended-fixed-asset",
  templateUrl: "./suspended-fixed-asset.component.html",
  styleUrls: ["./suspended-fixed-asset.component.css"]
})
export class SuspendedFixedAssetComponent extends BaseComponent
  implements OnInit {
  /* Is Table Exporting */
  isTableExporting: boolean = false;
  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;

  suspendedList: FixedAsset[] = [];
  suspendedFa: FixedAsset = new FixedAsset();
  Ids: number[] = [];
  transactionLog: TransactionLog = new TransactionLog();
  transactionLogSuspended: TransactionLog = new TransactionLog();
  transactionLogs: TransactionLog[] = [];
  currencies: Currency[] = [];
  checkedOutReasons: CheckOutReason[] = [];
  locations: Location[] = [];
  @Input() faDataTable: TreeGridTable;
  @Input() faBarcode: string;
  faBarcodes: string;
  IsCreateUndoSuspendForm: boolean=false;
  IsCreateExitForm: boolean = false;  

  public dataTable: TreeGridTable = new TreeGridTable(
    "suspendedfixedasset",
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
        columnDisplayName: this.getLanguageValue('Embezzled_Staff'),
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
        columnDisplayName: this.getLanguageValue('Suspention_Reasons'),
        columnName: ["CheckOutReasonName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Expected_Arrival_Date'),
        columnName: ["CheckInExpectedArrivalDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.CheckInExpectedArrivalDate ? value.CheckInExpectedArrivalDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Suspended_Date'),
        columnName: ["|TransactionDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text", 
        formatter: value => {
          return value.TransactionDate ? value.TransactionDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadSuspendedList();
    this.loadDropdown();
  }

  ngOnInit() {}

  loadDropdown() {
    /* Load checked out reasons to checked out reason dropdown */
    this.baseService.checkOutReasonService.GetCheckOutReason(
      checkedOutReasons => {
        this.checkedOutReasons = checkedOutReasons;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    /* Load currencies to currencies dropdown */
    this.baseService.currencyService.GetCurrencies(
      currencies => {
        this.currencies = currencies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    /* Load locations to locations dropdown */
    this.baseService.locationService.GetLocations(
      locations => {
        this.locations = locations;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadSuspendedList() {
    this.baseService.suspendedService.GetFixedAssetsSuspendedList(
      (suspended: FixedAsset[]) => {
        this.suspendedList = suspended;
        this.dataTable.TGT_loadData(this.suspendedList);
        if(this.suspendedList.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.dataTable.isLoading = false;
      }
    );
  }

  selectedSuspendFa() {
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    let itemIds: number[] = selectedItems.map(x => x.getId());
    this.Ids = itemIds;
    return this.Ids;
  }

  undoSuspendedFixedAsset(dataSuspend: NgForm) {
    if (dataSuspend.form.invalid == true) return;

    //this.transactionLogSuspended =new TransactionLog();
    this.transactionLogSuspended.FixedAssetIds = this.selectedSuspendFa();
    this.transactionLogSuspended.UndoSuspensionDate = convertNgbDateToDateString(dataSuspend.value.undoSuspensionDate);


    this.baseService.suspendedService.UndoSuspensionProcess(
    this.transactionLogSuspended,
    (formList: any[], message) => {
      this.dataTable.TGT_removeItemsByIds(
        this.transactionLogSuspended.FixedAssetIds
      );

      if(this.IsCreateUndoSuspendForm==true){
        for(let i=0;i<formList.length;i++){
          this.PressUndoSuspendForm(formList[i].FixedAssetFormCode);
        }
      }

      this.baseService.popupService.ShowSuccessPopup(message);
    },
    (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    }
    );
      this.resetForm(dataSuspend, true);    
  }

  async checkOutFixedAsset(dataExit: NgForm) {
    if (dataExit.form.invalid == true) return;

    this.transactionLog.FixedAssetIds = this.selectedSuspendFa();

    await this.baseService.fixedAssetService.ExitFixedAsset(
      this.transactionLog,
      (formList: any[], message) => {
        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        
        if(this.IsCreateExitForm==true){
          for(let i=0;i<formList.length;i++){
            this.PressExitForm(formList[i].FixedAssetFormCode);
          }
        }

        /* Push inserted item to Property list */
        this.transactionLogs.push(this.transactionLog);
        this.loadSuspendedList();
        this.resetForm(dataExit, true);
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  selectedBarcodes() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz"
      );

      return;
    } else {
      $("#btnOpenSuspendedFa").trigger("click");

      let fixedAssetBarcodes = "";
      selectedItems.forEach((e, i) => {
        fixedAssetBarcodes +=
          e.Barcode + (i == selectedItems.length - 1 ? "" : ", ");
      });
      this.faBarcodes = fixedAssetBarcodes;
    }
  }

  selectedExitBarcodes() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz"
      );

      return;
    } else {
      $("#btnExitFa").trigger("click");

      let fixedAssetBarcodes = "";
      selectedItems.forEach((e, i) => {
        fixedAssetBarcodes +=
          e.Barcode + (i == selectedItems.length - 1 ? "" : ", ");
      });
      this.faBarcodes = fixedAssetBarcodes;
    }
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadSuspendedList();

    this.isTableRefreshing = false;
  }

    resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.suspendedFa);
    if (isNewItem == true) {
      this.suspendedFa = new FixedAsset();
    }
  }

  isCreateUndoSuspendForm(event){
    if(event.target.checked == true){
      this.IsCreateUndoSuspendForm = true;
    }
    else {
      this.IsCreateUndoSuspendForm = false;
    }
  }

  PressUndoSuspendForm(formName: string){
    let url:string;
    url=DOCUMENT_URL + formName + ".pdf";
    // this.router.navigate([url]); 
    window.open(url,"_blank");    
  }

  isCreateExitForm(event){
    if(event.target.checked == true){
      this.IsCreateExitForm = true;
    }
    else {
      this.IsCreateExitForm = false;
    }
  }

  PressExitForm(formName: string){
    let url:string;
    url=DOCUMENT_URL + formName + ".pdf";
    // this.router.navigate([url]); 
    window.open(url,"_blank");    
  }
}
