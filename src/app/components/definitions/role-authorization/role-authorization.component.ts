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
import { Role } from 'src/app/models/Role';

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
export class RoleAuthorizationComponent extends BaseComponent implements OnInit {

  isWaitingInsertOrUpdate: boolean = false;

  roleAuthorizations: RoleAuthorization[] = [];
  roleAuthorization: RoleAuthorization = new RoleAuthorization();

  roleMenus: Menu[] = [];
  roleMenu: Menu = new Menu();

  roles: Role[] = [];  
  role: Role = new Role();

  RoleAuthArray: RoleAuthorization[] = [];

  constructor(protected baseService: BaseService) {

    super(baseService);
    
    this.loadRoleAuth();   

    this.dataTableRoleAuth.isPagingActive = false;
    this.dataTableRoleAuth.isColumnOffsetActive = false;
    this.dataTable.isColumnOffsetActive = false;
    this.dataTableRoleAuth.isTableEditable = true;
  }

  public dataTable: TreeGridTable = new TreeGridTable(
    "roleauthorization",
    [
      {
        columnDisplayName: "Menü",
        columnName: ["Menu", "Name"],
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

  ngOnInit() {}

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

  loadRoleAuth() {
    this.baseService.roleAuthorizationService.GetRoleAuth(
      (roleAuthorization: RoleAuthorization[]) => {
        this.roleAuthorizations = roleAuthorization;
        this.dataTable.TGT_loadData(this.roleAuthorizations);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadRoleAuthByFirmId() {
    this.baseService.roleAuthorizationService.GetRoleAuthByFirmId(
      (roleMenu: Menu[]) => {
        this.roleMenus = roleMenu;
        this.dataTableRoleAuth.TGT_loadData(this.roleMenus);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  AddRoleAuthorization() {

    this.isWaitingInsertOrUpdate = true;
    
    let items = this.dataTableRoleAuth.TGT_copySource();
    this.RoleAuthArray=<RoleAuthorization[]>items;
    console.log(this.RoleAuthArray);
    this.baseService.roleAuthorizationService.addRoleAuth(
      this.RoleAuthArray,
      () => {},
      () => {}
    );
  }
}
