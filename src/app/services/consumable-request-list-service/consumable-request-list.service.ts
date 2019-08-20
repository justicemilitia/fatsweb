import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_CONSUMABLE_REQUEST_LIST,
  REQUEST_CONSUMABLE_MATERIAL
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { Consumable } from "src/app/models/Consumable";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { ConsumableRequest } from "src/app/models/ConsumableRequest";

@Injectable({
  providedIn: "root"
})
export class ConsumableRequestListService {
  constructor(
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  GetConsumableRequestList(
    _perInPage: number = 25,
    _currentPage: number = 1,
    success,
    failed
  ) {
    this.httpclient
      .post(
        SERVICE_URL + GET_CONSUMABLE_REQUEST_LIST,
        { Page: _currentPage, PerPage: _perInPage },
        { headers: GET_HEADERS(this.authenticationService.getToken()) }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let consumableRequestList: ConsumableRequest[] = [];
            (<ConsumableRequest[]>response.ResultObject).forEach(e => {
              let consumable: ConsumableRequest = new ConsumableRequest();
              Object.assign(consumable, e);
              consumableRequestList.push(consumable);
            });
            success(consumableRequestList, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  RequestConsumableMaterial(consumable: ConsumableRequest, success, failed) {
    this.httpclient
      .post(SERVICE_URL + REQUEST_CONSUMABLE_MATERIAL, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
        
      }),
      (error: HttpErrorResponse) => {
        failed(error);
      };
  }
}
