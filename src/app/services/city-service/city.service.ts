import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  SERVICE_URL,
  GET_CITY_LIST,
  GET_HEADERS
} from "src/app/declarations/service-values";
import { City } from 'src/app/models/City';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class CityService {
  cities = {};
  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) {}

  // GetCities(countryId: number) {
  //   this.httpClient.get(SERVICE_URL + GET_CITY_LIST,{headers:GET_HEADERS(countryId)}).subscribe(
  //     result => {
  //       this.cities=result;
  //     },
  //     error => console.log(error)
  //   );;
  // }
  GetCityList(callback){
    this.httpClient.get(SERVICE_URL + GET_CITY_LIST,{headers:GET_HEADERS()}).subscribe(result=>{
      callback(<City[]>result["ResultObject"]);
    });
  }
}
