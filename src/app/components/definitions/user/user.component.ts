import { Component, OnInit, NgModule } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  NgForm
} from "@angular/forms";
import { UserService } from "../../../services/userService/user.service";
import { User } from "../../../models/User";
import { BaseComponent } from "../../base/base.component";
import { LanguageService } from "../../../services/languageService/language.service";
import { Department } from "../../../models/Department";
import { BaseService } from '../../../services/base.service';
import { Role } from '../../../models/Role';
import { Firm } from '../../../models/Firm';

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
  constructor(
    private formBuilder: FormBuilder,
    public baseService : BaseService
  ) {
    super(baseService);
    this.LoadUsers();    
  }

  registerForm: FormGroup;
  registerUser: any = {};
  departments: Department[] = [];
  locations: Location[] = [];
  users: User[] = [];
  roles: Role[] = [];
  firms: Firm[] = [];

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      FirstName: ["", Validators.required],
      LastName: ["", Validators.required],
      DepartmentId: ["", Validators.required],
      LocationId: ["", Validators.required],
      UserTitle: ["", Validators.required],
      FirmId: ["", Validators.required],
      UserMail: ["", Validators.required],
      Password: [
        "",
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8)
      ]
      // ConfirmPassword: []
    });
  }

  register(data: NgForm) {
    console.log(data.value);
    // this.registerUser.confirmPassword = data.value.password;
    this.registerUser = <User>data.value;
    this.baseService.userService.Register(this.registerUser);
  }

  LoadDropdownList() {
      this.baseService.userService.GetDepartments(departments => {
        this.departments = departments;
      });
      this.baseService.userService.GetLocations(locations => {
        this.locations = locations;
      });
      this.baseService.userService.GetUsers(users => {
        this.users = users;
      });
      this.baseService.userService.GetRoles(roles => {
        this.roles = roles;
      });
      this.baseService.userService.GetFirms(firms => {
        this.firms = firms;
      });
  }
  LoadUsers() {
    this.baseService.userService.GetUsers((users: User[]) => { });
  }
}
