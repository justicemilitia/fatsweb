import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  GET_HEADERS,
  SERVICE_URL,
  GET_FIXEDASSETSTATUS_LIST,
  INSERT_STATUS,
  UPDATE_STATUS
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { FixedAssetStatus } from "src/app/models/FixedAssetStatus";

@Injectable({
  providedIn: "root"
})
export class StatusService {
  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) {}

  GetStatus(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETSTATUS_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let statuses: FixedAssetStatus[] = [];
            (<FixedAssetStatus[]>response.ResultObject).forEach(e => {
              let status: FixedAssetStatus = new FixedAssetStatus();
              Object.assign(status, e);
              statuses.push(status);
            });
            success(statuses, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertStatus(status: FixedAssetStatus, success, failed) {
    this.httpClient
      .post(SERVICE_URL + INSERT_STATUS, status, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedStatus: FixedAssetStatus = new FixedAssetStatus();
            Object.assign(insertedStatus, response.ResultObject);
            success(insertedStatus, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  UpdateStatus(status: FixedAssetStatus, success, failed) {
    this.httpClient
      .put(SERVICE_URL + UPDATE_STATUS, status, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            success(status, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  GetStatusById(statusId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETSTATUS_LIST + "/" + statusId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            success(response.ResultObject, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }
}
