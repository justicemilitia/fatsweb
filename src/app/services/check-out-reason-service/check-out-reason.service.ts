import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import {
  GET_HEADERS,
  SERVICE_URL,
  GET_CHECKOUTREASON_LIST,
  GET_FIXEDASSETSTATUS_LIST,
  GET_SUSPENSION_LIST,
  INSERT_CHECKOUTREASON,
  UPDATE_CHECKOUTREASON,
  GET_SUSPENDED_BY_ID,
  DELETE_SUSPENSION
} from "../../declarations/service-values";
import { CheckOutReason } from "src/app/models/CheckOutReason";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from 'src/app/declarations/extends';
import { FixedAssetStatus } from 'src/app/models/FixedAssetStatus';
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

  GetSuspensions(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_SUSPENSION_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
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

  InsertSuspension(suspension: CheckOutReason, success, failed) {
    this.httpClient
      .post(SERVICE_URL + INSERT_CHECKOUTREASON, suspension, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedSuspension: CheckOutReason = new CheckOutReason();
            Object.assign(insertedSuspension, response.ResultObject);
            success(insertedSuspension, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  UpdateCompany(suspension: CheckOutReason, success, failed) {
    this.httpClient
      .put(SERVICE_URL + UPDATE_CHECKOUTREASON, suspension, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            success(suspension, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  GetSuspensionById(suspensionId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_SUSPENDED_BY_ID + "/" + suspensionId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {            
            let insertedSuspension: CheckOutReason = new CheckOutReason();
            Object.assign(insertedSuspension, response.ResultObject);
            success(insertedSuspension, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  DeleteSuspensions(ids: number[], success, failed) {
    this.httpClient
      .post(
        SERVICE_URL + DELETE_SUSPENSION,
        { SuspensionIds: ids }, //apiden gelene bak!!
        {
          headers: GET_HEADERS(this.aService.getToken())
        }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if ((<[]>response.ResultObject).length == 0) {
            success(response.ResultObject, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }
}


