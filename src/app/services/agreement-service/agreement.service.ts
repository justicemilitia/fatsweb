import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import {
  GET_HEADERS,
  SERVICE_URL,
  INSERT_AGREEMENT,
  GET_AGREEMENT_LIST,
  UPDATE_AGREEMENT,
  GET_AGREEMENT_BY_ID,
  DELETE_AGREEMENT
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "../../../../src/app/models/Response";
import { Router } from "@angular/router";
import { Agreement } from "../../../../src/app/models/Agreement";
import { ErrorService } from '../error-service/error.service';
import { getAnErrorResponse } from 'src/app/declarations/extends';

@Injectable({
  providedIn: "root"
})
export class AgreementService {
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService    
  ) {}

  GetAgreement(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_AGREEMENT_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let agreements: Agreement[] = [];
            (<Agreement[]>response.ResultObject).forEach(e => {
              let agreement: Agreement = new Agreement();
              Object.assign(agreement, e);
              agreements.push(agreement);
            });
            success(agreements, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertAgreement(agreement: Agreement, success, failed) {
    this.httpClient.post(SERVICE_URL + INSERT_AGREEMENT, agreement, {
      headers: GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let insertedAgreement: Agreement = new Agreement();
          Object.assign(insertedAgreement, response.ResultObject);
          success(insertedAgreement, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      });
  }

  UpdateAgreement(agreement: Agreement, success, failed) {
    this.httpClient.put(SERVICE_URL + UPDATE_AGREEMENT, agreement, {
      headers: GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          success(agreement, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      }
    );
  }

  GetAgreementById(agreementId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_AGREEMENT_BY_ID + "/" + agreementId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let agreement: Agreement = new Agreement();
          Object.assign(agreement, response.ResultObject);
          success(agreement, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, error => {
        failed(error);
      });
  }

  DeleteAgreements(ids: number[], success, failed) {
    this.httpClient.post(SERVICE_URL + DELETE_AGREEMENT, { "AggrementIds": ids }, {
      headers: GET_HEADERS(this.authenticationService.getToken()),
    }).subscribe(
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
      });
  }

}
