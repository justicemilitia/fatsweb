import { Injectable } from "@angular/core";
import { User } from "../../models/User";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private httpClient: HttpClient, private router: Router) {}
  path: "http://localhost:5000/api/auth/";
  userToken: any;
  decodedToken: any;
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY = "token";

  Register(registerUser: User) {
    let headers = new HttpHeaders();
    headers = headers.append("ContentType", "application/json");
    this.httpClient
      .post(this.path + "register", registerUser, { headers: headers })
      .subscribe(data => {});
  }
}
