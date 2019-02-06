import { Injectable } from "@angular/core";
import { User } from "../models/LoginUser";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private modal: NgbModal
  ) {}
  path = "http://localhost:11889/api/auth/";
  userToken: any; //uygulama boyunca token'a ulaşabilmem gerektiği için tanımladım.
  decodedToken: any; //ço zümlenmiş token
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY = "token";

  Login(user: User) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append(
      "Authorization",
      "Basic " + btoa("username:password")
    );
    console.log(headers);
    this.httpClient
      .post(this.path + "token", user, { headers: headers })
      .subscribe(data => {
        console.log(data["token"]);
        this.saveToken(data["token"]);
        this.userToken = data["token"];
        this.decodedToken = this.jwtHelper.decodeToken(data["token"]);
        window.alert("Hoşgeldiniz efeniiim ");
   
        this.router.navigateByUrl("/register");
      },
      error=>{
        window.alert("Şifre veya kullanıcı adı yanlış");     
        return false;   
      });
  }
  saveToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  loggedIn() {
    return this.jwtHelper.isTokenExpired(this.TOKEN_KEY);
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUserId() {
    return this.jwtHelper.decodeToken(this.token).nameid;
  }


}
