import { Component, OnInit, NgModule, Input } from '@angular/core';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { BaseComponent } from '../../base/base.component';
import { BaseService } from 'src/app/services/base.service';
import { FixedAsset } from 'src/app/models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, NgForm } from '@angular/forms';
import { TransactionLog } from 'src/app/models/TransactionLog';
import { CheckOutReason } from 'src/app/models/CheckOutReason';
import { Currency } from '../../../models/Currency';
import { DOCUMENT_URL } from '../../../declarations/service-values';

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

  response: boolean = false;


  lostFaList: FixedAsset[] = [];
  lostFa: FixedAsset = new FixedAsset();
  Ids: number[] = [];
  faBarcodes: string;
  transactionLog: TransactionLog = new TransactionLog();  
  transactionLogs: TransactionLog[] = [];
  checkedOutReasons: CheckOutReason[] = [];
  currencies: Currency[] = [];  
  IsCreateExitForm: boolean = false;
  
  @Input() faDataTable: TreeGridTable;
  @Input() faBarcode: string;

  public dataTable: TreeGridTable = new TreeGridTable(
    "lostfixedasset",
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
        columnDisplayName: this.getLanguageValue('Location'),
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
    this.loadDropdown();
  }

  ngOnInit() { }

  loadLostFixedAssetList() {
    this.baseService.lostFixedAssetService.GetLostFaList(
      (faList: FixedAsset[]) => {
        this.lostFaList = faList;
        this.dataTable.TGT_loadData(this.lostFaList);
        if(this.lostFaList.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        this.dataTable.isLoading = false;
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

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
  }

  undoLostFixedAsset() {
      this.lostFa.FixedAssetIds = this.selectedSuspendFa();

      this.isWaitingInsertOrUpdate = true;

      if (this.response == true) {

        this.baseService.spinner.show();

          this.baseService.lostFixedAssetService.UndoLostProcess(this.lostFa,
            () => {

              this.isWaitingInsertOrUpdate = false;

              this.baseService.spinner.hide();

              this.dataTable.TGT_removeItemsByIds(this.lostFa.FixedAssetIds);
              
              this.popupComponent.CloseModal("#modalShowQuestionPopupForUndoSuspension");                  

              this.refreshTable();
              
              this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('Operation_is_successful'));

              this.response = false;
            }, (error: HttpErrorResponse) => {

              this.baseService.popupService.ShowErrorPopup(error);

              this.baseService.spinner.hide();
              
              this.isWaitingInsertOrUpdate = false;

            });
        }

      this.isWaitingInsertOrUpdate = false;

  }

  async checkOutFixedAsset(data: NgForm) {

    if (data.form.invalid == true) return;

    this.transactionLog.FixedAssetIds=this.selectedSuspendFa();

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

        this.refreshTable();

       this.resetForm(data, true);   
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
        this.getLanguageValue("Please_choose_at_least_one_record")
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
        this.getLanguageValue("Please_choose_at_least_one_record")
      );

      return;
    }
    else {

      let fixedAssetBarcodes = "";
      selectedItems.forEach((e, i) => {
        fixedAssetBarcodes += e.Barcode + (i == selectedItems.length - 1 ? '' : ", ");
      });

      this.faBarcodes = fixedAssetBarcodes;

      $("#btnExitFa").trigger("click");

    }
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadLostFixedAssetList();

    this.isTableRefreshing = false;
  }

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.lostFa);
    if (isNewItem == true) {
      this.lostFa = new FixedAsset();
    }
  }

  responsePopup(isOk : boolean){
    if(isOk){
      this.response=true;
      this.undoLostFixedAsset();
    }
    else{
      this.response=false;
    }
  }

  openPopup(){

    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        this.getLanguageValue("Please_choose_at_least_one_record")
      );
      return;
    }
    this.popupComponent.ShowModal("#modalShowQuestionPopupForUndoSuspension");        
  }

  PressExitForm(formName: string){
    let url:string;
    url=DOCUMENT_URL + formName + ".pdf";
   
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
}

