import { Injectable } from "@angular/core";
import {
  HttpClient
} from "@angular/common/http";
import {
  SERVICE_URL,
  GET_DEPARTMENT_LIST,
  GET_HEADERS,
  GET_LOCATION_LIST,
  GET_USER_LIST,
  GET_ROLE_LIST,
  GET_FIRM_LIST,
  INSERT_USER
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { User } from "../../models/User";
import { Department } from '../../models/Department';
import { Location } from '../../models/Location';
import { Role } from '../../models/Role';
import { Firm } from '../../models/Firm';
import { Response } from 'src/app/models/Response';
import { Router } from '@angular/router';

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

  GetLocations(callback,failed) {
    this.httpClient
      .get(SERVICE_URL + GET_LOCATION_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(
        result => {
          callback(<Location[]>result["ResultObject"]);
        },
        error => console.error(error)
      );
  }

  GetUsers(callback,failed) {
    debugger;
    this.httpClient
      .get(SERVICE_URL + GET_USER_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(result => {
        
        let response: Response = <Response>result;
        let users: User[] = [];
        
        (<User[]>response.ResultObject).forEach((e) => {
            let usr: User = new User();
            Object.assign(usr, e);
            usr.Department= new Department();
            usr.Department.Name = "A";
            users.push(usr);
        });

        callback(users);
        
      },
        error => {
          failed(error);
        }
      );
  }

  GetRoles(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_ROLE_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(
        result => {
          callback(<Role[]>result["ResultObject"]);
        },
        error => console.error(error)
      );
  }

  GetFirms(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_FIRM_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(
        result => {
          callback(<Firm[]>result["ResultObject"]);
        },
        error => console.error(error)
      );
  }

  InsertUser(user: User) {
    this.httpClient
      .post(SERVICE_URL + INSERT_USER, user, { headers: GET_HEADERS(this.aService.getToken()) })
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
