import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../services/AuthenticationService/authentication.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  constructor(
    private authservice: AuthenticationService,
    private modal: NgbModal
  ) {}

  loginUser: any = {};
  content: any;
  ngOnInit() {}

  Login() {
    this.authservice.Login(this.loginUser);
  }

  LogOut() {
    this.authservice.logOut();
  }

  get isAuthenticated() {
    return this.authservice.loggedIn();
  }
  forgotPassword(content: any) {
    this.modal.open(content);
  }
}
