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
import { UserService } from "../../services/userService/user.service";
import { User } from "../../models/User";

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
export class UserComponent implements OnInit {
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  registerForm: FormGroup;
  registerUser: any = {};
  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      departmentID: ["", Validators.required],
      locationID: ["", Validators.required],
      userTitle: ["", Validators.required],
      firmID: ["", Validators.required],
      userMail: ["", Validators.required],
      password: [
        "",
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8)
      ],
      confirmPassword: []
    });
  }

  register(data: NgForm) {
    console.log(data.value);
    // this.registerUser.confirmPassword = data.value.password;
    this.registerUser = <User>data.value;
    this.userService.Register(this.registerUser);
  }
}
