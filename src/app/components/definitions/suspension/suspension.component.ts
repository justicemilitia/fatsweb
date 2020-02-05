import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "src/app/services/base.service";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { CheckOutReason } from 'src/app/models/CheckOutReason';
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

@Component({
  selector: "app-suspension",
  templateUrl: "./suspension.component.html",
  styleUrls: ["./suspension.component.css"]
})
export class SuspensionComponent extends BaseComponent implements OnInit {

  isWaitingInsertOrUpdate: boolean = false;

  /* Is Table Refreshing */
  isTableRefreshing:boolean = false;

  /* Is Table Exporting */
  isTableExporting:boolean = false;

  suspension:CheckOutReason=new CheckOutReason();
  suspensions:CheckOutReason[]=[];  

  notDeletedBarcode: string = '';  

  selectedItems:any[]=[];
  
  public dataTable: TreeGridTable = new TreeGridTable(
    "suspension",
    [
      {
        columnDisplayName: this.getLanguageValue('Suspension_Code'),
        columnName: ["CheckOutReasonCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Suspension_Reason'),
        columnName: ["Name"],
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
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );
  constructor(baseService: BaseService) {
    super(baseService);
    this.loadSuspension();
    this.dataTable.isColumnOffsetActive = false;
  }

  ngOnInit() {}

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.suspension);
    if (isNewItem == true) {
      this.suspension = new CheckOutReason();
    }
  }

  onSubmit(data: NgForm) { 

    /* Check model state is valid */
    if (data.form.invalid == true) return;
    
    if (this.suspension.CheckOutReasonId == null) {
      this.addSuspension(data);
    } 
    else {
      this.popupComponent.ShowModal('#modalShowQuestionPopupForSuspension');
      this.popupComponent.CloseModal('#modalSuspension');
    }
  }

  onDelete(){
    
    /* get selected items from table */
    this.selectedItems = this.dataTable.TGT_getSelectedItems();
   
    /* if count of items equals 0 show message for no selected item */
    if (!this.selectedItems || this.selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir askıya alma sebebi seçiniz"
      );
      return;
    }
   else
   this.popupComponent.ShowModal('#modalShowDeletePopupForSuspension');
   
 }

  loadSuspension() {
    this.baseService.checkOutReasonService.GetSuspensions(
      (suspensions: CheckOutReason[]) => {
        /* get checkouts */
        this.suspensions = suspensions;

        /* then load them into table */
        this.dataTable.TGT_loadData(this.suspensions);
        if(suspensions.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        /* Show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async addSuspension(data: NgForm) {
   
    if (data.form.invalid == true) return;

   this.isWaitingInsertOrUpdate = true;

    this.suspension.isSuspended=true;
    this.baseService.checkOutReasonService.InsertSuspension(this.suspension, (insertedItem: CheckOutReason, message) => {

      this.isWaitingInsertOrUpdate = false;

      this.baseService.popupService.ShowSuccessPopup(message);

      this.suspension.CheckOutReasonId = insertedItem.CheckOutReasonId;      

      this.suspensions.push(this.suspension);
      this.dataTable.TGT_loadData(this.suspensions);

      this.resetForm(data, true);

    }, (error: HttpErrorResponse) => {

      this.baseService.popupService.ShowErrorPopup(error);
      this.isWaitingInsertOrUpdate = false;

    });
  }  

  async updateSuspension() {

        this.isWaitingInsertOrUpdate = true;

        this.baseService.checkOutReasonService.UpdateSuspension(this.suspension, (_suspension, message) => {

          this.isWaitingInsertOrUpdate = false;

          this.baseService.popupService.ShowSuccessPopup(message);

          let updatedSuspension = new CheckOutReason();
          Object.assign(updatedSuspension, this.suspension);
          this.dataTable.TGT_updateData(updatedSuspension);

          this.suspensions = <CheckOutReason[]>this.dataTable.TGT_copySource();

        }, (error: HttpErrorResponse) => {

          this.baseService.popupService.ShowErrorPopup(error);
          this.isWaitingInsertOrUpdate = false;

        });
        this.popupComponent.CloseModal('#modalShowQuestionPopupForSuspension');
        
  }

  async deleteSuspension(){
    let selectedItems = this.dataTable.TGT_getSelectedItems();
    this.notDeletedBarcode = '';    

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
         this.getLanguageValue('Please_choose_at_least_one_record')
      );
      return;
    }

      // this.baseService.popupService.ShowQuestionPopupForDelete(() => {

        this.baseService.spinner.show();
  
        let itemIds: number[] = (<CheckOutReason[]>selectedItems).map(x => x.CheckOutReasonId);  
        this.baseService.checkOutReasonService.DeleteSuspensions(
          itemIds,
          () => {
            this.baseService.spinner.hide();  
            if (itemIds.length == 1)
              this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('Delete_operation_successful'));
            else
              this.baseService.popupService.ShowAlertPopup(this.getLanguageValue('All_records_deleted'));
  
            itemIds.forEach(e=> {
              let itemIndex = this.suspensions.findIndex(x=>x.CheckOutReasonId == e);
              if (itemIndex > -1) {
                this.suspensions.splice(itemIndex,1);
              }
            })
            this.dataTable.TGT_loadData(this.suspensions);
          },
          (itemIds:NotDeletedItem[],error: HttpErrorResponse) => {

            let barcode:CheckOutReason;
    
            let notDeletedCode : string[]=[];
    
            let suspensions = <CheckOutReason[]>this.dataTable.TGT_copySource();
            
            /* Hide spinner then show error message */
            this.baseService.spinner.hide();
    
            itemIds.forEach((e:NotDeletedItem) => {
              for(let i=0; i<itemIds.length; i++){
            barcode = suspensions.find(x=>x.CheckOutReasonId == e[i].Id);
            }     
              notDeletedCode.push(barcode.CheckOutReasonCode);
            });
    
            /* Show error message */
            if(itemIds.length>0){
            // this.baseService.popupService.ShowDeletePopup(error,notDeletedCode);
            
            notDeletedCode.forEach((e, i) => {
              this.notDeletedBarcode +=
                e + (i == selectedItems.length - 1 ? "" : ", ");
            });
  
             this.popupComponent.ShowModal('#modalShowErrorPopup');
            }
            else
            this.baseService.popupService.ShowErrorPopup(error);
    
          }
        );
        this.popupComponent.CloseModal('#modalShowDeletePopupForSuspension');
        // });      
    }  

  async onDoubleClickItem(item: CheckOutReason) {
 
    this.baseService.spinner.show();

    await this.baseService.checkOutReasonService.GetSuspensionById(item.CheckOutReasonId,
      (result: CheckOutReason) => {

        setTimeout(() => {

            $("#btnEditSuspension").trigger("click");

            this.suspension = result;
            this.baseService.spinner.hide();
            
        }, 1000);
      }, (error: HttpErrorResponse) => {

        this.baseService.spinner.hide();
        this.baseService.popupService.ShowErrorPopup(error);

      });
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadSuspension();

    this.isTableRefreshing = false;

  }

}
