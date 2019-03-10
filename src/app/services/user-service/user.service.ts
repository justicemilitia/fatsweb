import { Injectable } from "@angular/core";
import {
  HttpClient, HttpErrorResponse, HttpResponse
} from "@angular/common/http";
import {
  SERVICE_URL,
  GET_DEPARTMENT_LIST,
  GET_HEADERS,
  GET_LOCATION_LIST,
  GET_USER_LIST,
  GET_ROLE_LIST,
  GET_FIRM_LIST,
  INSERT_USER,
  UPDATE_USER,
  GET_USER_LIST_BY_ID,
  DELETE_USER
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { User } from "../../models/User";
import { Department } from '../../models/Department';
import { Location } from '../../models/Location';
import { Role } from '../../models/Role';
import { Firm } from '../../models/Firm';
import { Response } from 'src/app/models/Response';
import { Router } from '@angular/router';
import { getAnErrorResponse } from 'src/app/declarations/extends';

@Injectable({
  providedIn: "root"
})
export class UserService {

  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) { }

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

  GetLocations(callback, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_LOCATION_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(
        result => {
          callback(<Location[]>result["ResultObject"]);
        },
        error => console.error(error)
      );
  }

  GetUsers(callback, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_USER_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(result => {

        let response: Response = <Response>result;
        let users: User[] = [];

        (<User[]>response.ResultObject).forEach((e) => {
          let usr: User = new User();
          Object.assign(usr, e);
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

  InsertUser(user: User, success, failed) {
    this.httpClient
      .post(SERVICE_URL + INSERT_USER, user, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          success(<User>response.ResultObject, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, (error: HttpErrorResponse) => {
        failed(error);
      });
  }

  UpdateUser(user: User, success, failed) {
    this.httpClient.post(SERVICE_URL + UPDATE_USER, user, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          success(<User>response.ResultObject, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, (error: HttpErrorResponse) => {
        failed(error);
      });
  }

  GetUserById(userId: number, success, failed) {
    this.httpClient.get(SERVICE_URL + GET_USER_LIST_BY_ID + '/' + userId, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let user = new User();
          Object.assign(user, response.ResultObject);
          success(user);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, (error: HttpErrorResponse) => {
        failed(error);
      });
  }

  DeleteUsers(ids: number[], success, failed) {
    this.httpClient.post(SERVICE_URL + DELETE_USER, { "UserIds": ids }, {
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
      error => {
        failed(error);
      });
  }


}
