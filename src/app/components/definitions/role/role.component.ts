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

  /* Is Table Refreshing */
  isTableRefreshing:boolean = false;

  /* Is Table Exporting */
  isTableExporting:boolean = false;

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
        columnDisplayName: this.getLanguageValue('Description'),
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
        this.getLanguageValue('Choose_at_least_one_role')
      );
      return;
    }

    this.baseService.popupService.ShowQuestionPopupForDelete(() => {
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
            this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('Delete_operation_successful'));
          else
            this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('All_records_deleted'));

           /* Clear all the ids from table */
          this.dataTable.TGT_removeItemsByIds(itemIds);

          /* Copy original source to current locations */
          this.roles = <Role[]>this.dataTable.TGT_copySource();

        },
        (failedItems: []) => {
          this.baseService.spinner.hide();
          this.baseService.popupService.ShowAlertPopup(this.getLanguageValue('Records_couldnt_delete_cause_theyre_related'));
        }
      );
    });
  }

  async loadRoles() {
    this.baseService.roleService.GetRoles(
      (roles: Role[]) => {
        this.roles = roles;
        this.dataTable.TGT_loadData(this.roles);
        if(roles.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
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

    if (data.form.invalid == true) return;

    if (this.role.RoleId == null) 
      this.addRole(data);
    else 
    {
      this.popupComponent.ShowModal('#modalShowQuestionPopupForRole');
      this.popupComponent.CloseModal('#modalRoleDefinition');       
    }
  }

  async addRole(data: NgForm) {

    this.isWaitingInsertOrUpdate = true;

    this.baseService.roleService.InsertRole(
      this.role,
      (insertedItem: Role, message) => {

        this.isWaitingInsertOrUpdate = false;

        this.baseService.popupService.ShowSuccessPopup(message);
        this.role.RoleId = insertedItem.RoleId;

        this.roles.push(this.role);
        this.dataTable.TGT_loadData(this.roles);

        this.resetForm(data, true);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.isWaitingInsertOrUpdate = false;
      }
    );
  }

  async updateRole(data: NgForm) {

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
    this.popupComponent.CloseModal('#modalShowQuestionPopupForRole');    
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

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadRoles();

    this.isTableRefreshing = false;
  }


}
