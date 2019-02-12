import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../services/authenticationService/authentication.service";
import { LanguageService } from '../services/languageService/language.service';


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  constructor(
    private authservice: AuthenticationService, private lang:LanguageService
  ) {
    lang.getLanguage();
  }

  loginUser: any = {};
  content: any;
  ngOnInit() {}

  Login() {
    this.authservice.Login(this.loginUser);
  }

  LogOut() {
    
  }  

  get isAuthenticated(){
    return this.authservice.loggedIn();
  }

  get unAuth(){
    return this.authservice
  }
 

}
