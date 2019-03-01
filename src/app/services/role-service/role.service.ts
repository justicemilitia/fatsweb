import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Role } from "src/app/models/Role";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_ROLE_LIST,
  INSERT_ROLE,
  UPDATE_ROLE,
  GET_ROLE_LIST_BY_ID
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { getToken } from "@angular/router/src/utils/preactivation";
import { ErrorService } from "../error-service/error.service";

@Injectable({
  providedIn: "root"
})
export class RoleService {
  roleData: Role[] = [];

  constructor(
    private httpclient: HttpClient,
    private aService: AuthenticationService,
    private errorService: ErrorService
  ) {}

  GetRoles(success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_ROLE_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let roles: Role[] = [];
            (<Role[]>response.ResultObject).forEach(e => {
              let role: Role = new Role();
              Object.assign(role, e);
              roles.push(role);
            });
            success(roles, response.LanguageKeyword);
          } else {
            failed(
              this.errorService.getAnErrorResponse(response.LanguageKeyword)
            );
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertRole(role: Role, success, failed) {
    this.httpclient
      .post(SERVICE_URL + INSERT_ROLE, role, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedRole: Role = new Role();
            Object.assign(insertedRole, response.ResultObject);
            success(insertedRole, response.LanguageKeyword);
          } else {
            failed(
              this.errorService.getAnErrorResponse(response.LanguageKeyword)
            );
          }
        },
        error => {
          failed(error);
        }
      );
  }

  UpdateRole(role: Role, success, failed) {
    this.httpclient
      .put(SERVICE_URL + UPDATE_ROLE, role, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedRole: Role = new Role();
            Object.assign(updatedRole, role);
            success(updatedRole, response.LanguageKeyword);
          } else {
            failed(
              this.errorService.getAnErrorResponse(response.LanguageKeyword)
            );
          }
        },
        error => {
          failed(error);
        }
      );
  }

  GetRoleById(roleId: number, success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_ROLE_LIST_BY_ID + "/" + roleId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let role: Role = new Role();
            Object.assign(role, response.ResultObject);
            success(role, response.LanguageKeyword);
          } else {
            failed(
              this.errorService.getAnErrorResponse(response.LanguageKeyword)
            );
          }
        },
        error => {
          failed(error);
        }
      );
  }
}
