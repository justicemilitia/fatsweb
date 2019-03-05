import { Component, OnInit } from "@angular/core";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { BaseService } from "src/app/services/base.service";
import { BaseComponent } from "../../base/base.component";
import { Role } from "src/app/models/Role";
import { HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { User } from 'src/app/models/User';
import{NgMultiSelectDropDownModule}  from 'ng-multiselect-dropdown';

@Component({
  selector: "app-role",
  templateUrl: "./role.component.html",
  styleUrls: ["./role.component.css"]
})
export class RoleComponent extends BaseComponent implements OnInit {
<<<<<<< HEAD

  roles: Role[] = [];
  role: Role = new Role();
  users:User[]=[];

  public dataTable: TreeGridTable = new TreeGridTable(
    "role",
=======
  public dataTable: TreeGridTable = new TreeGridTable("role",
>>>>>>> e50ba0cb872a4c4f6fe0e00a3a7cc7a799b97ca0
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

  public dataTableUserRole: TreeGridTable = new TreeGridTable("role",
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
        columnDisplayName: "Kullanıcı",
        columnName: ["User"],
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
  dropdownSettings = {};
  constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadRoles();
  }

  ngOnInit() { this.dropdownSettings = {
    singleSelection: false,
    idField: 'role.RoleId',
    textField: 'role.Name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };}

  async deleteRoles() {
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir rol seçiniz"
      );
      return;
    }

    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {
      this.baseService.spinner.show();

      let itemIds: number[] = selectedItems.map(x => x.getId());

      this.baseService.roleService.DeleteRoles(
        itemIds,
        (notDeletedItemIds: number[]) => {
          /* Deactive the spinner */
          this.baseService.spinner.hide();

          /* if any item exists in not deleted items */
          if (notDeletedItemIds) {
            /* Service return us not deleted ids. We will delete ids which exists in notDeletedItemIds number array */
            for (let ii = 0; ii < itemIds.length; ii++) {
              if (notDeletedItemIds.includes(itemIds[ii])) {
                itemIds.splice(ii, 1);
                ii--;
              }
            }

            /* if any value couldnt delete then show popup */
            if (itemIds.length == 0) {
              this.baseService.popupService.ShowAlertPopup(
                "Hiç Bir Kayıt Silinemedi!"
              );
              return;
            }

            /* if some of them is deleted show this */
            if (itemIds.length > 0) {
              this.baseService.popupService.ShowAlertPopup(
                selectedItems.length.toString() +
                  " kayıttan " +
                  itemIds.length.toString() +
                  "'i silinebildi!"
              );
            }
          } else {
            /* if all of them removed */
            this.baseService.popupService.ShowAlertPopup(
              " Tüm kayıtlar başarıyla silindi!"
            );
          }

          /* Now Delete items from the source */
          for (let ii = 0; ii < itemIds.length; ii++) {
            let index = this.roles.findIndex(x => x.RoleId == itemIds[ii]);
            if (index > -1) {
              this.roles.splice(index, 1);
            }
          }

          /* Reload Page */
          this.dataTable.TGT_loadData(this.roles);
        },
        (error: HttpErrorResponse) => {
          this.baseService.spinner.hide();
          this.baseService.popupService.ShowErrorPopup(error);
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

  async loadUser(){
    debugger;
    await this.baseService.userService.GetUsers((users:User[])=>{
      this.users=users; 
    },(error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    })
  }

  resetForm() {
    this.role = new Role();
  }

  OnSubmitRole(data: NgForm) {
    if (data.value.RoleId == null) this.addRole(data);
    else this.updateRole(data);
  }

  async addRole(data: NgForm) {
    if (data.form.invalid == true) return;
    this.role = <Role>data.value;
    await this.baseService.roleService.InsertRole(
      this.role,
      (data: Role, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.roles.push(data);
        this.resetForm();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async updateRole(data: NgForm) {
    if (data.form.invalid == true) return;
    await this.baseService.roleService.UpdateRole(
      this.role,
      (_role, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.dataTable.TGT_updateData(this.role);
        this.resetForm();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
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

          /* Trigger to model to show it */
          $("#btnAddRoleAuth").trigger("click");
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
    debugger;
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
}
