import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../services/authenticationService/authentication.service";
import { LanguageService } from "../../services/language-service/language.service";
import { BaseComponent } from "../base/base.component";
import { BaseService } from '../../services/base.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent extends BaseComponent implements OnInit {

  loginUser: any = {};

  constructor(
    protected baseService: BaseService
  ) {

    super(baseService);
    
  }
 
  ngOnInit() {}

  Login() {
    debugger;
    this.baseService.authenticationService.Login(this.loginUser);
  }

  LogOut() {}
  

}
