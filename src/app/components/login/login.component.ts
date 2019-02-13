import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../services/authenticationService/authentication.service";
import { LanguageService } from "../../services/languageService/language.service";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent extends BaseComponent implements OnInit {

  loginUser: any = {};

  constructor(
    private authservice: AuthenticationService,
    protected lang: LanguageService
  ) {

    super(lang);
    
  }
 
  ngOnInit() {}

  Login() {
    this.authservice.Login(this.loginUser);
  }

  LogOut() {}

  get unAuth() {
       return this.authservice;
  }
  

}
