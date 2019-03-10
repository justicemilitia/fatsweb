import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import {
  GET_HEADERS,
  SERVICE_URL,
  INSERT_CHECKOUTREASON,
  GET_CHECKOUTREASON_LIST,
  UPDATE_CHECKOUTREASON,
  GET_CHECKOUTREASON_BY_ID
} from "../../declarations/service-values";
import { CheckOutReason } from "src/app/models/CheckOutReason";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from 'src/app/declarations/extends';
@Injectable({
  providedIn: "root"
})
export class CheckOutReasonService {

  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) { }

  GetCheckOutReason(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_CHECKOUTREASON_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let reasons: CheckOutReason[] = [];
            (<CheckOutReason[]>response.ResultObject).forEach(e => {
              let reason: CheckOutReason = new CheckOutReason();
              Object.assign(reason, e);
              reasons.push(reason);
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
