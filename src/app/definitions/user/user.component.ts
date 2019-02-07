import { Component, OnInit, NgModule } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormArray
} from "@angular/forms";
import { UserService } from "../../services/userService/user.service";

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
    this.registerForm = this.formBuilder.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        department: ["", Validators.required],
        location: ["", Validators.required],
        userTitle: ["", Validators.required],
        firm: ["", Validators.required],
        userMail: ["", Validators.required],
        password: [
          "",
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(8)
        ],
        confirmPassword: ["", Validators.required]
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get("password").value === g.get("confirmPassword").value
      ? null
      : { missMatch: true };
  }

  register() {
    if (this.registerForm.valid) {
      this.registerUser = Object.assign({}, this.registerUser.value);
      this.userService.Register(this.registerUser);
    }
  }
}
