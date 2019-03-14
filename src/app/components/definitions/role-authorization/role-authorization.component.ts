import { Component, OnInit, NgModule } from "@angular/core";
import {
  NgForm,
  ReactiveFormsModule,
  FormGroup,
  NgModel
} from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "src/app/services/base.service";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { HttpErrorResponse } from "@angular/common/http";
import RoleAuthorization from "src/app/models/RoleAuthorization";
import { Menu } from "src/app/models/Menu";
import { Role } from "src/app/models/Role";

@Component({
  selector: "app-role-authorization",
  templateUrl: "./role-authorization.component.html",
  styleUrls: ["./role-authorization.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [RoleAuthorizationComponent],
  providers: [RoleAuthorizationComponent]
})
export class RoleAuthorizationComponent extends BaseComponent
  implements OnInit {
  isWaitingInsertOrUpdate: boolean = false;

  roleAuthorizations: RoleAuthorization[] = [];
  roleAuthorization: RoleAuthorization = new RoleAuthorization();

  roleMenus: Menu[] = [];
  roleMenu: Menu = new Menu();

  roles: Role[] = [];
  role: Role = new Role();

  RoleAuthArray: RoleAuthorization[] = [];
  visible: boolean = true;

  public dataTable: TreeGridTable = new TreeGridTable(
    "roleauthorization",
    [
      {
        columnDisplayName: "Menü",
        columnName: ["Name"],
        isActive: true,
        type: "text"
      },
      {
        columnDisplayName: "Rol",
        columnName: ["Role", "Name"],
        isActive: true,
        type: "text"
      },
      {
        columnDisplayName: "Görüntüleyebilir",
        columnName: ["OutBrowse"],
        isActive: true,
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: "Ekleyebilir",
        columnName: ["OutInsert"],
        isActive: true,
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: "Düzenleyebilir",
        columnName: ["OutUpdate"],
        isActive: true,
        classes: ["table-checkbox"],
        placeholder: "",
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: "Silebilir",
        columnName: ["OutDelete"],
        isActive: true,
        classes: ["table-checkbox"],
        placeholder: "",
        type: "checkbox",
        isEditable: true
      }
    ],
    {
      isDesc: false,
      column: ["Role", "Name"]
    }
  );

  public dataTableRoleAuth: TreeGridTable = new TreeGridTable(
    "menu",
    [
      {
        columnDisplayName: "Menü",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Görüntüleyebilir",
        columnName: ["OutBrowse"],
        isActive: true,
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: "Ekleyebilir",
        columnName: ["OutInsert"],
        isActive: true,
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: "Düzenleyebilir",
        columnName: ["OutUpdate"],
        isActive: true,
        classes: ["table-checkbox"],
        placeholder: "",
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: "Silebilir",
        columnName: ["OutDelete"],
        isActive: true,
        classes: ["table-checkbox"],
        placeholder: "",
        type: "checkbox",
        isEditable: true
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  public dataTableUpdateAuth: TreeGridTable = new TreeGridTable(
    "roleauthorization",
    [
      {
        columnDisplayName: "Menü",
        columnName: ["Menu", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Görüntüleyebilir",
        columnName: ["OutBrowse"],
        isActive: true,
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: "Ekleyebilir",
        columnName: ["OutInsert"],
        isActive: true,
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: "Düzenleyebilir",
        columnName: ["OutUpdate"],
        isActive: true,
        classes: ["table-checkbox"],
        placeholder: "",
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: "Silebilir",
        columnName: ["OutDelete"],
        isActive: true,
        classes: ["table-checkbox"],
        placeholder: "",
        type: "checkbox",
        isEditable: true
      }
    ],
    {
      isDesc: false,
      column: ["Menu", "Name"]
    }
  );

  constructor(protected baseService: BaseService) {
    super(baseService);

    this.loadRoleAuth();
    this.loadRole();
    this.loadRoleAuthByFirmId();
    this.dataTableRoleAuth.isPagingActive = false;
    this.dataTableRoleAuth.isColumnOffsetActive = false;
    this.dataTable.isColumnOffsetActive = false;
    this.dataTableRoleAuth.isTableEditable = true;
    this.dataTableUpdateAuth.isTableEditable = true;
    this.dataTableUpdateAuth.isColumnOffsetActive = false;
    this.dataTableUpdateAuth.isPagingActive = false;
    this.dataTableRoleAuth.isMultipleSelectedActive = false;
    this.dataTableUpdateAuth.isMultipleSelectedActive = false;
  }

  ngOnInit() {}

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.roleAuthorization);
    if (isNewItem == true) {
      this.roleAuthorization = new RoleAuthorization();
    }
  }

  onSubmit(data: NgForm) {
    if (data.value.RoleAuthorizationId == null) this.addRoleAuthorization(data);
    else this.updateRoleAuthorization(data);
  }

  async loadRole() {
    await this.baseService.roleService.GetRoles(
      (roles: Role[]) => {
        this.roles = roles;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadRoleAuth() {
    await this.baseService.roleAuthorizationService.GetRoleAuth(
      (roleAuthorization: RoleAuthorization[]) => {
        this.roleAuthorizations = roleAuthorization;
        this.dataTable.TGT_loadData(this.roleAuthorizations);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadRoleAuthByFirmId() {
    await this.baseService.roleAuthorizationService.GetRoleAuthByFirmId(
      (roleMenu: Menu[]) => {
        this.roleMenus = roleMenu;
        this.dataTableRoleAuth.TGT_loadData(this.roleMenus);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async addRoleAuthorization(data: NgForm) {
    if (data.form.invalid == true) return;

    this.isWaitingInsertOrUpdate = true;

    this.roleAuthorization.RoleId = Number(data.value.RoleId);
    let role = this.roles.find(x => x.RoleId == this.roleAuthorization.RoleId);
    this.roleAuthorization.Role = role;

    let items = this.dataTableRoleAuth.TGT_copySource();

    this.RoleAuthArray = <RoleAuthorization[]>items;

    this.RoleAuthArray.forEach(e => {
      let role: RoleAuthorization = new RoleAuthorization();

      if (e.OutInsert == null) {
        e.OutInsert = role.OutInsert;
      }
      if (e.OutUpdate == null) {
        e.OutUpdate = role.OutUpdate;
      }
      if (e.OutDelete == null) {
        e.OutDelete = role.OutDelete;
      }
      if (e.OutBrowse == null) {
        e.OutBrowse = role.OutBrowse;
      }
    });

    await this.baseService.roleAuthorizationService.InsertRoleAuth(
      this.roleAuthorization.RoleId,
      this.RoleAuthArray,
      (insertedAuth: RoleAuthorization, message) => {
        this.isWaitingInsertOrUpdate = false;

        this.baseService.popupService.ShowSuccessPopup(message);

        this.roleAuthorization.RoleAuthorizationId = insertedAuth.RoleAuthorizationId;
        this.roleAuthorizations.push(this.roleAuthorization);
        this.dataTable.TGT_loadData(this.roleAuthorizations);

        this.resetForm(data, true);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.isWaitingInsertOrUpdate = false;
      }
    );
  }

  async updateRoleAuthorization(data: NgForm) {
    if (data.form.invalid == true) return;

    await this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {
          this.isWaitingInsertOrUpdate = true;

          this.baseService.roleAuthorizationService.UpdateRoleAuth(
            this.roleAuthorization.RoleId,
            this.RoleAuthArray,
            (roleId: number, updatedAuth: RoleAuthorization, message) => {
              this.isWaitingInsertOrUpdate = false;

              this.baseService.popupService.ShowSuccessPopup(message);

              let updateRoleAuth = new RoleAuthorization();
              Object.assign(updateRoleAuth, this.RoleAuthArray);
              this.dataTableUpdateAuth.TGT_updateData(updateRoleAuth);

              this.RoleAuthArray = <RoleAuthorization[]>(
                this.dataTableRoleAuth.TGT_copySource()
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

  async onDoubleClickItem(item: RoleAuthorization) {
    this.visible = false;
    this.roleAuthorization = new RoleAuthorization();

    this.baseService.spinner.show();

    this.loadRole();
    this.loadRoleAuth();

    await this.baseService.roleAuthorizationService.GetRoleAuthListById(
      item.RoleId,
      (result: RoleAuthorization[]) => {
        setTimeout(() => {
          $("#btnEditRoleAuth").trigger("click");

          this.baseService.spinner.hide();

          this.RoleAuthArray = result;
          this.dataTableUpdateAuth.TGT_loadData(this.RoleAuthArray);
          Object.assign(this.roleAuthorization, item);
          console.log(this.roleAuthorization);
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        this.baseService.spinner.hide();

        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
