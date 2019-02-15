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
import { BaseComponent } from '../../base/base.component';
import { BaseService } from '../../../services/base.service';

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
  constructor(
    private formBuilder: FormBuilder,
    public baseService : BaseService
  ) {
    super(baseService);
  }

  insertingDepartment: any={};
  departments: Department[] = [];
  
  ngOnInit() {}
  
  insertDepartment(data: NgForm) {
    console.log(data.value);
    this.insertingDepartment = <Department>data.value;
    this.baseService.departmentService.InsertDepartment(this.insertingDepartment);
  }

  LoadDropdownList() {
    this.baseService.userService.GetDepartments(departments => {
      this.departments = departments;
    });
}
}
