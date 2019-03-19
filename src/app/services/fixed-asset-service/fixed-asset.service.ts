import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_FIXED_ASSET,
  GET_FIXEDASSETCARDPROPERTY_LIST,
  EXIT_FIXEDASSET
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { FixedAsset } from "src/app/models/FixedAsset";
import { FixedAssetCardProperty } from "src/app/models/FixedAssetCardProperty";
import { TransactionLog } from '../../models/TransactionLog';
import { FixedAssetComponent } from '../../components/operations/fixed-asset/fixed-asset.component';

@Injectable({
  providedIn: "root"
})
export class FixedAssetService {
  constructor(
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  GetFixedAsset(success,failed){
    this.httpclient
      .post(
        SERVICE_URL + GET_FIXED_ASSET,
        {Page:"1", PerPage: "100", sortOrder: "asc", filter: {}},
        {
          headers: GET_HEADERS(this.authenticationService.getToken())
        }
      ).subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedAssets: FixedAsset[] = [];
            (<FixedAsset[]>response.ResultObject).forEach(e => {
              let fa: FixedAsset = new FixedAsset();
              Object.assign(fa, e);
              fixedAssets.push(fa);
            });
            success(fixedAssets, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetFixedAssetProperties(success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_FIXEDASSETCARDPROPERTY_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let faProperties: FixedAssetCardProperty[] = [];
            (<FixedAssetCardProperty[]>response.ResultObject).forEach(e => {
              let faProperty: FixedAssetCardProperty = new FixedAssetCardProperty();
              Object.assign(faProperty, e);
              faProperties.push(faProperty);
            });
            success(faProperties, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  ExitFixedAsset(transactionLog: TransactionLog, success, failed){
    this.httpclient
      .post(
        SERVICE_URL + EXIT_FIXEDASSET, transactionLog, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedTransactionLog: TransactionLog = new TransactionLog();
            Object.assign(insertedTransactionLog, response.ResultObject);
            success(insertedTransactionLog, response.LanguageKeyword);
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
