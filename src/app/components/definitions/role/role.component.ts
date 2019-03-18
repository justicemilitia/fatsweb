import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { BaseService } from "src/app/services/base.service";
import { BaseComponent } from "../../base/base.component";

import { Role } from "src/app/models/Role";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { User } from "src/app/models/User";
import { UserRole } from "src/app/models/UserRole";
import * as $ from "jquery";

@Component({
  selector: "app-role",
  templateUrl: "./role.component.html",
  styleUrls: ["./role.component.css"]
})
export class RoleComponent extends BaseComponent implements OnInit {
  isWaitingInsertOrUpdate: boolean = false;

  roles: Role[] = [];
  role: Role = new Role();

  users: User[] = [];

  userRole: UserRole[] = [];

  public dataTable: TreeGridTable = new TreeGridTable(
    "role",
    [
      {
        columnDisplayName: "Rol",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Açıklama",
        columnName: ["Description"],
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

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadRoles();
    this.dataTable.isColumnOffsetActive = false;
  }

  ngOnInit() {}

  async deleteRoles() {
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir rol seçiniz"
      );
      return;
    }

    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {
      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.roleService.DeleteRoles(
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
          for (let ii = 0; ii < itemIds.length; ii++) {
            let index = this.roles.findIndex(x => x.RoleId == itemIds[ii]);
            if (index > -1) this.roles.splice(index, 1);
          }

          /* Reload Page */
          this.dataTable.TGT_loadData(this.roles);
        },
        (failedItems: []) => {
          this.baseService.spinner.hide();
          this.baseService.popupService.ShowAlertPopup(
            "Kayıtlar ilişkili olduğundan silinemedi!"
          );
        }
      );
    });
  }

  async loadRoles() {
    await this.baseService.roleService.GetRoles(
      (roles: Role[]) => {
        this.roles = roles;
        this.dataTable.TGT_loadData(this.roles);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.role);
    if (isNewItem == true) {
      this.role = new Role();
    }
  }

  OnSubmitRole(data: NgForm) {
    if (data.value.RoleId == null) this.addRole(data);
    else this.updateRole(data);
  }

  async addRole(data: NgForm) {
    if (data.form.invalid == true) return;

    this.isWaitingInsertOrUpdate = true;

    await this.baseService.roleService.InsertRole(
      this.role,
      (insertedItem: Role, message) => {

        this.baseService.popupService.ShowSuccessPopup(message);
        this.role.RoleId = insertedItem.RoleId;

        this.roles.push(this.role);
        //this.dataTable.TGT_loadData(this.roles);

        this.resetForm(data, true);
        this.isWaitingInsertOrUpdate = false;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.isWaitingInsertOrUpdate = false;
      }
    );
  }

  async updateRole(data: NgForm) {
    if (data.form.invalid == true) return;

    this.isWaitingInsertOrUpdate = true;

    await this.baseService.roleService.UpdateRole(
      this.role,
      (_role, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.dataTable.TGT_updateData(this.role);
        
        this.resetForm(data, true);
        this.isWaitingInsertOrUpdate = false;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.isWaitingInsertOrUpdate = false;
      }
    );
  }

  async onDoubleClickItem(item: Role) {
    /* Show spinner for loading */
    this.baseService.spinner.show();

    await this.loadRoles();

    await this.baseService.roleService.GetRoleById(
      item.RoleId,
      (result: Role) => {
        setTimeout(() => {
          this.role = result;
          this.baseService.spinner.hide();

          $("#btnEditRoleAuth").trigger("click");
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  dropdownList = [];
  selectedItems = [];

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

}
