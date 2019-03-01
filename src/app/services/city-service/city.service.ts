import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  SERVICE_URL,
  GET_CITY_LIST,
  GET_HEADERS,
  GET_CITY_BY_COUNTRY_ID
} from "src/app/declarations/service-values";
import { City } from 'src/app/models/City';
import { Response } from "src/app/models/Response";
import { ErrorService } from '../error-service/error.service';

@Injectable({
  providedIn: "root"
})
export class CityService {
  cities = {};
  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService
  ) { }

  GetCityByCountryId(countryId: number, success, failed) {
    this.httpClient.get(SERVICE_URL + GET_CITY_BY_COUNTRY_ID + "/" + countryId,
      { headers: GET_HEADERS() }).subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            success(<City[]>response.ResultObject, response.LanguageKeyword);
          } else {
            failed(this.errorService.getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );;
  }

  GetCityList(callback) {
    this.httpClient.get(SERVICE_URL + GET_CITY_LIST, { headers: GET_HEADERS() }).subscribe(result => {
      callback(<City[]>result["ResultObject"]);
    });
  }
}
