import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { BaseService } from 'src/app/services/base.service';
import { FixedAsset } from 'src/app/models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';
import { TransactionLog } from 'src/app/models/TransactionLog';
import { NgForm } from '@angular/forms';
import { Currency } from 'src/app/models/Currency';
import { CheckOutReason } from 'src/app/models/CheckOutReason';

@Component({
  selector: 'app-suspended-fixed-asset',
  templateUrl: './suspended-fixed-asset.component.html',
  styleUrls: ['./suspended-fixed-asset.component.css']
})
export class SuspendedFixedAssetComponent extends BaseComponent implements OnInit {

  suspendedList:FixedAsset[]=[];
  suspended:FixedAsset=new FixedAsset();
  Ids:number[]=[];
  transaction:TransactionLog=new TransactionLog();
  transactionLogs: TransactionLog[] = [];
  currencies: Currency;
  checkedOutReasons: CheckOutReason[] =[];
  locations:Location[]=[];

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
        columnDisplayName: "Departman",
        columnName: ["Department","Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },      
      {
        columnDisplayName: "Lokasyon",
        columnName: ["Location","Name"],
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
  
  constructor(protected baseService:BaseService){
    super(baseService);
    this.loadSuspendedList();
    this.loadDropdown();
   }

  ngOnInit(){}

  loadDropdown(){

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
    locations=>{
      this.locations=locations;
    },
    (error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    }
    );
  }

    loadSuspendedList(){
      this.baseService.suspendedService.GetFixedAssetsSuspendedList(
        (suspended:FixedAsset[])=>{
          this.suspendedList=suspended;
          this.dataTable.TGT_loadData(this.suspendedList);
        },
        (error:HttpErrorResponse)=>{
          this.baseService.popupService.ShowErrorPopup(error);
        });
    }

    selectedSuspendFa(){

      let selectedItems=this.dataTable.TGT_getSelectedItems();

      if (!selectedItems || selectedItems.length == 0) {
        this.baseService.popupService.ShowAlertPopup(
          "Lütfen en az bir demirbaş seçiniz"
        );
        return;
      }

      let itemIds: number[] = selectedItems.map(x => x.getId());
      this.Ids = itemIds;
      return this.Ids;
    }
    
    undoSuspendedFixedAsset(data:NgForm){

      this.transaction.FixedAssetIds=this.selectedSuspendFa();

      this.baseService.popupService.ShowQuestionPopupForOperation((response:boolean)=>{
        if(response==true){

          this.baseService.suspendedService.UndoSuspensionProcess(this.transaction,
            (suspension:FixedAsset,message)=>{
    
              this.baseService.popupService.ShowSuccessPopup(message);
              
              this.suspended.FixedAssetId=suspension.FixedAssetId;
    
              this.suspendedList.push(this.suspended);
              this.dataTable.TGT_loadData(this.suspendedList);
           
            },(error:HttpErrorResponse)=>{
              this.baseService.popupService.ShowErrorPopup(error);
            });
         }
      });
    }

    checkOutFixedAsset(data:NgForm){

      this.transaction.FixedAssetIds=this.selectedSuspendFa();
      this.baseService.popupService.ShowQuestionPopupForOperation((response:boolean)=>{
        if(response==true){
          
          this.baseService.fixedAssetService.ExitFixedAsset(
            this.transaction,
            (insertedItem: TransactionLog, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              /* Set inserted Item id to model */
              this.transaction.TransactionLogId = insertedItem.TransactionLogId;

              /* Push inserted item to Property list */
              this.transactionLogs.push(this.transaction);
            },
            (error: HttpErrorResponse) => {
              /* Show alert message */
              this.baseService.popupService.ShowErrorPopup(error);
              }
            );
          }
      });
    }
}
