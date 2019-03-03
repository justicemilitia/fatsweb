import { Injectable } from "@angular/core";
import { User } from "../../models/LoginUser";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import {
  SERVICE_URL,
  LOGIN,
  GET_HEADERS,
  GET_USERFIRM_LIST
} from "src/app/declarations/service-values";
import RoleAuthorization from "src/app/models/RoleAuthorization";
import { UserFirm } from "src/app/models/UserFirm";

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  constructor(private httpClient: HttpClient, private router: Router) {
    this.userToken = this.getToken();
    if (this.userToken != "") this.roles = this.getRoleMenus();
  }

  userToken: string; //uygulama boyunca token'a ulaşabilmem gerektiği için tanımladım.
  roles: RoleAuthorization[] = [];
  userFirms: UserFirm[] = [];
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY = "token";
  ROLE_KEY = "role";
  response:boolean;

  Login(user: User,failed) {  
    this.httpClient
      .post(SERVICE_URL + LOGIN, user, { headers: GET_HEADERS() })
      .subscribe(
        data => {
          this.userToken = data["token"];
          this.roles = <RoleAuthorization[]>data["menu_auth"];

          this.saveSession(data["token"], <RoleAuthorization[]>(
            data["menu_auth"]
          ));

          this.router.navigateByUrl("/dashboard");
        },
        error => {  
          failed(error);
        }
      );
  }

  handleError(err: HttpErrorResponse): any {  
      if (err.error.ResultStatus == false) {
          return false;
      }   
  }
  

  saveSession(token: any, roles: RoleAuthorization[]) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ROLE_KEY, JSON.stringify(roles));
  }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }

  isLoggedIn() {
    if (this.getToken()) return !this.jwtHelper.isTokenExpired(this.getToken());
    return false;
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRoleMenus(): RoleAuthorization[] {
    return <RoleAuthorization[]>JSON.parse(localStorage.getItem(this.ROLE_KEY));
  }

  getCurrentUserId() {
    return this.jwtHelper.decodeToken(this.getToken()).nameid;
  }

  getUserFirmList(callback,username: string,failed) {
    this.httpClient
      .get(SERVICE_URL + GET_USERFIRM_LIST + "/" + username, {
        headers: GET_HEADERS()
      })
      .subscribe(result => {       
        this.userFirms=<UserFirm[]>result["ResultObject"];
        callback(this.userFirms)
      },
      error=>{
      debugger;
        failed(error);
      });
  }

  isMenuAccessable(keyword: string) {
    let menu = this.roles.find(x => x.MenuCaption == keyword);
    if (menu) return true;
    return false;
  }

  pageRoute(pageRoute: string) {
    let route = this.isMenuAccessable(pageRoute);
    if (route) {
      //sayfayı görme yetkisi var ise istenilen sayfaya yönlendirilir.
      this.router.navigateByUrl("/" + pageRoute);
      return true;
    } else {
      //yetkisi yok ise popup çıkar
      return false;
    }
  }
}
