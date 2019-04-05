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
  transactionLogs: TransactionLog[] = [];
  currencies: Currency[] = [];
  checkedOutReasons: CheckOutReason[] = [];
  locations: Location[] = [];
  @Input() faDataTable: TreeGridTable;
  @Input() faBarcode: string;
  faBarcodes: string;

  public dataTable: TreeGridTable = new TreeGridTable(
    "suspendedfixedasset",
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
        columnDisplayName: "Zimmetli Personel",
        columnName: ["FixedAssetUsers"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text", 
        formatter: (value) => {
          if(value && value.length!=0){
            return (<FixedAssetUser[]>value).map(x=>x.User.FirstName + ' ' + x.User.LastName)[0]
          }
          else{ 
            return '';
          }
      }
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
      }
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

  undoSuspendedFixedAsset(data: NgForm) {
    if (data.form.invalid == true) return;

    this.suspendedFa.FixedAssetIds = this.selectedSuspendFa();

    this.baseService.popupService.ShowQuestionPopupForOperation(
      (response: boolean) => {
        if (response == true) {
          this.baseService.suspendedService.UndoSuspensionProcess(
            this.suspendedFa,
            () => {
              this.dataTable.TGT_removeItemsByIds(
                this.suspendedFa.FixedAssetIds
              );

              this.baseService.popupService.ShowSuccessPopup(
                "İşlem başarılı !"
              );
            },
            (error: HttpErrorResponse) => {
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
        }
      }
    );
  }

  async checkOutFixedAsset(data: NgForm) {
    if (data.form.invalid == true) return;

    this.transactionLog.FixedAssetIds = this.selectedSuspendFa();

    await this.baseService.fixedAssetService.ExitFixedAsset(
      this.transactionLog,
      (insertedItem: TransactionLog, message) => {
        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Set inserted Item id to model */
        this.transactionLog.TransactionLogId = insertedItem.TransactionLogId;

        /* Push inserted item to Property list */
        this.transactionLogs.push(this.transactionLog);
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
}
