import { Injectable } from "@angular/core";
import { User } from "../../models/LoginUser";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_USERFIRM_LIST_WITHOUT_PARAMS
} from "src/app/declarations/service-values";
import RoleAuthorization from "src/app/models/RoleAuthorization";
import { UserFirm } from "src/app/models/UserFirm";
import { Firm } from "src/app/models/Firm";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { AuthenticationService } from "../authenticationService/authentication.service";

@Injectable({
  providedIn: "root"
})
export class FirmService {
  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) {}

  GetUserFirmList(success,failed) {
    this.httpClient
      .get(SERVICE_URL + GET_USERFIRM_LIST_WITHOUT_PARAMS, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result=>{
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let userFirms: UserFirm[] = [];

            (<UserFirm[]>response.ResultObject).forEach(e => {
              let firm: UserFirm = new UserFirm();
              Object.assign(firm, e.Firm);
              userFirms.push(firm);  
            });
            success(userFirms,response.LanguageKeyword);
          }
         }, error=>{
           failed(error);
         }
      );
  }
}
