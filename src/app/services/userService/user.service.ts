import { Injectable } from "@angular/core";
import { User } from "../../models/User";
import {
  HttpHeaders,
  HttpClient,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent
} from "@angular/common/http";
import { Http, RequestOptions } from "@angular/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import {
  SERVICE_URL,
  GET_DEPARTMENT_LIST,
  GET_HEADERS,
  CREATE_USER,
  GET_LOCATION_LIST,
  GET_USER_LIST,
  GET_ROLE_LIST,
  GET_FIRM_LIST
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Department } from '../../models/Department';
import { Location } from '../../models/Location';
import { Role } from '../../models/Role';
import { Firm } from '../../models/Firm';

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private aService: AuthenticationService
  ) {}

  GetDepartments(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_DEPARTMENT_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(
        result => {
          callback(<Department[]>result["ResultObject"]);
        },
        error => console.error(error)
      );
  }

  GetLocations(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_LOCATION_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(
        result => {
          callback(<Location[]>result["resultObject"]);
        },
        error => console.error(error)
      );
  }

  GetUsers(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_USER_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(
        result => {
          callback(<Location[]>result["resultObject"]);
        },
        error => console.error(error)
      );
  }

  GetRoles(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_ROLE_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(
        result => {
          callback(<Role[]>result["resultObject"]);
        },
        error => console.error(error)
      );
  }

  GetFirms(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_FIRM_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(
        result => {
          callback(<Firm[]>result["resultObject"]);
        },
        error => console.error(error)
      );
  }

  Register(registerUser: User) {
    debugger;
    this.httpClient
      .post(SERVICE_URL + CREATE_USER, registerUser, { headers: GET_HEADERS() })
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
  }
}
