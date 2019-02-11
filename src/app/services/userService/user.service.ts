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
  path = "http://localhost:5000/api/auth/";
  userToken: any;
  decodedToken: any;
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY = "token";

  Register(registerUser: User) {
    debugger;
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append(
      "Authorization",
      "Basic " + btoa("username:password")
    );
    console.log(registerUser);
    debugger;
    this.httpClient
      .post(this.path + "register", registerUser, { headers: headers })
      .subscribe(data => {
        console.log(data["token"]);
        this.saveToken(data["token"]);
        this.userToken = data["token"];
        this.decodedToken = this.jwtHelper.decodeToken(data["token"]);
        window.alert("Selamlaaaar :)");
   
        this.router.navigateByUrl("/user");
      },
      error=>{
        console.log(error);     
        return ;   
      });
  }

  saveToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}
