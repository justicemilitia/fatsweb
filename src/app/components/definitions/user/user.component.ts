import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { UserService } from "../../../services/user-service/user.service";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { LanguageService } from "../../../services/language-service/language.service";
import { IData } from "src/app/models/interfaces/IData";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "src/app/extends/TreeGridTable";
import { Router } from "@angular/router";
import { Department } from "../../../models/Department";
import { Role } from "../../../models/Role";
import { Firm } from "../../../models/Firm";
import { User } from "../../../models/User";
import { Location } from "../../../models/Location";

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
export class UserComponent extends BaseComponent implements OnInit, DoCheck {
  insertingUser: any = {};
  users: User[] = [];
  departments: Department[] = [];
  locations: Location[] = [];
  roles: Role[] = [];
  firms: Firm[] = [];

  filter: any = {
    FirstName: "",
    LastName: "",
    UserMail: "",
    UserTitle: "",
    PhoneNumber: "",
    Firm: {
      Name: ""
    },
    Location: {
      Name: ""
    },
    Department: {
      Name: ""
    }
  };

  order: any = {
    isDesc: false,
    column: "Name"
  };

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadUsers();
  }
  ngOnInit() {}

  ngDoCheck(): void {
    this.doFilter();
  }

  //#region Grid Methods

  doFilter() {
    //this.TGT_doFilter(this.users, this.filter);
  }

  doOrder(column: string) {
    this.order.isDesc = !this.order.isDesc;
    this.order.column = column;
    //this.TGT_doOrder(this.users, this.filter, this.order);
  }

  doCollapse(data: IData) {

    data.isExtended = !data.isExtended;
    //this.TGT_loadData(this.users);
  }

  //#endregion

  registerUser: any = {};

  insertUser(data: NgForm) {
    this.insertingUser = <User>data.value;
    this.baseService.userService.InsertUser(
      this.insertingUser
    );
  }

  loadUsers() {
    debugger;
    this.baseService.userService.GetUsers(
      (usrs: User[]) => {
        //this.users = <User[]>this.convertDataToTree(usrs);
        //this.TGT_loadData(this.users);
      },
      (error: HttpErrorResponse) => {
        //this.errorManager(error);
      }
    );
  }

  loadDropdownList() {
    
    // Departmanların listelenmesi
    this.baseService.departmentService.GetDepartments(deps => {
      this.departments = deps;},
      (error: HttpErrorResponse) => {
        //this.errorManager(error);
      } );

    // Lokasyonların listelenmesi      
    this.baseService.locationService.GetLocations(locs => {
      this.locations=locs;},
      (error: HttpErrorResponse) => {
        //this.errorManager(error);
      }
    );

    this.baseService.userService.GetUsers(
      (usrs: User[]) => {
        //this.users = <User[]>this.convertDataToTree(usrs);
        //this.TGT_loadData(this.users);
      },
      (error: HttpErrorResponse) => {
        //this.errorManager(error);
      }
    );

    this.baseService.userService.GetRoles(roles => {
      this.roles = roles;
    });

    this.baseService.userService.GetFirms(firms => {
      this.firms = firms;
    });
  }
}
