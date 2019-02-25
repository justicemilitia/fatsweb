import { Component, OnInit, NgModule } from "@angular/core";
import { ExpenseCenterService } from "../../../services/ExpenseCenterService/expense-center.service";
import { BaseComponent } from "src/app/components/base/base.component";
import { LanguageService } from "src/app/services/language-service/language.service";
import { BaseService } from "../../../services/base.service";
import {
  NgForm,
  FormsModule,
  ReactiveFormsModule
} from "@angular/forms";
import { ExpenseCenter } from "src/app/models/ExpenseCenter";
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
  
  constructor(
    protected baseService: BaseService,
  ) {
    super(baseService);
    this.LoadExpenseCenters();
  }

  ngOnInit() {}

  LoadExpenseCenters() {
    this.baseService.expenseCenterService.GetExpenseCenters(
      (expenseCenter: ExpenseCenter[]) => {
        expenseCenter.forEach(e => {
          this.expCenters.push(e);
        });
      }
    );
  }

  ResetForm(form?: NgForm){
    if(form!=null)
    this.ResetForm();
    this.expenseCenter=new ExpenseCenter();
  }

  OnSubmit(data: NgForm) {
    if (data.value.ExpenseCenterId == null) this.AddExpenseCenter(data);
    else this.UpdateExpenseCenter(data);
    this.LoadExpenseCenters();
    this.ResetForm();
  }

  AddExpenseCenter(data: NgForm) {
    debugger;
    this.expenseCenter = <ExpenseCenter>data.value;
    this.baseService.expenseCenterService.InsertExpenseCenter(
      this.expenseCenter
    );
  }

  UpdateExpenseCenter(data: NgForm) {
    this.expenseCenter = <ExpenseCenter>data.value;
    this.baseService.expenseCenterService.UpdateExpenseCenter(
      this.expenseCenter
    );
  }

  FillCompanyModal(expenseCenter: ExpenseCenter) {
    this.baseService.expenseCenterService.GetExpenseCenteryId(result => {
      this.expenseCenter = result;
    }, expenseCenter.ExpenseCenterId);
  }

}
