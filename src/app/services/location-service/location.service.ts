import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import {
  GET_DEPARTMENT_LIST,
  GET_LOCATION_LIST,
  GET_HEADERS,
  SERVICE_URL,
  INSERT_LOCATION,
  UPDATE_LOCATION,
  GET_LOCATION_BY_ID,
  DELETE_LOCATION
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Department } from "../../models/Department";
import { Router } from "@angular/router";
import { Response } from "src/app/models/Response";
import { Location } from "../../models/Location";
import { ErrorService } from '../error-service/error.service';
import { getAnErrorResponse } from 'src/app/declarations/extends';

@Injectable({
  providedIn: "root"
})
export class LocationService {
  locationData: Location[] = [];

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService
  ) { }

  GetLocations(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_LOCATION_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let locations: Location[] = [];
            (<Location[]>response.ResultObject).forEach(e => {
              let loc: Location = new Location();
              Object.assign(loc, e);
              locations.push(loc);
            });
            success(locations, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertLocation(location: Location, success, failed) {
    this.httpClient
      .post(SERVICE_URL + INSERT_LOCATION, location, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedLocation: Location = new Location();
            Object.assign(insertedLocation, response.ResultObject);
            success(insertedLocation, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  UpdateLocation(location: Location, success, failed) {
    this.httpClient
      .put(SERVICE_URL + UPDATE_LOCATION, location, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let _updatedLocation: Location = new Location();
            Object.assign(_updatedLocation, location);
            success(_updatedLocation, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  GetLocationById(locationId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_LOCATION_BY_ID + "/" + locationId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let location: Location = new Location();
            Object.assign(location, response.ResultObject);
            success(location, response.LanguageKeyword);
          } else {
            failed(
              getAnErrorResponse(response.LanguageKeyword)
            );
          }
        },
        error => {
          failed(error);
        }
      );
  }

  DeleteLocations(ids: number[], success, failed) {
    this.httpClient
      .post(
        SERVICE_URL + DELETE_LOCATION,
        { "LocationIds": ids },
        {
          headers: GET_HEADERS(this.authenticationService.getToken())
        }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let location: Location = new Location();
            Object.assign(location, response.ResultObject);
            success(location, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        }
      );
  }

}
