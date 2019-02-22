import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  NgForm
} from "@angular/forms";
import { Department } from "../../../models/Department";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../../base/base.component';
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

export class DepartmentComponent extends BaseComponent implements OnInit, DoCheck {

  insertingDepartment: any = {};
  departments: Department[] = [];

  public dataTable: TreeGridTable = new TreeGridTable(
    [
      {
        columnDisplayName: 'İsim',
        columnName: 'Name',
        isActive: true
      },
      {
        columnDisplayName: 'Açıklama',
        columnName: 'Description',
        isActive: true
      }
    ],
    {
      Name: '',
      Description: ''
    },
    {
      isDesc: false,
      column: 'Name'
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);

    this.loadDepartments();

  }

  ngOnInit() { }

  ngDoCheck(): void {
    this.dataTable.TGT_doFilter();
  }

  insertDepartment(data: NgForm) {

    this.insertingDepartment = <Department>data.value;
    this.baseService.departmentService.InsertDepartment(this.insertingDepartment);

  }

  loadDepartments() {
    this.baseService.departmentService.GetDepartments((deps: Department[]) => {

      this.departments = <Department[]>this.dataTable.TGT_convertDataToTree(deps);
      this.dataTable.TGT_loadData(this.departments);

    }, (error: HttpErrorResponse) => {
      this.errorManager(error);
    });
  }
}
