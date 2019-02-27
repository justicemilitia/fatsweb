import { Component, OnInit, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { Department } from "../../../models/Department";
import { Location } from "../../../models/Location";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { BaseComponent } from '../../base/base.component';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import * as $ from "jquery";

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
  department: Department = new Department();

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
        columnDisplayName: 'Lokasyon',
        columnName: 'Location',
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Açıklama',
        columnName: 'Description',
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      Name: '',
      Location: '',
      Description: ''
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

  ngOnInit() {
    this.ResetForm();    
  }

  loadDepartments() {
    this.baseService.departmentService.GetDepartments((deps: Department[]) => {
      this.departments = deps;
      this.dataTable.TGT_loadData(this.departments);
    });
  }

  ResetForm(form?: NgForm) {
    if (form != null) this.ResetForm();
    this.department = new Department();
  }

  OnSubmit(data: NgForm) {
    debugger;
    if (data.value.DepartmentId == null) this.insertDepartment(data);
    else this.updateDepartment(data);
  }

  insertDepartment(data: NgForm) {
    console.log(data.value);
    this.department = <Department>data.value;
    this.baseService.departmentService.InsertDepartment(this.department);
    this.ResetForm();
    this.loadDepartments();
  }

  updateDepartment(data: NgForm) {
    this.department = <Department>data.value;
    this.baseService.departmentService.UpdateDepartment(this.department);
    this.loadDepartments();
  }

  loadDropdownList() {
    this.baseService.locationService.GetLocations(
      locations => (this.locations = locations)
    );
  }

  fillCompanyModal(department: Department) {
    this.baseService.departmentService.GetDepartmentById(result => {
      this.department = result;
    }, department.DepartmentId);
  }

  onDoubleClickItem(item: any) {
    this.baseService.departmentService.GetDepartmentById(result => {
      this.department = result;
    }, item.departmentId);
    console.log();
    $("#btnAddDepartment").trigger("click");
    $("#btnInsertOrUpdateDepartment").html("Güncelle");
  }
}
