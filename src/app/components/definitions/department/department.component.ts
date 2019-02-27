import { Component, OnInit, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { Department } from "../../../models/Department";
import { Location } from "../../../models/Location";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { BaseComponent } from "../../base/base.component";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";

@Component({
  selector: "app-department",
  templateUrl: "./department.component.html",
  styleUrls: ["./department.component.css"]
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [DepartmentComponent],
  providers: [DepartmentComponent]
})
export class DepartmentComponent extends BaseComponent implements OnInit {
  insertingDepartment: any = {};
  departments: Department[] = [];
  locations: Location[] = [];

  public dataTable: TreeGridTable = new TreeGridTable(
    [
      {
        columnDisplayName: "İsim",
        columnName: "Name",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Açıklama",
        columnName: "Description",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      Name: "",
      Description: ""
    },
    {
      isDesc: false,
      column: "Name"
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);

    this.loadDepartments();
  }

  ngOnInit() {}

  insertDepartment(data: NgForm) {
    this.insertingDepartment = <Department>data.value;
    this.baseService.departmentService.InsertDepartment(
      this.insertingDepartment
    );
  }

  loadDepartments() {
    this.baseService.departmentService.GetDepartments(
      (deps: Department[]) => {
        this.departments = deps;
        this.dataTable.TGT_loadData(this.departments);
      },
      (error: HttpErrorResponse) => {
        this.errorManager(error);
      }
    );
  }

  onDoubleClickItem(item: any) {
    console.log(item);
  }
}
