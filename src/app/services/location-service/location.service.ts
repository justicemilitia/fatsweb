import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  GET_DEPARTMENT_LIST,
  GET_LOCATION_LIST,
  GET_HEADERS,
  SERVICE_URL,
  INSERT_LOCATION
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Department } from "../../models/Department";
import { Router } from "@angular/router";
import { Response } from "src/app/models/Response";
import { Location } from "../../models/Location";

@Injectable({
  providedIn: "root"
})
export class LocationService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private aService: AuthenticationService
  ) {}

  GetLocations(callback, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_LOCATION_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          let locations: Location[] = [];

          (<Location[]>response.ResultObject).forEach(e => {
            let loc: Location = new Location();
            Object.assign(loc, e);
            locations.push(loc);
          });

          callback(locations);
        },
        error => {
          failed(error);
        }
      );
  }
  InsertLocation(location: Location) {
    this.httpClient
      .post(SERVICE_URL + INSERT_LOCATION, location, { headers: GET_HEADERS(this.aService.getToken())
      })
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
