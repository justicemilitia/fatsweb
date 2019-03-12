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

@Component({
  selector: "app-rol-user",
  templateUrl: "./role-user.component.html",
  styleUrls: ["./role-user.component.css"]
})
export class RoleUserComponent extends BaseComponent implements OnInit {
  isWaitingInsertOrUpdate: boolean = false;

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
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 10,
      allowSearchFilter: true
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

  async deleteCompanies() {
    /* get selected items from table */
    let selectedItems = this.dataTableUserRole.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir kayıt seçiniz"
      );
      return;
    }

    /* Show Question Message */
    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {
      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.roleUserService.DeleteRoleUser(
        itemIds,
        () => {
          /* Deactive the spinner */
          this.baseService.spinner.hide();

          /* if all of them removed */
          if (itemIds.length == 1)
            this.baseService.popupService.ShowAlertPopup(
              "Kayıt Başarıyla silindi!"
            );
          else
            this.baseService.popupService.ShowAlertPopup(
              "Tüm kayıtlar başarıyla silindi!"
            );

          /* Clear all the ids from table */
          this.dataTableUserRole.TGT_removeItemsByIds(itemIds);

          /* Get latest companies from table*/
          this.userRoles = <UserRole[]>this.dataTableUserRole.TGT_copySource();
        },
        (error: HttpErrorResponse) => {
          /* Hide Loading Spinner */
          this.baseService.spinner.hide();

          /* Show error message */
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
}
