import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import {
  GET_DEPARTMENT_LIST,
  GET_HEADERS,
  SERVICE_URL,
  INSERT_DEPARTMENT,
  GET_LOCATION_LIST,
  UPDATE_DEPARTMENT,
  GET_DEPARTMENT_BY_ID,
  DELETE_DEPARTMENT,
  GET_DEPARTMENT_LIST_BY_LOCATION_ID
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Department } from "../../models/Department";
import { Response } from "src/app/models/Response";
import { ErrorService } from "../error-service/error.service";
import { getAnErrorResponse } from 'src/app/declarations/extends';

@Injectable({
  providedIn: "root"
})
export class DepartmentService {
  departmentData: Department[] = [];
  
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService
  ) { }

  GetDepartments(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_DEPARTMENT_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let departments: Department[] = [];
            (<Department[]>response.ResultObject).forEach(e => {
              let dep: Department = new Department();
              Object.assign(dep, e);
              departments.push(dep);
            });
            success(departments, response.LanguageKeyword);
          } else {
            failed(
              getAnErrorResponse(response.LanguageKeyword)
            );
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetDepartmentsByLocationId(departmentId:number,success,failed) {
    this.httpClient.get(SERVICE_URL + GET_DEPARTMENT_LIST_BY_LOCATION_ID + "/" + departmentId,{
      headers:GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(
      result=>{
        let response:Response=<Response>result;
        if((<[]>response.ResultObject).length!=0){
          success(response.ResultObject,response.LanguageKeyword);
        }else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },(error:HttpErrorResponse)=>{
        failed(error);
      }
    );
  }

  InsertDepartment(department: Department, success, failed) {
    this.httpClient
      .post(SERVICE_URL + INSERT_DEPARTMENT, department, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedDepartment: Department = new Department();
            Object.assign(insertedDepartment, response.ResultObject);
            success(insertedDepartment, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  UpdateDepartment(department: Department, success, failed) {
    this.httpClient
      .put(SERVICE_URL + UPDATE_DEPARTMENT, department, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            success(department, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  GetDepartmentById(departmentId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_DEPARTMENT_BY_ID + "/" + departmentId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let department: Department = new Department();
          Object.assign(department, response.ResultObject);
          success(department, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }
      );
  }

  DeleteDepartments(ids: number[], success, failed) {
    this.httpClient
      .post(SERVICE_URL + DELETE_DEPARTMENT, { DepartmentIds: ids }, { headers: GET_HEADERS(this.authenticationService.getToken()) })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if ((<[]>response.ResultObject).length == 0) {
            success(response.ResultObject, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        }, error => {
          failed(error);
        });
  }
}
