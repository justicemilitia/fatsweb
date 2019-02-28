import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Role } from "src/app/models/Role";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_ROLE_LIST,
  INSERT_ROLE,
  UPDATE_ROLE
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { getToken } from "@angular/router/src/utils/preactivation";

@Injectable({
  providedIn: "root"
})
export class RoleService {
  roleData: Role[] = [];

  constructor(
    private httpclient: HttpClient,
    private aService: AuthenticationService
  ) {}

  GetRoles(callback, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_ROLE_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          let roles: Role[] = [];
          (<Role[]>response.ResultObject).forEach(e => {
            let role: Role = new Role();
            Object.assign(role, e);
            roles.push(role);
          });
          callback(roles);
        },
        error => {
          failed(error);
        }
      );
  }

  InsertRole(role: Role, failed) {
    this.httpclient
      .post(SERVICE_URL + INSERT_ROLE, role, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          failed(error);
        }
      );
  }

  UpdateRole(role: Role, failed) {
    this.httpclient
      .put(SERVICE_URL + UPDATE_ROLE, role, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          failed(error);
        }
      );
  }

  GetRoleById(){
    
  }


}
