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
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
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
      },
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );
  constructor(
    protected baseService: BaseService,
  ) {
    super(baseService);
    this.LoadExpenseCenters();
  }

  ngOnInit() {}

  LoadExpenseCenters() {
    this.baseService.expenseCenterService.GetExpenseCenters(
      (expCenters: ExpenseCenter[]) => {
        this.expCenters = expCenters;
        this.dataTable.TGT_loadData(this.expCenters);
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
