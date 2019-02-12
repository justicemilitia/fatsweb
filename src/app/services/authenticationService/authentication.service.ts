import { Injectable } from "@angular/core";
import { User } from "../../models/LoginUser";
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse
} from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { Token } from "@angular/compiler";

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
    debugger;
    this.httpClient
      .post(this.path + "token", user, { headers: headers })
      .pipe(catchError(this.handleError))
      .subscribe(data => {
        console.log(data);
        this.saveToken(data["token"]);
        this.userToken = data["token"];
        this.decodedToken = this.jwtHelper.decodeToken(data["token"]);
        console.log(this.decodedToken);
        window.alert("Hoşgeldiniz efeniiim ");
        this.router.navigateByUrl("/company");
      },(e)=> {
    
        console.log(e);
      });
  }
  unauthorized:boolean;
  handleError(err: HttpErrorResponse): any {
    if (err.status == 400 || err.status == 401) {
        if(err.error.resultStatus==false){
        window.alert(err.error.resultObject.tr);             
        }
    } else if (err.status == 500) {
      window.alert("HATA");
    }
  }

  saveToken(token: any) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  loggedIn() {
    return true;
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUserId() {
    return this.jwtHelper.decodeToken(this.token).nameid;
  }
}
