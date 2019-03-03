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

  public dataTable: TreeGridTable = new TreeGridTable(
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

  ResetForm(form?: NgForm) {
    this.expenseCenter = new ExpenseCenter();
  }

  OnSubmit(data: NgForm) {
    if (data.value.ExpenseCenterId == null) this.addExpenseCenter(data);
    else this.UpdateExpenseCenter(data);
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
        this.ResetForm();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async UpdateExpenseCenter(data: NgForm) {
    if (data.form.invalid == true) return;

    await this.baseService.expenseCenterService.UpdateExpenseCenter(
      this.expenseCenter,
      (_expenseCenter, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.dataTable.TGT_updateData(this.expenseCenter);
        this.ResetForm();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
