import { Component, OnInit } from "@angular/core";
import { UserRole } from "src/app/models/UserRole";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { BaseService } from "src/app/services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { User } from "src/app/models/LoginUser";
import { Role } from "src/app/models/Role";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-rol-user",
  templateUrl: "./role-user.component.html",
  styleUrls: ["./role-user.component.css"]
})
export class RoleUserComponent implements OnInit {
  users: User[] = [];
  userRole: UserRole[] = [];
  roles: Role[] = [];
  role: Role = new Role();
  systemUsers = [];

  constructor(protected baseService: BaseService) {
    this.loadUserRole();
    this.loadSystemUser();
    this.loadRoles();

    this.dataTableUserRole.isColumnOffsetActive = false;
    this.dataTableUserList.isColumnOffsetActive = false;
  }

  public dataTableUserRole: TreeGridTable = new TreeGridTable(
    "userrole",
    [
      {
        columnDisplayName: "Rol",
        columnName: ["Role", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Kullanıcı",
        columnName: ["User", "UserMail"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Role", "Name"]
    }
  );

  public dataTableUserList: TreeGridTable = new TreeGridTable(
    "userlist",
    [
      {
        columnDisplayName: "Kullanıcı",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  dropdownList = [];
  selectedItems: Role[] = [];
  dropdownSettings = {};
  ngOnInit() {
    this.dropdownList = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: "UserId",
      textField: "UserMail",
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 20,
      allowSearchFilter: true
    };
  }

  async loadUserRole() {
    await this.baseService.roleService.GetUserRole(
      (userRole: UserRole[]) => {
        this.userRole = userRole;
        this.dataTableUserRole.TGT_loadData(this.userRole);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadSystemUser() {
    await this.baseService.roleService.GetUsers(
      (systemUsers: User[]) => {
        this.systemUsers = systemUsers;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadRoles() {
    await this.baseService.roleService.GetRoles(
      (roles: Role[]) => {
        this.roles = roles;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async addUserRole(data: NgForm) {
    if (data.form.invalid == true) return;
    console.log(data);
  }
  onItemSelect(item: Role) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
}
