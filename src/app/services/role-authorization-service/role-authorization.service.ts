import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  SERVICE_URL,
  GET_ROLE_AUTHORIZATION_LIST,
  GET_HEADERS
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { ErrorService } from "../error-service/error.service";
import { User } from "src/app/models/User";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { UserRole } from "src/app/models/UserRole";
import RoleAuthorization from "src/app/models/RoleAuthorization";

@Injectable({
  providedIn: "root"
})
export class RoleAuthorizationService {
  roleAuth: RoleAuthorization[] = [];

  constructor(
    private httpclient: HttpClient,
    private aService: AuthenticationService,
    private errorService: ErrorService
  ) {}

  GetRoleAuth(success, failed) {
    this.httpclient.get(SERVICE_URL + GET_ROLE_AUTHORIZATION_LIST, {
      headers: GET_HEADERS(this.aService.getToken())
    }).subscribe(result=>{
      let response:Response=<Response>result;
      if(response.ResultStatus==true){
        let roleAuthorization:RoleAuthorization[]=[];
        (<RoleAuthorization[]>response.ResultObject).forEach(e=>{
          let roleAuth:RoleAuthorization=new RoleAuthorization();
          Object.assign(roleAuth,e);
          roleAuthorization.push(roleAuth);
        });
        success(roleAuthorization,response.LanguageKeyword);
      }
      else{
        failed(getAnErrorResponse(response.LanguageKeyword));
      }
    },(error:HttpErrorResponse)=>{
      failed(error);
    });
  }
}
