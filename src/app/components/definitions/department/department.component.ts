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
    this.loadDepartments();
  }

  insertingDepartment: any = {};
  departmentsInAdd: Department[] = [];
  departments: Department[] = [];

  ngOnInit() {}

  insertDepartment(data: NgForm) {
    console.log(data.value);
    this.insertingDepartment = <Department>data.value;
    this.baseService.departmentService.InsertDepartment(
      this.insertingDepartment
    );
  }

  LoadDropdownList() {
    this.baseService.userService.GetDepartments(departments => {
      this.departmentsInAdd = departments;
    });
  }

  loadDepartments() {
    debugger;
    
    this.baseService.departmentService.GetDepartments((deps:Department[]) => {
      deps.forEach((e) => {
        let nwDeps:Department[] = this.subToUp(e,0);
        nwDeps.forEach(x=>{
          this.departments.push(x);
        });
      })
    });
  }

  subToUp(departments:Department,index:number):Department[] {
    let nwDeps:Department[] = [];
    departments.Name = departments.Name.padStart(departments.Name.length + index,">");
    nwDeps.push(departments);
    if (departments.InverseParentDepartment && departments.InverseParentDepartment.length > 0) {
      departments.InverseParentDepartment.forEach(e=> {      
        this.subToUp(e,index + 5).forEach(x=> {
          nwDeps.push(x);
        });
      });
    }
    return nwDeps;
  }

}
