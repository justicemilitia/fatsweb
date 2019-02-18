import { Injectable } from "@angular/core";
import { User } from "../../models/LoginUser";
import {
  HttpClient,
  HttpErrorResponse
} from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import {
  SERVICE_URL,
  LOGIN,
  GET_HEADERS
} from "src/app/declarations/service-values";
import RoleAuthorization from "src/app/models/RoleAuthorization";


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
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY = "token";
  ROLE_KEY = "role";

  Login(user: User) {
    this.httpClient
      .post(SERVICE_URL + LOGIN, user, { headers: GET_HEADERS() })
      .pipe(catchError(this.handleError))
      .subscribe(
        data => {
          this.userToken = data["token"];
          this.roles = <RoleAuthorization[]>data["menu_auth"];

          this.saveSession(data["token"], <RoleAuthorization[]>(
            data["menu_auth"]
          ));

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

  saveSession(token: any, roles: RoleAuthorization[]) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ROLE_KEY, JSON.stringify(roles));
  }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }

  isLoggedIn() {
    if (this.getToken()) 
      return !this.jwtHelper.isTokenExpired(this.getToken());
    return false;
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRoleMenus():RoleAuthorization[] {
    return <RoleAuthorization[]>JSON.parse(localStorage.getItem(this.ROLE_KEY));
  }

  getCurrentUserId() {
    return this.jwtHelper.decodeToken(this.getToken()).nameid;
  }

  isMenuAccessable(keyword:string){
    let menu=this.roles.find(x=>x.MenuCaption==keyword);
    if(menu) return true;
    return false;
  }
}
