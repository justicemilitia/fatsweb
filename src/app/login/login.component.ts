import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../services/authenticationService/authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  constructor(
    private authservice: AuthenticationService,
  ) {}

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
}
