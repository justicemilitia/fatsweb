import { Component, OnInit, NgModule, Input } from '@angular/core';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { BaseComponent } from '../../base/base.component';
import { BaseService } from 'src/app/services/base.service';
import { FixedAsset } from 'src/app/models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, NgForm } from '@angular/forms';
import { TransactionLog } from 'src/app/models/TransactionLog';
import { CheckOutReason } from 'src/app/models/CheckOutReason';

@Component({
  selector: 'app-lost-fixed-asset',
  templateUrl: './lost-fixed-asset.component.html',
  styleUrls: ['./lost-fixed-asset.component.css']
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [LostFixedAssetComponent],
  providers: [LostFixedAssetComponent]
})
export class LostFixedAssetComponent extends BaseComponent implements OnInit {


  isWaitingInsertOrUpdate: boolean = false;
  /* Is Table Exporting */
  isTableExporting: boolean = false;
  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;


  lostFaList: FixedAsset[] = [];
  lostFa: FixedAsset = new FixedAsset();
  Ids: number[] = [];
  faBarcodes: string;
  transactionLog: TransactionLog = new TransactionLog();  
  transactionLogs: TransactionLog[] = [];
  checkedOutReasons: CheckOutReason[] = [];
  @Input() faDataTable: TreeGridTable;
  @Input() faBarcode: string;

  public dataTable: TreeGridTable = new TreeGridTable(
    "lostfixedasset",
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
      }
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadLostFixedAssetList();
    this.loadCheckOutReasons();
  }

  ngOnInit() { }

  loadLostFixedAssetList() {
    this.baseService.lostFixedAssetService.GetLostFaList(
      (faList: FixedAsset[]) => {
        this.lostFaList = faList;
        this.dataTable.TGT_loadData(this.lostFaList);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  loadCheckOutReasons() {
    this.baseService.checkOutReasonService.GetCheckOutReason(
      checkedOutReasons => {
        this.checkedOutReasons = checkedOutReasons;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  undoLostFixedAsset() {

    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz"
      );
      return;
    }
    else {

      this.lostFa.FixedAssetIds = this.selectedSuspendFa();

      this.isWaitingInsertOrUpdate = true;

      this.baseService.popupService.ShowQuestionPopupForFoundFixedAsset((response: boolean) => {
        if (response == true) {

          this.baseService.lostFixedAssetService.UndoLostProcess(this.lostFa,
            () => {

              this.isWaitingInsertOrUpdate = false;

              this.dataTable.TGT_removeItemsByIds(this.lostFa.FixedAssetIds);

              this.baseService.popupService.ShowSuccessPopup("İşlem başarılı !");

            }, (error: HttpErrorResponse) => {

              this.baseService.popupService.ShowErrorPopup(error);
              this.isWaitingInsertOrUpdate = false;

            });
        }
      });
    }
  }

  async checkOutFixedAsset(data: NgForm) {

    if (data.form.invalid == true) return;

    this.transactionLog.FixedAssetIds = (<FixedAsset[]>(
      this.faDataTable.TGT_getSelectedItems()
    )).map(x => x.FixedAssetId);

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


  selectedSuspendFa() {
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    let itemIds: number[] = selectedItems.map(x => x.getId());
    this.Ids = itemIds;
    return this.Ids;
  }

  selectedLostFa() {

    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz"
      );
      return;
    }
    else {

      this.baseService.popupService.ShowQuestionPopupForFoundFixedAsset((response: boolean) => {
        if (response == true) {
          let fixedAssetBarcodes = "";
          selectedItems.forEach((e, i) => {
            fixedAssetBarcodes += e.Barcode + (i == selectedItems.length - 1 ? '' : ", ");

          });
          this.faBarcodes = fixedAssetBarcodes;
        }
      })
    }
  }

  selectedExitBarcodes() {

    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();


    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz"
      );

      return;
    }
    else {

      $("#btnExitFa").trigger("click");

      let fixedAssetBarcodes = "";
      selectedItems.forEach((e, i) => {
        fixedAssetBarcodes += e.Barcode + (i == selectedItems.length - 1 ? '' : ", ");

      });
      this.faBarcodes = fixedAssetBarcodes;
    }
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadLostFixedAssetList();

    this.isTableRefreshing = false;
  }
}

