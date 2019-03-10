import { Component, OnInit, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Department } from "../../../models/Department";
import { Role } from "../../../models/Role";
import { Firm } from "../../../models/Firm";
import { User } from "../../../models/User";
import { Location } from "../../../models/Location";
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [UserComponent],
  providers: [UserComponent]
})
export class UserComponent extends BaseComponent implements OnInit {


  /* Is Request send and waiting for response ? */
  isWaitingInsertOrUpdate: boolean = false;

  /* Store the current edit user */
  currentUser: User = new User();

  /* Store all the table users */
  users: User[] = [];

  /* Store the departments to inser users */
  departments: Department[] = [];

  /* Store the locations to insert users */
  locations: Location[] = [];

  /* Store the roles to insert users */
  roles: Role[] = [];

  /* Store firms to insert users */
  firms: Firm[] = [];

  /* Data Table instance */
  public dataTable: TreeGridTable = new TreeGridTable("user",
    [
      {
        columnDisplayName: 'İsim',
        columnName: ['FirstName'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Soyisim',
        columnName: ['LastName'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Unvan',
        columnName: ['UserTitle'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Firma',
        columnName: ['Firm', 'Name'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Lokasyon',
        columnName: ['Location', 'Name'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Departman',
        columnName: ['Department', 'Name'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Telefon',
        columnName: ['PhoneNumber'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'E-mail',
        columnName: ['UserMail'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Açıklama',
        columnName: ['Description'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      }
    ],
    {
      isDesc: false,
      column: ['FirstName']
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadUsers();
  }
  ngOnInit() { }

  resetForm(data: NgForm, isNewItem: boolean) {
    /* Reset modal form then reload lists */
    data.resetForm(this.currentUser);
    this.loadDropdownList();
    if (isNewItem == true) {
      this.currentUser = new User();
    }

  }

  onSubmit(data: NgForm) {
    /* if company id exists means update it otherwise insert it */
    if (data.value.CompanyId == null) {
      this.insertUser(data);
    } else {
      this.updateUser(data);
    }
  }

  async insertUser(data: NgForm) {

    /* Form Validation */
    if (data.invalid == true) return;

    /* Object bindings to store in datatable */
    this.currentUser.Role = this.roles.find(x => x.RoleId == this.currentUser.RoleId);
    this.currentUser.Firm = this.firms.find(x => x.FirmId == this.currentUser.FirmId);
    this.currentUser.Department = this.departments.find(x => x.DepartmentId == this.currentUser.DepartmentId);
    this.currentUser.Location = this.locations.find(x => x.LocationId == this.currentUser.LocationId);
    this.currentUser.ParentUser = this.users.find(x => x.UserId == this.currentUser.ParentUserId);

    /* Say user to wait */
    this.isWaitingInsertOrUpdate = true;

    /* insert into service */
    this.baseService.userService.InsertUser(this.currentUser,
      (insertedUser: User, message: string) => {

        /* Change loading bar status */
        this.isWaitingInsertOrUpdate = false;

        /* Show popup for success */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Inserted user id matches with current user to add it to table */
        this.currentUser.UserId = insertedUser.UserId;

        /* Load Table */
        this.users.push(this.currentUser);
        this.dataTable.TGT_loadData(this.users);

        /* Reset form */
        this.resetForm(data, true);

      }, (error: HttpErrorResponse) => {

        /* Change loading bar status */
        this.isWaitingInsertOrUpdate = false;

        /* Show failed message */
        this.baseService.popupService.ShowErrorPopup(error);

      });
  }

  async updateUser(data: NgForm) {

    /* Check model state */
    if (data.form.invalid == true) return;

    /* Ask for approve question if its true then update the location */
    await this.baseService.popupService.ShowQuestionPopupForUpdate((response: boolean) => {

      if (response == true) {

        /* Object bindings to store in datatable */
        let role = this.roles.find(x => x.RoleId == this.currentUser.RoleId);
        let firm = this.firms.find(x => x.FirmId == this.currentUser.FirmId);
        let department = this.departments.find(x => x.DepartmentId == this.currentUser.DepartmentId);
        let location = this.locations.find(x => x.LocationId == this.currentUser.LocationId);
        let parentUser = this.users.find(x => x.UserId == this.currentUser.ParentUserId);

        /* loading icon visible */
        this.isWaitingInsertOrUpdate = true;

        this.baseService.userService.UpdateUser(this.currentUser, (updateUser, message) => {

          /* Close loading icon */
          this.isWaitingInsertOrUpdate = false;

          /* Show pop up*/
          this.baseService.popupService.ShowSuccessPopup(message);

          /* Load related values to current model */
          this.currentUser.Role = role;
          this.currentUser.Firm = firm;
          this.currentUser.Department = department;
          this.currentUser.Location = location;
          this.currentUser.ParentUser = parentUser;

          /* Update in table the current user */
          this.dataTable.TGT_updateData(updateUser);

          /* Get original source after update completed */
          this.users = <User[]>this.dataTable.TGT_copySource();

        }, (error: HttpErrorResponse) => {

          /* Close loader */
          this.isWaitingInsertOrUpdate = false;

          /* Show error message */
          this.baseService.popupService.ShowErrorPopup(error);

        });

      }

    });

  }

  async deleteUsers() {

    /* Get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup("Lütfen en az bir kayıt seçiniz");
      return;
    }

    /* Show Question Message */
    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {

      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.userService.DeleteUsers(itemIds, () => {

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* if all of them removed */
        if (itemIds.length == 1)
          this.baseService.popupService.ShowAlertPopup("Kayıt Başarıyla silindi!");
        else
          this.baseService.popupService.ShowAlertPopup("Tüm kayıtlar başarıyla silindi!");

        /* Clear all the ids from table */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Get current original sources */
        this.users = <User[]>this.dataTable.TGT_copySource();

      }, (error: HttpErrorResponse) => {

        /* Hide spinner then show error message */
        this.baseService.spinner.hide();

        /* Show error message */
        this.baseService.popupService.ShowErrorPopup(error);

      });
    });
  }

  async onDoubleClickItem(item: User) {

    /* Clear Model */
    this.currentUser = new User();

    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* load companies if not loaded */
    this.loadDropdownList();

    /* get company information from server */
    await this.baseService.userService.GetUserById(item.UserId, (result: User) => {

      /* then bind it to company model to update */
      setTimeout(() => {

        /* close loading */
        this.baseService.spinner.hide();

        /* Trigger to model to show it */
        $("#btnEditUser").trigger("click");

        /* bind result to model */
        Object.assign(this.currentUser, result);

      }, 1000);
    }, (error: HttpErrorResponse) => {

      /* hide spinner */
      this.baseService.spinner.hide();

      /* show error message */
      this.baseService.popupService.ShowErrorPopup(error);

    });

  }

  async loadUsers() {

    /* Load just user to table */
    this.baseService.userService.GetUsers((usrs: User[]) => {
      this.users = usrs;
      this.dataTable.TGT_loadData(this.users);
    }, (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });

  }

  async loadDropdownList() {

    // Departmanların listelenmesi
    if (this.departments.length == 0) {
      this.baseService.departmentService.GetDepartments((departments: Department[]) => {
        this.departments = departments
      }, (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
    }

    // Lokasyonların listelenmesi      
    if (this.locations.length == 0) {
      this.baseService.locationService.GetLocations((locations: Location[]) => {
        this.locations = locations
      }, (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
    }

    /* Reload users again */
    if (this.users.length == 0) {
      this.baseService.userService.GetUsers((users: User[]) => {
        this.users = users;
        this.dataTable.TGT_loadData(this.users);
      }, (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
    }

    /* Get Roles */
    if (this.roles.length == 0) {
      this.baseService.userService.GetRoles(roles => {
        this.roles = roles;
      });
    }

    /* Get Firms */
    if (this.firms.length == 0) {
      this.baseService.userService.GetFirms(firms => {
        this.firms = firms;
      });
    }

  }

}
