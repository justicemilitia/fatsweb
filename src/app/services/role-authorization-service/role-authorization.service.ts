import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  SERVICE_URL,
  GET_ROLE_AUTHORIZATION_LIST,
  GET_HEADERS,
  GET_ROLE_AUTHORIZATION_LIST_BY_FIRMID,
  INSERT_ROLE_AUTHORIZATION,
  GET_ROLE_AUTHORIZATION_LIST_BY_ROLEID,
  UPDATE_ROLE_AUTHORIZATION
} from "../../declarations/service-values";

import { Response } from "src/app/models/Response";
import { ErrorService } from "../error-service/error.service";
import { getAnErrorResponse } from "src/app/declarations/extends";
import RoleAuthorization from "src/app/models/RoleAuthorization";
import { Menu } from "src/app/models/Menu";

@Injectable({
  providedIn: "root"
})

export class RoleAuthorizationService {
  roleAuth: RoleAuthorization[] = [];

  constructor(
    private httpclient: HttpClient,
    private aService: AuthenticationService,
  ) {}

  GetRoleAuth(success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_ROLE_AUTHORIZATION_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let roleAuthorization: RoleAuthorization[] = [];
            (<RoleAuthorization[]>response.ResultObject).forEach(e => {
              let roleAuth: RoleAuthorization = new RoleAuthorization();
              Object.assign(roleAuth, e);
              roleAuthorization.push(roleAuth);
            });
            success(roleAuthorization, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetRoleAuthByFirmId(success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_ROLE_AUTHORIZATION_LIST_BY_FIRMID, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let roleMenus: Menu[] = [];
            (<Menu[]>response.ResultObject).forEach(e => {
              let roleMenu: Menu = new Menu();
              Object.assign(roleMenu, e);
              roleMenus.push(roleMenu);
            });
            success(roleMenus, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertRoleAuth(roleId: number, models: RoleAuthorization[], success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + INSERT_ROLE_AUTHORIZATION,
        { RoleId: roleId, models: models },
        { headers: GET_HEADERS(this.aService.getToken()) }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let auth: RoleAuthorization = new RoleAuthorization();
            Object.assign(auth, response.ResultObject);
            success(auth, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  UpdateRoleAuth(roleId: number, models: RoleAuthorization[], success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + UPDATE_ROLE_AUTHORIZATION,
        {
          RoleId: roleId,
          models: models
        },
        { headers: GET_HEADERS(this.aService.getToken()) }
      )
      .subscribe(result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          success(roleId, models, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      });
  }

  GetRoleAuthListById(roleId: number, success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_ROLE_AUTHORIZATION_LIST_BY_ROLEID + "/" + roleId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let roleAuths: RoleAuthorization[] = [];
            (<RoleAuthorization[]>response.ResultObject).forEach(e => {
              let roleAuth: RoleAuthorization = new RoleAuthorization();
              roleAuth.RoleAuthorizationId=e.RoleAuthorizationId;
              Object.assign(roleAuth, e);
              roleAuths.push(roleAuth);
            });
            success(roleAuths, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  DeleteRoleAuth(){

  }
}
