import { Component, OnInit } from "@angular/core";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { BaseService } from "src/app/services/base.service";
import { BaseComponent } from "../../base/base.component";
import { Role } from "src/app/models/Role";
import { HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-role",
  templateUrl: "./role.component.html",
  styleUrls: ["./role.component.css"]
})
export class RoleComponent extends BaseComponent implements OnInit {
  public dataTable: TreeGridTable = new TreeGridTable(
    [
      {
        columnDisplayName: "Rol",
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
    {},
    {
      isDesc: false,
      column: "Name"
    }
  );

  public dataTableUserRole: TreeGridTable = new TreeGridTable(
    [
      {
        columnDisplayName: "Rol",
        columnName: "Name",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Kullanıcı",
        columnName: "User",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {},
    {
      isDesc: false,
      column: "Name"
    }
  );

  roles: Role[] = [];
  role: Role = new Role();
  constructor(protected baseService: BaseService) {
    super(baseService);
    this.LoadRoles();
  }

  ngOnInit() {}

  LoadRoles() {
    this.baseService.roleService.GetRoles(
      (roles: Role[]) => {
        this.roles = roles;
        this.dataTable.TGT_loadData(this.roles);
      },
      (error: HttpErrorResponse) => {
        this.errorManager(error);
      }
    );
  }

  OnSubmit(data: NgForm) {
    if (data.value.RoleId == null) this.AddRole(data);
  }

  AddRole(data: NgForm) {
    this.role = <Role>data.value;
    this.baseService.roleService.InsertRole(
      this.role,
      (error: HttpErrorResponse) => {
        this.errorManager(error);
        console.log(error);
      }
    );
  }

  UpdateRole(data: NgForm) {
    this.role = <Role>data.value;
    this.baseService.roleService.UpdateRole(
      this.role,
      (error: HttpErrorResponse) => {
        this.errorManager(error);
      }
    );
    this.baseService.popupService.ShowSuccessPopup();   
  }
}
