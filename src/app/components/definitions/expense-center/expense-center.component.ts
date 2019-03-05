import { Component, OnInit, NgModule } from "@angular/core";
import { ExpenseCenterService } from "../../../services/ExpenseCenterService/expense-center.service";
import { BaseComponent } from "src/app/components/base/base.component";
import { LanguageService } from "src/app/services/language-service/language.service";
import { BaseService } from "../../../services/base.service";
import { NgForm, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ExpenseCenter } from "src/app/models/ExpenseCenter";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { HttpErrorResponse } from "@angular/common/http";
@Component({
  selector: "app-expense-center",
  templateUrl: "./expense-center.component.html",
  styleUrls: ["./expense-center.component.css"]
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [ExpenseCenterComponent],
  providers: [ExpenseCenterComponent]
})
export class ExpenseCenterComponent extends BaseComponent implements OnInit {

  expCenters: ExpenseCenter[] = [];
  expenseCenter: ExpenseCenter = new ExpenseCenter();

  public dataTable: TreeGridTable = new TreeGridTable("expensecenter",
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
    this.loadExpenseCenters();
  }

  ngOnInit() {}

  resetForm() {
    this.expenseCenter = new ExpenseCenter();
  }
  
  OnSubmit(data: NgForm) {
    if (data.value.ExpenseCenterId == null) this.addExpenseCenter(data);
    else this.updateExpenseCenter(data);
  }

  async deleteExpenseCenters() {

    let selectedItems = this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup("Lütfen en az bir masraf yeri seçiniz");
      return;
    }

    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {

      this.baseService.spinner.show();

      let itemIds: number[] = selectedItems.map(x => x.getId());

      this.baseService.expenseCenterService.DeleteExpenseCenters(itemIds, (notDeletedItemIds: number[]) => {

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* if any item exists in not deleted items */
        if (notDeletedItemIds) {

          /* Service return us not deleted ids. We will delete ids which exists in notDeletedItemIds number array */
          for (let ii = 0; ii < itemIds.length; ii++) {
            if (notDeletedItemIds.includes(itemIds[ii])) {
              itemIds.splice(ii, 1);
              ii--;
            }
          }

          /* if any value couldnt delete then show popup */
          if (itemIds.length == 0) {
            this.baseService.popupService.ShowAlertPopup("Hiç Bir Kayıt Silinemedi!");
            return;
          }

          /* if some of them is deleted show this */
          if (itemIds.length > 0) {
            this.baseService.popupService.ShowAlertPopup(selectedItems.length.toString() + ' kayıttan ' + itemIds.length.toString() + "'i silinebildi!");
          }

        } else {

          /* if all of them removed */
          this.baseService.popupService.ShowAlertPopup(" Tüm kayıtlar başarıyla silindi!");

        }

        /* Now Delete items from the source */
        for (let ii = 0; ii < itemIds.length; ii++) {
          let index = this.expCenters.findIndex(x => x.ExpenseCenterId == itemIds[ii]);
          if (index > -1) {
            this.expCenters.splice(index, 1);
          }
        }

        /* Reload Page */
        this.dataTable.TGT_loadData(this.expCenters);

      }, (error: HttpErrorResponse) => {

        this.baseService.spinner.hide();
        this.baseService.popupService.ShowErrorPopup(error);

      });

    });
  }
  
  async addExpenseCenter(data: NgForm) {
    if (data.value.invalid == true) return;
    this.expenseCenter = <ExpenseCenter>data.value;
    await this.baseService.expenseCenterService.InsertExpenseCenter(
      this.expenseCenter,
      (data: ExpenseCenter, message) => {
        this.baseService.popupService.ShowErrorPopup(message);
        this.expenseCenter.ExpenseCenterId = data.ExpenseCenterId;
        this.expCenters.push(this.expenseCenter);
        this.resetForm();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async updateExpenseCenter(data: NgForm) {
    if (data.form.invalid == true) return;

    await this.baseService.expenseCenterService.UpdateExpenseCenter(
      this.expenseCenter,
      (_expenseCenter, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.dataTable.TGT_updateData(this.expenseCenter);
        this.resetForm();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
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

    /* Show spinner for loading */
    this.baseService.spinner.show();

    await this.loadExpenseCenters();

    /* get company information from server */
    await this.baseService.expenseCenterService.GetExpenseCenterById(item.ExpenseCenterId, (result: ExpenseCenter) => {

      /* then bind it to company model to update */
      setTimeout(() => {

        /* bind result to model */
        this.expenseCenter = result;
        this.baseService.spinner.hide();

        /* Trigger to model to show it */
        $("#btnAddExpenseCenter").trigger("click");
      }, 1000);

    }, (error: HttpErrorResponse) => {

      /* show error message */
      this.baseService.popupService.ShowErrorPopup(error);

    });

  }
}
