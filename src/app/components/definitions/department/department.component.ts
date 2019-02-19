import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  NgForm
} from "@angular/forms";
import { Department } from "../../../models/Department";
import { BaseService } from "../../../services/base.service";
import { TreeGridTable } from 'src/app/extends/TreeGridTable';
import { IData } from 'src/app/models/interfaces/IData';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { IColumn } from 'src/app/models/interfaces/IColumn';
import { Column } from 'src/app/models/Column';

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

export class DepartmentComponent extends TreeGridTable implements OnInit, DoCheck {

  insertingDepartment: any = {};
  departments: Department[] = [];

  filter: any = {
    Name: '',
    Description: ''
  };

  order: any = {
    isDesc: false,
    column: 'Name'
  }

  constructor(public baseService: BaseService) {
    super(baseService);
    
    this.TGT_loadColumns([
      {
        columnDisplayName: 'İsim',
        columnName: 'Name',
        isActive: true
      },
      {
        columnDisplayName: 'Açıklama',
        columnName: 'Description',
        isActive: false
      }
    ]);
    
    this.loadDepartments();
  }

  ngOnInit() { }

  ngDoCheck(): void {
    this.doFilter();
  }

  //#region Grid Methods

  doFilter() {
    this.TGT_doFilter(this.departments, this.filter);
  }

  doOrder(column: string) {
    this.order.isDesc = !this.order.isDesc;
    this.order.column = column;
    this.TGT_doOrder(this.departments, this.filter, this.order);
  }

  doCollapse(data: IData) {
    data.isExtended = !data.isExtended;
    this.TGT_loadData(this.departments);
  }

  //#endregion

  insertDepartment(data: NgForm) {

    this.insertingDepartment = <Department>data.value;
    this.baseService.departmentService.InsertDepartment(this.insertingDepartment);

  }

  loadDepartments() {
    this.baseService.departmentService.GetDepartments((deps: Department[]) => {

      this.departments = <Department[]>this.convertDataToTree(deps);
      this.TGT_loadData(this.departments);

    }, (error: HttpErrorResponse) => {
      this.errorManager(error);
    });
  }
}
