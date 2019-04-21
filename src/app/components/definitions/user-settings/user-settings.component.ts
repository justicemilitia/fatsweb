import { Component, OnInit, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { Role } from "../../../models/Role";
import { User } from "../../../models/User";
import { HttpErrorResponse } from "@angular/common/http";
import { Department } from "../../../models/Department";
import UserTitle from "../../../models/UserTitle";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
  styleUrls: ["./user-settings.component.css"]
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [UserSettingsComponent],
  providers: [UserSettingsComponent]
})
export class UserSettingsComponent extends BaseComponent implements OnInit {
  /* Is Request send and waiting for response ? */
  isWaitingInsertOrUpdate: boolean = false;

  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;

  /* Is Table Exporting */
  isTableExporting: boolean = false;

  /* Store the current edit user */
  currentUser: User  = new User();

  /* Store all the table users */
  users: User[] = [];

  /* Store the departments to inser users */
  departments: Department[] = [];

  /* Store the locations to insert users */
  locations: Location[] = [];

  /* Store the roles to insert users */
  roles: Role[] = [];

  /* Store user titles to insert users */
  userTitles: UserTitle[] = [];

  currentUserRoles: Role[] = [];

  dropdownSettings = {};
  
  checkedSystemUser: boolean = false;

  isInsertOrUpdate: boolean = false;

  isCheckedPassword: boolean = false;

  constructor(public baseService: BaseService) {
    super(baseService);

    this.dropdownSettings = {
      singleSelection: false,
      idField: "RoleId",
      textField: "Name",
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
    this.GetUserInfoById(this.baseService.authenticationService.getCurrentUserId());
  }

  ngOnInit() {}

  async onSubmit(data: NgForm){
      /* Ask for approve question if its true then update the location */
      await this.baseService.popupService.ShowQuestionPopupForUpdate(
        (response: boolean) => {
          if (response == true) {
               Object.assign(this.currentUser, data);
            this.baseService.userService.UpdateUser(
              this.currentUser,
              (updateUser, message) => {
  
                /* Show pop up*/
                this.baseService.popupService.ShowSuccessPopup(message);
  
                let newUser = new User();
                Object.assign(newUser, this.currentUser);
                this.currentUser = newUser;
  
              },
              (error: HttpErrorResponse) => {
                /* Close loader */
                this.isWaitingInsertOrUpdate = false;
  
                /* Show error message */
                this.baseService.popupService.ShowErrorPopup(error);
              }
            );
          }
        }
      );
  }
  async GetUserInfoById(item: number) {
    /* Clear Model */
    this.currentUser = new User();

    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* load companies if not loaded */
    this.loadDropdownList();


    this.isInsertOrUpdate = true;

    /* get company information from server */
    await this.baseService.userService.GetUserById(
      item,
      (result: User) => {
        /* then bind it to company model to update */
        setTimeout(() => {
          /* close loading */
          this.baseService.spinner.hide();

          /* Trigger to model to show it */
          $("#btnEditUser").trigger("click");

          /* bind result to model */
          Object.assign(this.currentUser, result);

          this.loadDepartmentByLocationIdDefault(result.LocationId);
          this.currentUser.UserRoles.forEach(e => {
            let role = this.roles.find(y => y.RoleId == e.RoleId);
            if (role) this.currentUserRoles.push(role);
          });
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        /* hide spinner */
        this.baseService.spinner.hide();

        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadDropdownList() {

    // Lokasyonların listelenmesi
    if (this.locations.length == 0) {
      this.baseService.locationService.GetLocations(
        (locations: Location[]) => {
          this.locations = locations;
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }

    /* Get Roles */
    if (this.roles.length == 0) {
      this.baseService.userService.GetRoles(roles => {
        this.roles = roles;
      });
    }

    /* Get User titles */
    if (this.userTitles.length == 0) {
      this.baseService.userService.GetUserTitles(titles => {
        this.userTitles = titles;
      });
    }
  }

  loadDepartmentByLocationId(event: any) {
    this.departments = [];

    if (!event.target.value || event.target.value == "") {
      this.currentUser.DepartmentId = null;
      this.currentUser.Department = new Department();
      return;
    }

    if (event.target.value) {
      this.baseService.departmentService.GetDepartmentsByLocationId(
        <number>event.target.value,
        (departments: Department[]) => {
          this.departments = departments;
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }
  }

  loadDepartmentByLocationIdDefault(locationId: any) {
    this.departments = [];

    if (locationId==0) {
      this.currentUser.DepartmentId = null;
      this.currentUser.Department = new Department();
      return;
    }

    if (locationId) {
      this.baseService.departmentService.GetDepartmentsByLocationId(
        locationId,
        (departments: Department[]) => {
          this.departments = departments;
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }
  }

  isSystemUser(event) {
    if (event.target.checked == true) {
      this.checkedSystemUser = true;
    } else {
      this.checkedSystemUser = false;
    }
  }

  async isCheckPassword(password: any){

    let checkUser: User= new User();
    checkUser.Password=password.value;
    checkUser.UserId=this.baseService.authenticationService.getCurrentUserId();
    await this.baseService.userService.CheckUserPassword(
      checkUser,
      (result: User) => {
        /* then bind it to company model to update */
        setTimeout(() => {
          /* close loading */
          this.baseService.spinner.hide();

          /* bind result to model */
          Object.assign(this.currentUser, result);

          this.isCheckedPassword=true;

        }, 1000);
      },
      (error: HttpErrorResponse) => {
        /* hide spinner */
        this.baseService.spinner.hide();

        /* show error message */
        // this.baseService.popupService.ShowErrorPopup(error);
        this.isCheckedPassword=false;
      }
    );
  }
}
