import { Injectable } from "@angular/core";
import {
  HttpClient,
} from "@angular/common/http";

import { GET_DEPARTMENT_LIST, GET_HEADERS, SERVICE_URL, INSERT_DEPARTMENT } from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Department } from '../../models/Department';
import { Response } from 'src/app/models/Response';

@Injectable({
  providedIn: "root"
})
export class DepartmentService {
  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) { }

  GetDepartments(callback,failed) {
    
    this.httpClient
      .get(SERVICE_URL + GET_DEPARTMENT_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(result => {
        
        let response: Response = <Response>result;
        let departments: Department[] = [];
        
        (<Department[]>response.ResultObject).forEach((e) => {
            let dep: Department = new Department();
            Object.assign(dep, e);
            departments.push(dep);
        });

        callback(departments);
        
      },
        error => {
          failed(error);
        }
      );
  }

  InsertDepartment(department: Department) {
    this.httpClient
      .post(SERVICE_URL + INSERT_DEPARTMENT, department, { headers: GET_HEADERS(this.aService.getToken()) })
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
