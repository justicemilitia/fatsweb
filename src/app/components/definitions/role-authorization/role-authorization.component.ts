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
  roleAuthorizations: RoleAuthorization[] = [];
  roleAuthorization: RoleAuthorization = new RoleAuthorization();

  constructor(protected baseService: BaseService) {
    super(baseService); 
    this.loadRoleAuth();
    //this.dataTableRoleAuth.isFilterActive=false;
    this.dataTableRoleAuth.isPagingActive=false;
    this.dataTableRoleAuth.isColumnOffsetActive=false;
    this.dataTable.isColumnOffsetActive=false;
  }

  public dataTable: TreeGridTable = new TreeGridTable(
    "roleauthorization",
    [     
      {
        columnDisplayName: "Menü",
        columnName: ["Menu","Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Rol",
        columnName: ["Role","Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Görüntüleyebilir",
        columnName: ["OutBrowse"],
        isActive: true,
        classes: ["table-checkbox"],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Ekleyebilir",
        columnName: ["OutInsert"],
        isActive: true,
        classes: ["table-checkbox"],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Düzenleyebilir",
        columnName: ["OutUpdate"],
        isActive: true,
        classes: ["table-checkbox"],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Silebilir",
        columnName: ["OutDelete"],
        isActive: true,
        classes: ["table-checkbox"],
        placeholder: "",
        type: "checkbox"
      }
    ],
    {
      isDesc: false,
      column: ["Role","Name"]
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
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Ekleyebilir",
        columnName: ["OutInsert"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Düzenleyebilir",
        columnName: ["OutUpdate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Silebilir",
        columnName: ["OutDelete"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  ngOnInit() {}

  loadRoleAuth() {
    debugger;
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




}
