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

import { GET_DEPARTMENT_LIST, GET_LOCATION_LIST, GET_HEADERS, SERVICE_URL, INSERT_LOCATION } from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Department } from '../../models/Department';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

constructor(
  private httpClient: HttpClient,
  private router: Router,
  private aService: AuthenticationService
) { }

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

InsertLocation(location: Location) {
  debugger;
  this.httpClient
    .post(SERVICE_URL + INSERT_LOCATION, location, { headers: GET_HEADERS() })
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
