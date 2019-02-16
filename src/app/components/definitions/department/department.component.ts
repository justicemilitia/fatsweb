import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  NgForm
} from "@angular/forms";
import { Department } from "../../../models/Department";
import { BaseService } from "../../../services/base.service";
import { TreeGridTable } from 'src/app/extends/TreeGridTable';

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

export class DepartmentComponent extends TreeGridTable implements OnInit,DoCheck {

  insertingDepartment: any = {};
  departments: Department[] = [];
  
  filter = {
    Name:'',
    Description:''
  };

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadDepartments();
  }

  ngOnInit() {}

  ngDoCheck(): void {
    this.doFilter();  
  }

  doFilter() {
    let filtered = this.searchInData(this.departments,this.filter);
    this.loadData(filtered);
  }

  insertDepartment(data: NgForm) {

    this.insertingDepartment = <Department>data.value;
    this.baseService.departmentService.InsertDepartment(this.insertingDepartment);

  }

  loadDepartments() {
    this.baseService.departmentService.GetDepartments((deps:Department[]) => {
      
      this.departments = <Department[]>this.doParentAndChild(deps);
      this.loadData(this.departments);

    });
  }

}
