import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";

import { Role } from "src/app/models/Role";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_USER_ROLE_LIST,
  INSERT_USER_ROLE,
  GET_SYSTEM_USER_LIST,
  GET_USER_ROLE_BY_ID,
  DELETE_ROLE_USER
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { ErrorService } from "../error-service/error.service";
import { User } from "src/app/models/User";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { UserRole } from "src/app/models/UserRole";
import { BaseService } from '../base.service';

@Injectable({
  providedIn: "root"
})
export class RoleUserService {

  roleData: Role[] = [];

  constructor(
    private httpclient: HttpClient,
    private aService: AuthenticationService,
    private errorService: ErrorService
  ) {}

  GetSystemUsers(success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_SYSTEM_USER_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let users: User[] = [];
            (<User[]>response.ResultObject).forEach(e => {
              let user: User = new User();
              Object.assign(user, e);
              users.push(user);
            });
            success(users, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetUserRole(success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_USER_ROLE_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let userRoles: UserRole[] = [];
            (<UserRole[]>response.ResultObject).forEach(e => {
              let userRole: UserRole = new UserRole();
              Object.assign(userRole, e);
              userRoles.push(userRole);
            });
            success(userRoles, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertUserRole(roleId:number, ids: number[], success, failed) {    
    this.httpclient
      .post(SERVICE_URL + INSERT_USER_ROLE, {"models":[{"RoleId":roleId, "UserIds":ids}]}, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(result=>{
        let response:Response=<Response>result;
        if(response.ResultStatus==true){
          let insertedUserRole:UserRole=new UserRole();
          Object.assign(insertedUserRole,response.ResultObject);
          success(insertedUserRole,response.LanguageKeyword);
        }else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },(error:HttpErrorResponse)=>{
        failed(error);
      });
  }

  GetUserRoleById(userRoleId:number,success,failed){
    this.httpclient.get(SERVICE_URL + GET_USER_ROLE_BY_ID+"/"+userRoleId,{
      headers:GET_HEADERS(this.aService.getToken())
    }).subscribe(result=>{
      let response:Response=<Response>result;
      if(response.ResultStatus==true){
        let userRole:UserRole=new UserRole();
        Object.assign(userRole,response.ResultObject);
        success(userRole,response.LanguageKeyword);
      }
      else{
        failed(getAnErrorResponse(response.LanguageKeyword));
      }
    },error=>{
      failed(error);
    });
  }

  DeleteRoleUser(ids: number[], success, failed) {
    this.httpclient.post(SERVICE_URL + DELETE_ROLE_USER, { "Ids": ids }, {
      headers: GET_HEADERS(this.aService.getToken()),
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        if ((<[]>response.ResultObject).length == 0) {
          success(response.ResultObject, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      (error: HttpErrorResponse) => {
        failed(error);
      });
  }
}
