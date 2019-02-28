import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  GET_DEPARTMENT_LIST,
  GET_HEADERS,
  SERVICE_URL,
  INSERT_DEPARTMENT,
  GET_LOCATION_LIST,
  UPDATE_DEPARTMENT,
  GET_DEPARTMENT_BY_ID
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Department } from "../../models/Department";
import { Response } from "src/app/models/Response";

@Injectable({
  providedIn: "root"
})
export class DepartmentService {
  departmentData: Department[] = [];

  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) {}

  GetDepartments(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_DEPARTMENT_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          let departments: Department[] = [];

          (<Department[]>response.ResultObject).forEach(e => {
            let dep: Department = new Department();
            Object.assign(dep, e);
            departments.push(dep);
          });

          callback(departments);
        },
        error => console.error(error)
      );
  }

  InsertDepartment(department: Department) {
    this.httpClient
      .post(SERVICE_URL + INSERT_DEPARTMENT, department, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        () => {
          this.GetDepartments(department);
        },
        error => {
          console.log(error);
        }
      );
  }

  
  UpdateDepartment(department: Department) {
    this.httpClient
        .put(SERVICE_URL + UPDATE_DEPARTMENT, department, {
          headers: GET_HEADERS(this.aService.getToken())
        })
        .subscribe(
          data => {
          },
          error => {
            console.log(error);
          }
        );
    }
  
    GetDepartmentById(callback, departmentId: number) {
      this.httpClient
        .get(SERVICE_URL + GET_DEPARTMENT_BY_ID + "/" + departmentId, {
          headers: GET_HEADERS(this.aService.getToken())
        })
        .subscribe(result => {
          debugger;
          this.departmentData = <Department[]>result["ResultObject"];
          callback(this.departmentData);
          console.log(this.departmentData)
        });
    }
}
