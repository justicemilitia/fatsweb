import { Component, OnInit } from "@angular/core";
import { UserRole } from "src/app/models/UserRole";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { BaseService } from "src/app/services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Role } from "src/app/models/Role";
import { NgForm } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { User } from "src/app/models/User";
import * as $ from "jquery";
import { userInfo } from 'os';

@Component({
  selector: "app-rol-user",
  templateUrl: "./role-user.component.html",
  styleUrls: ["./role-user.component.css"]
})
export class RoleUserComponent implements OnInit {
  isWaitingInsertOrUpdate: boolean = false;

  users: User[] = [];
  user:User=new User();
  userRoles: UserRole[] = [];
  userRole: UserRole = new UserRole();
  roles: Role[] = [];
  role: Role = new Role();
  systemUsers = [];

  constructor(protected baseService: BaseService) {
    this.loadUserRole();
    this.loadSystemUser();

    this.dataTableUserRole.isColumnOffsetActive = false;
  }

  public dataTableUserRole: TreeGridTable = new TreeGridTable(
    "userrole",
    [
      {
        columnDisplayName: "Kullanıcı",
        columnName: ["User", "UserMail"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Rol",
        columnName: ["Role", "Name"],
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

  selectedUser: User[] = [];
  dropdownSettings = {};

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "UserId",
      textField: "UserMail",
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 15,
      allowSearchFilter: true,      
    };
  }

  async loadUserRole() {
    await this.baseService.roleUserService.GetUserRole(
      (userRole: UserRole[]) => {
        this.userRoles = userRole;
        this.dataTableUserRole.TGT_loadData(this.userRoles);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadSystemUser() {
    await this.baseService.roleUserService.GetSystemUsers(
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

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.userRole);
    if (isNewItem == true) {
      this.userRole = new UserRole();
    }
  }

  onSubmit(data: NgForm) {
    if (data.value.UserRoleId == null) this.addUserRole(data);
  }

  async addUserRole(data: NgForm) {
    if (data.form.invalid == true) return;
    this.isWaitingInsertOrUpdate = true;

    let userIds: number[] = this.selectedUser.map(x => x.UserId);
    this.role.RoleId = Number(data.value.RoleId);
    let role = this.roles.find(x => x.RoleId == this.role.RoleId);
    this.role.RoleId = role.RoleId;

    this.baseService.roleUserService.InsertUserRole(
      this.role.RoleId,
      userIds,
      (insertedItem: UserRole, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.userRole.UserRoleId = insertedItem.UserRoleId;

        this.userRoles.push(this.userRole);
        this.dataTableUserRole.TGT_loadData(this.userRoles);

        this.resetForm(data, true);
        this.isWaitingInsertOrUpdate = false;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.isWaitingInsertOrUpdate = false;
      }
    );
  }

  onDoubleClickItem(item: UserRole) {
    this.userRole=new UserRole();

    this.baseService.spinner.show();

    this.loadUserRole();

    this.baseService.roleUserService.GetUserRoleById(
      item.UserRoleId,
      (result: UserRole) => {
        setTimeout(() => {

          $("btnEditUserRole").trigger("click");
          
          this.baseService.spinner.hide();
          
          Object.assign(this.userRole,result);
          this.onItemSelect(this.user);
      
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        this.baseService.spinner.hide();

        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
  onItemSelect(item: User) {
    this.selectedUser.push(item);
  }
  onSelectAll(items: any) {
    this.selectedUser.push(items);
  }
}
