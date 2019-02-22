import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { Department } from "../../../models/Department";
import { Location } from "../../../models/Location";
import { BaseService } from "../../../services/base.service";
<<<<<<< HEAD
=======
<<<<<<< HEAD
import { TreeGridTable } from "src/app/extends/TreeGridTable";
import { IData } from "src/app/models/interfaces/IData";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
=======
import { IData } from 'src/app/models/interfaces/IData';
>>>>>>> 1a0d14ab63d320b683271859435e6a1e3026a73a
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../../base/base.component';
import { TreeGridTable } from 'src/app/extends/TreeGridTable';
>>>>>>> d5641220ab0a506be821a8f00666fb6a576b1672

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
<<<<<<< HEAD
export class DepartmentComponent extends TreeGridTable
  implements OnInit, DoCheck {
  insertingDepartment: any = {};
  departments: Department[] = [];
  locations: Location[] = [];

  filter: any = {
    Name: "",
    Description: ""
  };

  order: any = {
    isDesc: false,
    column: "Name"
  };
=======

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
>>>>>>> d5641220ab0a506be821a8f00666fb6a576b1672

  constructor(public baseService: BaseService) {
    super(baseService);

<<<<<<< HEAD
  ngOnInit() {}

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
=======
    this.loadDepartments();

  }

  ngOnInit() { }

  ngDoCheck(): void {
    this.dataTable.TGT_doFilter();
>>>>>>> d5641220ab0a506be821a8f00666fb6a576b1672
  }

  insertDepartment(data: NgForm) {
    this.insertingDepartment = <Department>data.value;
    this.baseService.departmentService.InsertDepartment(
      this.insertingDepartment
    );
  }

  loadDepartments() {
<<<<<<< HEAD
    this.baseService.departmentService.GetDepartments(
      (deps: Department[]) => {
        this.departments = <Department[]>this.convertDataToTree(deps);
        this.TGT_loadData(this.departments);
      },
      (error: HttpErrorResponse) => {
        this.errorManager(error);
      }
    );
  }
  loadDropdownList() {
    this.baseService.userService.GetLocations(
      (locs: Location[]) => {
        this.locations = <Location[]>this.convertDataToTree(locs);
        this.TGT_loadData(this.locations);
      },
      (error: HttpErrorResponse) => {
        this.errorManager(error);
      }
    );
=======
    this.baseService.departmentService.GetDepartments((deps: Department[]) => {

      this.departments = <Department[]>this.dataTable.TGT_convertDataToTree(deps);
      this.dataTable.TGT_loadData(this.departments);

    }, (error: HttpErrorResponse) => {
      this.errorManager(error);
    });
>>>>>>> d5641220ab0a506be821a8f00666fb6a576b1672
  }
}
