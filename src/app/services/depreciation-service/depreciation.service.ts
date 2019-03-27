import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import {
  GET_HEADERS,
  SERVICE_URL,
  GET_DEPRECIATION_CALCULATION_TYPE
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { Depreciation } from "src/app/models/Depreciation";

@Injectable({
  providedIn: "root"
})
export class DepreciationService {
  constructor(
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  GetDepreciationCalculationTypes(success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_DEPRECIATION_CALCULATION_TYPE, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
          let response: Response = <Response>result;
          let depreciationTypes: Depreciation[] = [];
          if (response.ResultStatus == true) {
            (<Depreciation[]>response.ResultObject).forEach(e => {
              let depreciation: Depreciation = new Depreciation();
              Object.assign(depreciation, e);
              depreciationTypes.push(depreciation);
            });
            success(depreciationTypes, response.LanguageKeyword);
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
