import { Component, OnInit, NgModule } from "@angular/core";
import {
  NgForm,
  ReactiveFormsModule
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
  
  /* Is Table Refreshing */
  isTableRefreshing:boolean = false;

  /* Is Table Exporting */
  isTableExporting:boolean = false;

  roleAuthorizations: RoleAuthorization[] = [];

  roleMenus: Menu[] = [];

  roles: Role[] = [];

  tableRoleAuthorization :RoleAuthorization[] = [];

  public dataTable: TreeGridTable = new TreeGridTable(
    "roleauthorization",
    [
      {
        columnDisplayName: this.getLanguageValue('Menu'),
        columnName: ["Menu","Name"],
        isActive: true,
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Role'),
        columnName: ["Role", "Name"],
        isActive: true,
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Out_Browse'),
        columnName: ["OutBrowse"],
        isActive: true,
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: this.getLanguageValue('Out_Insert'),
        columnName: ["OutInsert"],
        isActive: true,
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: this.getLanguageValue('Out_Edit'),
        columnName: ["OutUpdate"],
        isActive: true,
        classes: ["table-checkbox"],
        placeholder: "",
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: this.getLanguageValue('Out_Delete'),
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


  roleAuthorization:RoleAuthorization = new RoleAuthorization();

  public dataTableRoleAuth: TreeGridTable = new TreeGridTable(
    "menu",
    [
      {
        columnDisplayName: this.getLanguageValue('Menu'),
        columnName: ["Menu","Name"],
        isActive: true,
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Out_Browse'),
        columnName: ["OutBrowse"],
        isActive: true,
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: this.getLanguageValue('Out_Insert'),
        columnName: ["OutInsert"],
        isActive: true,
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: this.getLanguageValue('Out_Edit'),
        columnName: ["OutUpdate"],
        isActive: true,
        type: "checkbox",
        isEditable: true
      },
      {
        columnDisplayName: this.getLanguageValue('Out_Delete'),
        columnName: ["OutDelete"],
        isActive: true,
        type: "checkbox",
        isEditable: true
      }
    ],
    {
      isDesc: false,
      column: ["Menu","Name"]
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
    this.dataTableRoleAuth.isMultipleSelectedActive = false;

  }

  ngOnInit() {}

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.roleAuthorization);
    if (isNewItem == true) {
      this.initRoleAuth();
      this.roleAuthorization = new RoleAuthorization();
    }
  }

  async loadRole() {

    if (this.roles.length > 0) {
      return;
    }

    this.baseService.roleService.GetRoles(
      (roles: Role[]) => {
        this.roles = roles;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadRoleAuth() {

    this.baseService.roleAuthorizationService.GetRoleAuth(
      (roleAuthorization: RoleAuthorization[]) => {
        this.tableRoleAuthorization = roleAuthorization;
        this.dataTable.TGT_loadData(this.tableRoleAuthorization);
        if(roleAuthorization.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadRoleAuthByFirmId() {
    this.baseService.roleAuthorizationService.GetRoleAuthByFirmId(
      (roleMenu: Menu[]) => {
        this.roleMenus = roleMenu;
        this.dataTableRoleAuth.TGT_loadData(this.roleMenus);
        this.initRoleAuth();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async doRoleAuthorization(data: NgForm) {

    if (data.form.invalid == true) return;

    this.isWaitingInsertOrUpdate = true;

    let roleId = Number(data.value.RoleId);
    
    let items = <RoleAuthorization[]>this.dataTableRoleAuth.TGT_copySource();

    await this.baseService.roleAuthorizationService.DoRoleAuthorizations(roleId,items,
      (insertedAuths: any, message) => {

        this.isWaitingInsertOrUpdate = false;

        this.baseService.popupService.ShowSuccessPopup(message);

        if (insertedAuths.RoleAuthorizations) {

          insertedAuths.RoleAuthorizations.forEach((element:RoleAuthorization) => {
            let tableItemIndex = this.tableRoleAuthorization.findIndex(x=>x.MenuId == element.MenuId && x.RoleId == insertedAuths.RoleId);
            if (tableItemIndex > -1) {
              if (element.OutBrowse == false && element.OutDelete == false && element.OutInsert == false && element.OutUpdate == false) {
                this.tableRoleAuthorization.splice(tableItemIndex,1);
              }else {
                let tableItem = this.tableRoleAuthorization[tableItemIndex];
                if (tableItem) {
                  tableItem.OutBrowse = element.OutBrowse;
                  tableItem.OutDelete = element.OutDelete;
                  tableItem.OutInsert = element.OutInsert;
                  tableItem.OutUpdate = element.OutUpdate;
                }
              }
            }else {
              
              if (element.OutBrowse == false && element.OutDelete == false && element.OutInsert == false && element.OutUpdate == false) {
                // Dont Do Anything
              }else {

                let insertItem = new RoleAuthorization();

                let item = {
                  RoleId: insertedAuths.RoleId,
                  MenuId: element.MenuId,
                  Menu: this.roleMenus.find(x=>x.MenuId == element.MenuId),
                  Role: this.roles.find(x=>x.RoleId == insertedAuths.RoleId),
                  OutDelete:element.OutDelete,
                  OutBrowse:element.OutBrowse,
                  OutInsert:element.OutInsert,
                  OutUpdate:element.OutUpdate,
                  RoleAuthorizationId:element.RoleAuthorizationId
                }

                Object.assign(insertItem,item);

                this.tableRoleAuthorization.push(insertItem);

              }
            }
          });

          this.updateRoleAuth(insertedAuths.RoleAuthorizations);

          this.dataTable.TGT_loadData(this.tableRoleAuthorization);
        }

      },(error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.isWaitingInsertOrUpdate = false;
      }
    );
  }

  async deleteRoleAuth(){
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
         this.getLanguageValue('Please_choose_at_least_one_record')
      );
      return;
    }

      // this.baseService.popupService.ShowQuestionPopupForDelete(() => {

        this.baseService.spinner.show();
  
        let itemIds: number[] = (<RoleAuthorization[]>selectedItems).map(x => x.RoleAuthorizationId);  
        this.baseService.roleAuthorizationService.DeleteRoleAuth(
          itemIds,
          () => {
            this.baseService.spinner.hide();  
            if (itemIds.length == 1)
              this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('Delete_operation_successful'));
            else
              this.baseService.popupService.ShowAlertPopup(this.getLanguageValue('All_records_deleted'));
  
            itemIds.forEach(e=> {
              let itemIndex = this.tableRoleAuthorization.findIndex(x=>x.RoleAuthorizationId == e);
              if (itemIndex > -1) {
                this.tableRoleAuthorization.splice(itemIndex,1);
              }
            })
            this.dataTable.TGT_loadData(this.tableRoleAuthorization);
          },
          (error: HttpErrorResponse) => {
            this.baseService.spinner.hide();
  
            this.baseService.popupService.ShowErrorPopup(error);
          }
        );
      this.popupComponent.CloseModal('#modalShowDeletePopupForRoleAuthorization');        
      // });
      
    }  

  // async onDoubleClickItem(item: RoleAuthorization) {

  //   this.baseService.spinner.show();

  //   this.roleAuthorization.RoleId = item.RoleId;

  //   this.loadRole();
  //   this.loadRoleAuth();

  //   this.baseService.roleAuthorizationService.GetRoleAuthListById(item.RoleId,
  //     (result: RoleAuthorization[]) => {
  //       setTimeout(() => {

  //         $("#btnEditRoleAuth").trigger("click");

  //         this.baseService.spinner.hide();

  //         this.updateRoleAuth(result);

  //         this.dataTableRoleAuth.TGT_loadData(this.roleAuthorizations);
          
  //       }, 1000);
  //     },(error: HttpErrorResponse) => {

  //       this.baseService.spinner.hide();

  //       this.baseService.popupService.ShowErrorPopup(error);
  //     });
  // } 

  onChange(item){

    if (!item.target.value || item.target.value == '')
      return;

    this.dataTableRoleAuth.isLoading = true;
    
    this.loadRole();
    this.loadRoleAuth();

    this.baseService.roleAuthorizationService.GetRoleAuthListById(
      item.target.value,
      (result: RoleAuthorization[]) => {
        setTimeout(() => {  

          this.updateRoleAuth(result);
          this.dataTableRoleAuth.TGT_loadData(this.roleAuthorizations); 
         
        }, 1000);
      },
      (error: HttpErrorResponse) => {

        this.dataTable.isLoading = false;

        this.dataTable.errorMessage = this.getLanguageValue('Table_couldnt_load');

        this.baseService.spinner.hide();

        this.baseService.popupService.ShowErrorPopup(error);
        }
      );
  }

  initRoleAuth() {

    this.roleAuthorizations.splice(0);

    this.roleMenus.forEach(e=> {
      
      let roleauthorization = new RoleAuthorization();

      let item = {
        MenuId: e.MenuId,
        Menu: e,
        OutBrowse: false,
        OutDelete: false,
        OutInsert:false,
        OutUpdate:false
      };

      Object.assign(roleauthorization,item)

      this.roleAuthorizations.push(roleauthorization);
    });

    this.dataTableRoleAuth.TGT_loadData(this.roleAuthorizations);

  }

  updateRoleAuth(auths:RoleAuthorization[]) {

    this.initRoleAuth();

    auths.forEach(e=> {
      let item = this.roleAuthorizations.find(p=>p.MenuId == e.MenuId);
      if (item) {
        item.OutBrowse = e.OutBrowse;
        item.OutDelete = e.OutDelete;
        item.OutInsert = e.OutInsert;
        item.OutUpdate = e.OutUpdate;   
        item.RoleAuthorizationId = e.RoleAuthorizationId;     
      }
    });

  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadRoleAuth();

    this.isTableRefreshing = false;

  }

}
