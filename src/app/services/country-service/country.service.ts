import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  SERVICE_URL,
  GET_COUNTRY_LIST,
  GET_HEADERS
} from "src/app/declarations/service-values";
import { Country } from "src/app/models/Country";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class CountryService {
  constructor(
    private httpClient: HttpClient,
    private router:Router,
    private aService: AuthenticationService
  ) {}

  GetCountryList(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_COUNTRY_LIST, {
        headers: GET_HEADERS()
      })
      .subscribe(
        result => {
          callback(<Country[]>result["ResultObject"]);
        },
        error => console.log(error)
      );
  }
}
