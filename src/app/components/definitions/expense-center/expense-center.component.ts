import { Component, OnInit, NgModule } from "@angular/core";
import { BaseComponent } from "src/app/components/base/base.component";
import { BaseService } from "../../../services/base.service";
import { NgForm, ReactiveFormsModule } from "@angular/forms";

import { ExpenseCenter } from "src/app/models/ExpenseCenter";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { HttpErrorResponse } from "@angular/common/http";
import * as $ from "jquery";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

@Component({
  selector: "app-expense-center",
  templateUrl: "./expense-center.component.html",
  styleUrls: ["./expense-center.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [ExpenseCenterComponent],
  providers: [ExpenseCenterComponent]
})
export class ExpenseCenterComponent extends BaseComponent implements OnInit {
  
  isWaitingInsertOrUpdate: boolean = false;
  
  /* Is Table Refreshing */
  isTableRefreshing:boolean = false;

  /* Is Table Exporting */
  isTableExporting:boolean = false;

  expCenters: ExpenseCenter[] = [];

  expenseCenter: ExpenseCenter = new ExpenseCenter();

  public dataTable: TreeGridTable = new TreeGridTable(
    "expensecenter",
    [
      {
        columnDisplayName: "Masraf Yeri Kodu",
        columnName: ["ExpenseCenterCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Masraf Yeri",
        columnName: ["Name"],
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

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.dataTable.isColumnOffsetActive = false;
    this.loadExpenseCenters();
  }

  ngOnInit() {}

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.expenseCenter);
    if (isNewItem == true) {
      this.expenseCenter = new ExpenseCenter();
    }
  }

  OnSubmit(data: NgForm) {

    if (data.form.invalid) return true;

    if (this.expenseCenter.ExpenseCenterId == null) {
      this.addExpenseCenter(data);
    } else {
      this.updateExpenseCenter(data);
    }
  }

  async deleteExpenseCenters() {
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir masraf yeri seçiniz"
      );
      return;
    }

    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {
      this.baseService.spinner.show();

      let itemIds: number[] = selectedItems.map(x => x.getId());

      this.baseService.expenseCenterService.DeleteExpenseCenters(
        itemIds,
        () => {
          this.baseService.spinner.hide();

          if (itemIds.length == 1)
            this.baseService.popupService.ShowSuccessPopup(
              "Kayıt başarıyla silindi!"
            );
          else
            this.baseService.popupService.ShowSuccessPopup(
              "Tüm kayıtlar başarıyla silindi!"
            );

          for (let ii = 0; ii < itemIds.length; ii++) {
            let index = this.expCenters.findIndex(
              x => x.ExpenseCenterId == itemIds[ii]
            );
            if (index > -1) this.expCenters.splice(index, 1);
          }

          this.dataTable.TGT_loadData(this.expCenters);
        },
        (failedItems: NotDeletedItem[], error:HttpErrorResponse) => {
          
          let barcode:ExpenseCenter;

          let notDeletedCode:string[]=[];

          let expensecenters= <ExpenseCenter[]>this.dataTable.TGT_copySource();
          
          /* Hide Loading Spinner */
          this.baseService.spinner.hide();

          failedItems.forEach((e:NotDeletedItem) => {
            for(let i=0; i<itemIds.length; i++){
          barcode = expensecenters.find(x=>x.ExpenseCenterId == e[i].Id);
          }     
            notDeletedCode.push(barcode.ExpenseCenterCode);
          });

          this.baseService.popupService.ShowAlertPopup(
            "Kayıtlar ilişkili olduğundan silinemedi!"
          );

          /* Show error message */
          if(failedItems.length>0)
          this.baseService.popupService.ShowDeletePopup(error,notDeletedCode);
          else
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    });
  }

  async addExpenseCenter(data: NgForm) {
    if (data.value.invalid == true) return;

    this.isWaitingInsertOrUpdate = true;

    await this.baseService.expenseCenterService.InsertExpenseCenter(
      this.expenseCenter,
      (insertedItem: ExpenseCenter, message) => {

        this.baseService.popupService.ShowSuccessPopup(message);
        this.expenseCenter.ExpenseCenterId = insertedItem.ExpenseCenterId;
        
        this.expCenters.push(this.expenseCenter);
        this.dataTable.TGT_loadData(this.expCenters);

        this.resetForm(data, true);
        this.isWaitingInsertOrUpdate = false;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.isWaitingInsertOrUpdate = false;
      }
    );
  }

  async updateExpenseCenter(data: NgForm) {

    if (data.form.invalid == true) return;

    this.isWaitingInsertOrUpdate = true;

    await this.baseService.expenseCenterService.UpdateExpenseCenter(
      this.expenseCenter,
      (_expenseCenter, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.dataTable.TGT_updateData(this.expenseCenter);
        this.isWaitingInsertOrUpdate = false;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.isWaitingInsertOrUpdate = false;
      }
    );
  }

  async loadExpenseCenters() {
    await this.baseService.expenseCenterService.GetExpenseCenters(
      (expCenters: ExpenseCenter[]) => {
        this.expCenters = expCenters;
        this.dataTable.TGT_loadData(this.expCenters);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async onDoubleClickItem(item: ExpenseCenter) {

    this.expenseCenter = new ExpenseCenter();
    /* Show spinner for loading */
    this.baseService.spinner.show();

    await this.loadExpenseCenters();

    /* get company information from server */
    await this.baseService.expenseCenterService.GetExpenseCenterById(
      item.ExpenseCenterId,
      (result: ExpenseCenter) => {
        /* then bind it to company model to update */
        setTimeout(() => {
          $("#btnEditExpenseCenter").trigger("click");

          this.baseService.spinner.hide();
          Object.assign(this.expenseCenter, result);
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

    await this.loadExpenseCenters();

    this.isTableRefreshing = false;

  }

}
