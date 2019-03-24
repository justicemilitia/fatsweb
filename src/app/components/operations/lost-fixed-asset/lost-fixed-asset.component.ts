import { Component, OnInit, NgModule } from '@angular/core';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { BaseComponent } from '../../base/base.component';
import { BaseService } from 'src/app/services/base.service';
import { FixedAsset } from 'src/app/models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';
import{FaExitComponent} from '../../operations/fixed-asset/fa-exit/fa-exit.component';
import { ReactiveFormsModule, NgForm } from '@angular/forms';
import { TransactionLog } from 'src/app/models/TransactionLog';

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

  lostFaList:FixedAsset[]=[];
  lostFa:FixedAsset=new FixedAsset();
  Ids:number[]=[];
  faBarcodes:string;
  transaction:TransactionLog=new TransactionLog();
  transactionLogs: TransactionLog[] = [];
  
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

  constructor(protected baseService:BaseService) {
    super(baseService);
    this.loadLostFixedAssetList();

   }

  ngOnInit() {}

   loadLostFixedAssetList(){
     this.baseService.lostFixedAssetService.GetLostFaList(
       (faList:FixedAsset[])=>{
         this.lostFaList=faList;
         this.dataTable.TGT_loadData(this.lostFaList);
       },
       (error:HttpErrorResponse)=>{
         this.baseService.popupService.ShowErrorPopup(error);
       });
   }

   undoLostFixedAsset(){

    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz"
      );
      return;
    }
    else{
    this.lostFa.FixedAssetIds=this.selectedSuspendFa();

    this.baseService.popupService.ShowQuestionPopupForFoundFixedAsset((response:boolean)=>{
      if(response==true){

        this.baseService.lostFixedAssetService.UndoLostProcess(this.lostFa,
          (lostFa:FixedAsset,message)=>{
  
            let updatedLostFa=new FixedAsset();
            //NEDEN TRANSACTİON DÖNÜYORR !!!
            this.dataTable.TGT_updateData(updatedLostFa);
            this.baseService.popupService.ShowSuccessPopup(message);
    
         
          },(error:HttpErrorResponse)=>{
            this.baseService.popupService.ShowErrorPopup(error);
          });
       }
    });
  }
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

   selectedSuspendFa(){

    let selectedItems=this.dataTable.TGT_getSelectedItems();

    let itemIds: number[] = selectedItems.map(x => x.getId());
    this.Ids = itemIds;
    return this.Ids;
  }

  selectedLostFa(){

    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz"
      );
      return;
    }
    else{
      
      this.baseService.popupService.ShowQuestionPopupForFoundFixedAsset((response:boolean)=>{
        if(response==true){
          let fixedAssetBarcodes = "";
          selectedItems.forEach(e => {
            fixedAssetBarcodes += e.Barcode + ", ";
            
          });
          this.faBarcodes=fixedAssetBarcodes;
        }
      })
    }
  }

 selectedExitBarcodes(){

      let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();

      
      if (!selectedItems || selectedItems.length == 0) {
        this.baseService.popupService.ShowAlertPopup(
          "Lütfen en az bir demirbaş seçiniz"
        );
                
        return;
      }
      else{
        
        $("#btnExitFa").trigger("click");

       let fixedAssetBarcodes = "";
       selectedItems.forEach(e => {
         fixedAssetBarcodes += e.Barcode + ", ";
         
       });
       this.faBarcodes=fixedAssetBarcodes;
     }  
    }
}

