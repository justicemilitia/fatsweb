import { Injectable } from "@angular/core";
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

import { GET_DEPARTMENT_LIST, GET_HEADERS, SERVICE_URL, INSERT_DEPARTMENT } from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Department } from '../../models/Department';

@Injectable({
  providedIn: "root"
})
export class DepartmentService {
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
          callback(<Department[]>result["resultObject"]);
        },
        error => console.error(error)
      );
  }

  InsertDepartment(department: Department) {
    debugger;
    this.httpClient
      .post(SERVICE_URL + INSERT_DEPARTMENT, department, { headers: GET_HEADERS() })
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
