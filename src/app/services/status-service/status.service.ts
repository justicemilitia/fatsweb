import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import {
  GET_HEADERS,
  SERVICE_URL,
  GET_FIXEDASSETSTATUS_LIST
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from 'src/app/declarations/extends';
import { FixedAssetStatus } from 'src/app/models/FixedAssetStatus';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) { }

  GetFixedAssetStatus(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETSTATUS_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let status: FixedAssetStatus[] = [];
            (<FixedAssetStatus[]>response.ResultObject).forEach(e => {
              let statu: FixedAssetStatus = new FixedAssetStatus();
              Object.assign(statu, e);
              status.push(statu);
            });
            success(status, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        }, (error: HttpErrorResponse) => {
          failed(error);
        });
  }
}
