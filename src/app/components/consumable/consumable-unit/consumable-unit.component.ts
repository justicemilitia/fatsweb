import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, ReactiveFormsModule } from '@angular/forms';
import { ConsumableUnit } from "src/app/models/ConsumableUnit";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { HttpErrorResponse } from "@angular/common/http";
import * as $ from "jquery";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';
import { BaseComponent } from '../../base/base.component';
import { BaseService } from '../../../services/base.service';

@Component({
  selector: 'app-consumable-unit',
  templateUrl: './consumable-unit.component.html',
  styleUrls: ['./consumable-unit.component.css']
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [ConsumableUnitComponent],
  providers: [ConsumableUnitComponent]
})
export class ConsumableUnitComponent extends BaseComponent implements OnInit {
  
  isWaitingInsertOrUpdate: boolean = false;
  
  /* Is Table Refreshing */
  isTableRefreshing:boolean = false;

  /* Is Table Exporting */
  isTableExporting:boolean = false;

  consumableUnits: ConsumableUnit[] = [];

  consumableUnit: ConsumableUnit = new ConsumableUnit();

  public dataTable: TreeGridTable = new TreeGridTable(
    "consumableunit",
    [
      {
        columnDisplayName: "Birim Adı",
        columnName: ["ConsumableUnitName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Birim Kısaltması",
        columnName: ["ConsumableUnitShortName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["ConsumableUnitName"]
    }
  );

  constructor(protected baseService: BaseService) { 
    super(baseService);
    this.loadConsumableUnits();    
  }

  ngOnInit() {
  }

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.consumableUnit);
    if (isNewItem == true) {
      this.consumableUnit = new ConsumableUnit();
    }
  }

  OnSubmit(data: NgForm) {

    if (data.form.invalid) return true;

    if (this.consumableUnit.ConsumableUnitId == null) {
      this.addConsumableUnit(data);
    } else {
      this.popupComponent.ShowModal('#modalShowQuestionPopupForConsumableUnit');
      this.popupComponent.CloseModal('#modalConsumableUnit');
    }
  }

  async deleteConsumableUnits() {
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        this.getLanguageValue('Choose_at_least_one_expense_center')
      );
      return;
    }

    // await this.baseService.popupService.ShowQuestionPopupForDelete(() => {
      this.baseService.spinner.show();

      let itemIds: number[] = selectedItems.map(x => x.getId());

      this.baseService.consumableUnitService.DeleteConsumableUnits(
        itemIds,
        () => {
          this.baseService.spinner.hide();

          if (itemIds.length == 1)
            this.baseService.popupService.ShowSuccessPopup(
              this.getLanguageValue('Delete_operation_successful')
            );
          else
            this.baseService.popupService.ShowSuccessPopup(
              this.getLanguageValue('All_records_deleted')
            );

          for (let ii = 0; ii < itemIds.length; ii++) {
            let index = this.consumableUnits.findIndex(
              x => x.ConsumableUnitId == itemIds[ii]
            );
            if (index > -1) this.consumableUnits.splice(index, 1);
          }

          this.dataTable.TGT_loadData(this.consumableUnits);
        },
        (failedItems: NotDeletedItem[], error:HttpErrorResponse) => {
          
          let barcode:ConsumableUnit;

          let notDeletedCode:string[]=[];

          let expensecenters= <ConsumableUnit[]>this.dataTable.TGT_copySource();
          
          /* Hide Loading Spinner */
          this.baseService.spinner.hide();

          failedItems.forEach((e:NotDeletedItem) => {
            for(let i=0; i<itemIds.length; i++){
          barcode = expensecenters.find(x=>x.ConsumableUnitId == e[i].Id);
          }     
            notDeletedCode.push(barcode.ConsumableUnitName);
          });

          this.baseService.popupService.ShowAlertPopup(
            this.getLanguageValue('Records_couldnt_delete_cause_theyre_related')
          );

          /* Show error message */
          if(failedItems.length>0)
          this.baseService.popupService.ShowDeletePopup(error,notDeletedCode);
          else
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
      this.popupComponent.CloseModal('#modalShowDeletePopupForConsumableUnit');      
    // });
  }

  async loadConsumableUnits(){
    await this.baseService.consumableUnitService.GetConsumableUnits(
      (consUnits: ConsumableUnit[]) => {
        this.consumableUnits = consUnits;
        this.dataTable.TGT_loadData(this.consumableUnits);
        if(consUnits.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async addConsumableUnit(data: NgForm){
    if (data.value.invalid == true) return;

    this.isWaitingInsertOrUpdate = true;

    await this.baseService.consumableUnitService.InsertConsumableUnit(
      this.consumableUnit,
      (insertedItem: ConsumableUnit, message) => {

        this.baseService.popupService.ShowSuccessPopup(message);
        this.consumableUnit.ConsumableUnitId = insertedItem.ConsumableUnitId;
        
        this.consumableUnits.push(this.consumableUnit);
        this.dataTable.TGT_loadData(this.consumableUnits);

        this.resetForm(data, true);
        this.isWaitingInsertOrUpdate = false;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.isWaitingInsertOrUpdate = false;
      }
    );
  
  }

  async updateConsumableUnit(data: NgForm){

    this.isWaitingInsertOrUpdate = true;

    let willUpdateItem = new ConsumableUnit();
    Object.assign(willUpdateItem, this.consumableUnit);
    
    await this.baseService.consumableUnitService.UpdateConsumableUnit(
      this.consumableUnit,
      (_consumableUnit, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.dataTable.TGT_updateData(this.consumableUnit);
        this.isWaitingInsertOrUpdate = false;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.isWaitingInsertOrUpdate = false;
      }
    );
    this.popupComponent.CloseModal('#modalShowQuestionPopupForConsumableUnit');    
  }

  async onDoubleClickItem(item: ConsumableUnit) {

    this.consumableUnit = new ConsumableUnit();
    /* Show spinner for loading */
    this.baseService.spinner.show();

    await this.loadConsumableUnits();

    /* get company information from server */
    await this.baseService.consumableUnitService.GetConsumableUnitById(
      item.ConsumableUnitId,
      (result: ConsumableUnit) => {
        /* then bind it to company model to update */
        setTimeout(() => {
          $("#btnEditConsumableUnit").trigger("click");

          this.baseService.spinner.hide();
          Object.assign(this.consumableUnit, result);
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadConsumableUnits();

    this.isTableRefreshing = false;

  }
}
