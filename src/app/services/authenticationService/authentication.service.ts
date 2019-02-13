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
import Menu from "src/app/models/Menu";
import { SERVICE_URL,LOGIN, GET_HEADERS } from 'src/app/declarations/service-values';

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private modal: NgbModal
  ) {
    this.userToken = this.getToken();
    if (this.userToken != "") this.menus = this.getMenus();
  }



  userToken: string; //uygulama boyunca token'a ulaşabilmem gerektiği için tanımladım.
  menus: Menu[] = [];
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY = "token";
  MENU_KEY = "menu";

  Login(user: User) {  

    this.httpClient
      .post(SERVICE_URL + LOGIN, user, { headers: GET_HEADERS() })
      .pipe(catchError(this.handleError))
      .subscribe(
        data => {
          this.userToken = data["token"];
          this.menus = <Menu[]>data["menu_auth"];

          this.saveSession(data["token"], <Menu[]>data["menu_auth"]);

          this.router.navigateByUrl("/company");
        },
        e => {
          console.log(e);
        }
      );
  }
  
  handleError(err: HttpErrorResponse): any {
    if (err.status == 400 || err.status == 401) {
      if (err.error.resultStatus == false) {
        window.alert(err.error.resultObject.tr);
      }
    } else if (err.status == 500) {
      window.alert("HATA");
    }
  }

  saveSession(token: any, menus: Menu[]) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.MENU_KEY, JSON.stringify(menus));
  }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.MENU_KEY);
  }

  isLoggedIn() {
    return !this.jwtHelper.isTokenExpired(this.getToken());
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getMenus() {
    return <Menu[]>JSON.parse(localStorage.getItem(this.MENU_KEY));
  }

  getCurrentUserId() {
    return this.jwtHelper.decodeToken(this.getToken()).nameid;
  }
}
