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
import { BaseComponent } from "../../base/base.component";
import RoleAuthorization from "src/app/models/RoleAuthorization";

@Component({
  selector: "app-rol-user",
  templateUrl: "./role-user.component.html",
  styleUrls: ["./role-user.component.css"]
})
export class RoleUserComponent extends BaseComponent implements OnInit {
  isWaitingInsertOrUpdate: boolean = false;

  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;

  userRoles: UserRole[] = [];
  userRole: UserRole = new UserRole();

  roles: Role[] = [];
  role: Role = new Role();

  systemUsers = [];
  selectedUser: User[] = [];
  dropdownSettings = {};
  visible: boolean = true;

  constructor(protected baseService: BaseService) {
    super(baseService);

    this.loadUserRole();
    this.loadSystemUser();
    this.loadRoles();

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

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "UserId",
      textField: "UserMail",
      selectAllText: this.getLanguageValue('Select_All'),
      unSelectAllText: this.getLanguageValue('Clear'),
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  async loadUserRole() {
    await this.baseService.roleUserService.GetUserRole(
      (userRole: UserRole[]) => {
        this.userRoles = userRole;
        this.dataTableUserRole.TGT_loadData(this.userRoles);
        if(this.userRoles.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
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
    if (this.userRole.UserRoleId == null) this.addUserRole(data);
    else this.updateUserRole(data);
  }

  async addUserRole(data: NgForm) {
    if (data.form.invalid == true) return;

    this.isWaitingInsertOrUpdate = true;

    let userIds: number[] = this.selectedUser.map(x => x.UserId);
    this.role.RoleId = Number(data.value.RoleId);
    let role = this.roles.find(x => x.RoleId == this.role.RoleId);
    this.role.RoleId = role.RoleId;

    await this.baseService.roleUserService.InsertUserRole(
      this.role.RoleId,
      userIds,
      (insertedItem: UserRole[], message) => {
        setTimeout(() => {

        this.baseService.popupService.ShowSuccessPopup(message);

        this.resetForm(data, true);

        this.refreshTable();
        
        this.isWaitingInsertOrUpdate = false;
      }, 1000);

      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.isWaitingInsertOrUpdate = false;
      }
    );
  }

  updateUserRole(data: NgForm) {
    if (data.form.invalid == true) return;

    this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {
          this.isWaitingInsertOrUpdate = true;

          this.baseService.roleUserService.UpdateUserRole(
            this.userRole,
            (_company, message) => {
              this.isWaitingInsertOrUpdate = false;

              this.baseService.popupService.ShowSuccessPopup(message);

              let updatedUserRole = new UserRole();
              Object.assign(updatedUserRole, this.userRole);
              this.dataTableUserRole.TGT_updateData(updatedUserRole);

              this.userRoles = <UserRole[]>(
                this.dataTableUserRole.TGT_copySource()
              );
            },
            (error: HttpErrorResponse) => {
              this.baseService.popupService.ShowErrorPopup(error);

              this.isWaitingInsertOrUpdate = false;
            }
          );
        }
      }
    );
  }

  async deleteRoleUser() {
    let selectedItems = this.dataTableUserRole.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
         this.getLanguageValue('Please_choose_at_least_one_record')
      );
      return;
    }

    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {
      this.baseService.spinner.show();

      let itemIds: number[] = selectedItems.map(x => x.getId());

      this.baseService.roleUserService.DeleteRoleUser(
        itemIds,
        () => {
          this.baseService.spinner.hide();

          if (itemIds.length == 1)
            this.baseService.popupService.ShowSuccessPopup(
              this.getLanguageValue('Delete_operation_successful')
            );
          else
            this.baseService.popupService.ShowSuccessPopup(
              this.getLanguageValue('All_records_deleted')
            );

          this.dataTableUserRole.TGT_removeItemsByIds(itemIds);

          this.userRoles = <UserRole[]>this.dataTableUserRole.TGT_copySource();
        },
        (error: HttpErrorResponse) => {
          this.baseService.spinner.hide();

          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    });
  }

  async onDoubleClickItem(item: UserRole) {
    this.userRole = new UserRole();

    this.baseService.spinner.show();

    this.loadRoles();

    this.loadUserRole();

    await this.baseService.roleUserService.GetUserRoleById(
      item.UserRoleId,
      (result: UserRole) => {
        setTimeout(() => {
          $("#btnEditUserRole").trigger("click");
          this.visible = false;
          this.userRole.RoleId = item.RoleId;
          this.userRole.UserId = item.UserId;
          this.userRole.UserRoleId = item.UserRoleId;

          this.baseService.spinner.hide();
          Object.assign(this.userRole, result);
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
  
  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTableUserRole.isLoading = true;

    this.dataTableUserRole.TGT_clearData();

    await this.loadUserRole();

    this.isTableRefreshing = false;

  }
}
