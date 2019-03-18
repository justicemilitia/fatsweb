import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import {
  GET_HEADERS,
  SERVICE_URL,
  GET_CURRENCY_LIST
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from 'src/app/declarations/extends';
import { Currency } from '../../models/Currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

 constructor(
  private httpClient: HttpClient,
  private aService: AuthenticationService
 ) { }

 GetCurrencies(success, failed) {
  this.httpClient
    .get(SERVICE_URL + GET_CURRENCY_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
    .subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let reasons: Currency[] = [];
          (<Currency[]>response.ResultObject).forEach(e => {
            let currency: Currency = new Currency();
            Object.assign(currency, e);
            reasons.push(currency);
          });
          success(reasons, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, (error: HttpErrorResponse) => {
        failed(error);
      });
 }

}
