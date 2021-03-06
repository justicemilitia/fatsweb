import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import {
  GET_LOCATION_LIST,
  GET_HEADERS,
  SERVICE_URL,
  INSERT_LOCATION,
  UPDATE_LOCATION,
  GET_LOCATION_BY_ID,
  DELETE_LOCATION,
  GET_LOCATIONS_BY_FIRM_ID,
  GET_LOCATIONS_SELF_PARENTLESS_BY_ID
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { Location } from "../../models/Location";
import { ErrorService } from "../error-service/error.service";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

@Injectable({
  providedIn: "root"
})
export class LocationService {
  locationData: Location[] = [];

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService
  ) {}

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

  GetLocationsByFirmId(firmId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_LOCATIONS_BY_FIRM_ID + "/" + firmId)
      .subscribe(result=>{
        let response:Response=<Response>result;
        if(response.ResultStatus==true){
          let locations:Location[]=[];
          (<Location[]>response.ResultObject).forEach(e=>{
            let location:Location=new Location();
            Object.assign(location,e);
            locations.push(location);
          });
          success(locations,response.LanguageKeyword);
        } else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },(error:HttpErrorResponse)=>{
        failed(error);
      });
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
            success(location, response.LanguageKeyword);
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
            failed(getAnErrorResponse(response.LanguageKeyword));
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
        { LocationIds: ids },
        { headers: GET_HEADERS(this.authenticationService.getToken()) }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if ((<[]>response.ResultObject).length == 0) {
            success(response.ResultObject, response.LanguageKeyword);
          } else {
            failed(<NotDeletedItem[]>response.ResultObject,getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetLocationsSelfParentlessById(locationId:number,success,failed){
    this.httpClient.get(SERVICE_URL + GET_LOCATIONS_SELF_PARENTLESS_BY_ID + "/" + locationId, {
      headers:GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(
      result =>{
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let locations:Location[]=[];
          (<Location[]>response.ResultObject).forEach(e=>{
            let location:Location=new Location();
            Object.assign(location,e);
            locations.push(location);
          });
          success(locations,response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },(error:HttpErrorResponse) => {
        failed(error);
      }
    );
  }
}
