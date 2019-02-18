import { Component, OnInit, NgModule } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  NgForm
} from "@angular/forms";
import { DepartmentService } from "../../../services/departmentService/department.service";
import { Department } from "../../../models/Department";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";

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
  constructor(public baseService: BaseService) {
    super(baseService);
    this.LoadDepartments();
  }

  insertingDepartment: any = {};
  departmentsInAdd: Department[] = [];
  departments: Department[] = [];

  ngOnInit() {}

  InsertDepartment(data: NgForm) {
    console.log(data.value);
    this.insertingDepartment = <Department>data.value;
    this.baseService.departmentService.InsertDepartment(
      this.insertingDepartment
    );
  }

  LoadDropdownList() {
    this.baseService.departmentService.GetDepartments(departments => {
      this.departmentsInAdd = departments;
    });
  }

  LoadDepartments() {
    debugger;

    this.baseService.departmentService.GetDepartments((deps: Department[]) => {
      deps.forEach(e => {
        let nwDeps: Department[] = this.SubToUp(e, 0);
        nwDeps.forEach(x => {
          this.departments.push(x);
        });
      });
    });
  }

  SubToUp(departments: Department, index: number): Department[] {
    let nwDeps: Department[] = [];
    departments.Name = departments.Name.padStart(
      departments.Name.length + index,
      ">"
    );
    nwDeps.push(departments);
    if (
      departments.InverseParentDepartment &&
      departments.InverseParentDepartment.length > 0
    ) {
      departments.InverseParentDepartment.forEach(e => {
        this.SubToUp(e, index + 5).forEach(x => {
          nwDeps.push(x);
        });
      });
    }
    return nwDeps;
  }
}
