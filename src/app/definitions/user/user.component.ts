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
import { BaseComponent } from '../../base/base.component';
import { LanguageService } from '../../services/languageService/language.service';

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
export class UserComponent  extends BaseComponent implements OnInit {
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    protected lang: LanguageService    
  ) {
    super(lang);
  }

  registerForm: FormGroup;
  registerUser: any = {};
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
      ],
      // ConfirmPassword: []
    });
  }

  register(data: NgForm) {
    console.log(data.value);
    // this.registerUser.confirmPassword = data.value.password;
    this.registerUser = <User>data.value;
    this.userService.Register(this.registerUser);
  }
}
