import { Injectable } from "@angular/core";
import { User } from "../../models/LoginUser";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import {
  SERVICE_URL,
  LOGIN,
  GET_HEADERS,
  GET_USERFIRM_LIST,
  CHANGE_FIRM,
  GET_USERFIRM_LIST_WITHOUT_PARAMS,
  FORGET_PASSWORD
} from "src/app/declarations/service-values";
import RoleAuthorization from "src/app/models/RoleAuthorization";
import { UserFirm } from "src/app/models/UserFirm";
import { Firm } from 'src/app/models/Firm';
import { Response } from 'src/app/models/Response';
import { getAnErrorResponse } from 'src/app/declarations/extends';
import { encryptUsingAES256, decryptUsingAES256 } from 'src/app/declarations/crypto';
import { Service } from 'src/app/models/Service';


@Injectable({
  providedIn: "root"
})
export class AuthenticationService {

  url:string;
  constructor(private httpClient: HttpClient, private router: Router) {

    if (this.getToken() != "") {
      this.roles = this.getRoleMenus();
      this.currentFirm = this.getCurrentFirm();
    }

  }

  jwtHelper: JwtHelperService = new JwtHelperService();
  roles: RoleAuthorization[] = [];
  Firms: Firm[] = [];
  currentFirm: Firm = null;
  TOKEN_KEY = "token";
  ROLE_KEY = "role";
  FIRM_KEY = "firm";
  JSON:any[]=[];


  Login(user: User, success, failed) {
    this.httpClient
      .post(SERVICE_URL + LOGIN, user, { headers: GET_HEADERS() })
      .subscribe(
        data => {

          this.roles = <RoleAuthorization[]>data["menu_auth"];
          this.currentFirm = this.Firms.find(x => x.FirmId == Number(user.FirmId));
          this.saveSession(data["token"], <RoleAuthorization[]>(data["menu_auth"]), this.currentFirm);

          success();

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

  saveSession(token: any, roles: RoleAuthorization[], firm: Firm) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ROLE_KEY, encryptUsingAES256(JSON.stringify(roles)));
    localStorage.setItem(this.FIRM_KEY, encryptUsingAES256(JSON.stringify(firm)));
  }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.FIRM_KEY);
    this.router.navigateByUrl('/login');
  }

  isLoggedIn() {
    if (this.getToken()) return !this.jwtHelper.isTokenExpired(this.getToken());
    return false;
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  updateToken() {

  }

  changeFirm(firmId: number, success, failed) {
    this.httpClient.post(SERVICE_URL + CHANGE_FIRM, { FirmId: firmId }, {
      headers: GET_HEADERS(this.getToken())
    }).subscribe((data) => {

      this.currentFirm = this.Firms.find(x => x.FirmId == firmId);
      this.saveSession(data["token"], this.getRoleMenus(), this.currentFirm);
      this.router.navigateByUrl('');
      success();
    }, (error: HttpErrorResponse) => {
      failed(error);
    });
  }

  getRoleMenus(): RoleAuthorization[] {
    let roles = localStorage.getItem(this.ROLE_KEY);
    if (roles)
      return <RoleAuthorization[]>JSON.parse(JSON.parse(decryptUsingAES256(roles)));
    else
      return [];
  }

  getCurrentFirm(): Firm {
    let firm = localStorage.getItem(this.FIRM_KEY);
    if (firm)
      return <Firm>JSON.parse(JSON.parse(decryptUsingAES256(firm)));
    else
      return null;
  }

  getCurrentUserId() {
    return this.jwtHelper.decodeToken(this.getToken()).nameid;
  }

  getUserFirmList(username: string, callback, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_USERFIRM_LIST + "/" + username, {
        headers: GET_HEADERS()
      })
      .subscribe(result => {

        let response: Response = <Response>result;

        if (response.ResultStatus == true) {
          let letFirms: Firm[] = [];

          (<UserFirm[]>response.ResultObject).forEach(e => {
            let firm: Firm = new Firm();
            Object.assign(firm, e.Firm);
            letFirms.push(firm);

          });

          if (letFirms.length == 0) {
            failed(getAnErrorResponse('Yetkili Firma Bulunamadı!'));
          }

          callback(letFirms);

        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
        error => {
          failed(error);
        });
  }

  getUserFirmListWithoutParams() {
    this.httpClient
      .get(SERVICE_URL + GET_USERFIRM_LIST_WITHOUT_PARAMS, {
        headers: GET_HEADERS(this.getToken())
      })
      .subscribe(result => {

        let response: Response = <Response>result;

        if (response.ResultStatus == true) {
          let letFirms: Firm[] = [];

          (<UserFirm[]>response.ResultObject).forEach(e => {
            let firm: Firm = new Firm();
            Object.assign(firm, e.Firm);
            letFirms.push(firm);

          });

          this.Firms = letFirms;

        }
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

  sendRecoveryCode(email: string, success, failed) {
    this.httpClient.post(SERVICE_URL + FORGET_PASSWORD, {
      UserMail: email
    }).subscribe(result => {
      let response: Response = <Response>result;
      if (response.ResultStatus == true) {
        success(response.LanguageKeyword);
      } else {
        failed(getAnErrorResponse(response.LanguageKeyword));
      }
    }, (error:HttpErrorResponse) => {
      failed(error);
    });
  }

  // ServiceJSON(){
  //   let httpClient:HttpClient;
  //   httpClient.get("../../assets/service/service.json").map(data=>data.json() as Service[]).subscribe((data)=>{
  //     let service:Service[] =<Service[]>data;
  //     service.forEach(e=>{
  //       if(e.Keyword == "SERVICE_URL"){
  //         this.url = JSON.stringify(e.Service);            
  //       }
  //     }); 
  //   }) 
  //   return this.url;
  //  }

}


