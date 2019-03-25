import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_FIXED_ASSET,
  GET_FIXEDASSETCARDPROPERTY_LIST,
  EXIT_FIXEDASSET,
  GET_EXITFIXEDASSETLIST,
  UPDATE_FIXEDASSETBARCODENUMBER,
  UPDATE_FIXEDASSETLOCATION,
  UPDATE_FIXEDASSETDEPARTMENT,
  UPDATE_FIXEDASSETFIRM,
  UPDATE_FIXEDASSETDEBIT
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { FixedAsset } from "src/app/models/FixedAsset";
import { FixedAssetCardProperty } from "src/app/models/FixedAssetCardProperty";
import { TransactionLog } from '../../models/TransactionLog';
import { FixedAssetComponent } from '../../components/operations/fixed-asset/fixed-asset.component';
import { FixedAssetUser } from '../../models/FixedAssetUser';

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

  GetExitFixedAssetList(success, failed){
    this.httpclient
    .get(SERVICE_URL + GET_EXITFIXEDASSETLIST, {
      headers: GET_HEADERS(this.authenticationService.getToken())
    })
    .subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let exitFixedAssets: FixedAsset[] = [];
          (<FixedAsset[]>response.ResultObject).forEach(e => {
            let efa: FixedAsset = new FixedAsset();
            Object.assign(efa, e);
            exitFixedAssets.push(efa);
          });
          success(exitFixedAssets, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, (error: HttpErrorResponse) => {
        failed(error);
      });
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

  ExitFixedAsset(fixedAssetIds:FixedAsset, success, failed){
    this.httpclient
      .post(
        SERVICE_URL + EXIT_FIXEDASSET, fixedAssetIds, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {        
            success(fixedAssetIds, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  ChangeBarcode(fixedAsset: FixedAsset, success, failed){
    this.httpclient
      .post(
        SERVICE_URL + UPDATE_FIXEDASSETLOCATION, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedFixedAsset: FixedAsset = new FixedAsset();
            Object.assign(updatedFixedAsset, response.ResultObject);
            success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  ChangeLocation(fixedAsset: FixedAsset, success, failed){
    this.httpclient
      .post(
        SERVICE_URL + UPDATE_FIXEDASSETLOCATION, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedFixedAsset: FixedAsset = new FixedAsset();
            Object.assign(updatedFixedAsset, response.ResultObject);
            success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  ChangeDepartment(fixedAsset: FixedAsset, success, failed){
    this.httpclient
      .post(
        SERVICE_URL + UPDATE_FIXEDASSETDEPARTMENT, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedFixedAsset: FixedAsset = new FixedAsset();
            Object.assign(updatedFixedAsset, response.ResultObject);
            success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }
  ChangeFirm(fixedAsset: FixedAsset, success, failed){
    this.httpclient
      .post(
        SERVICE_URL + UPDATE_FIXEDASSETFIRM, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedFixedAsset: FixedAsset = new FixedAsset();
            Object.assign(updatedFixedAsset, response.ResultObject);
            success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  ChangeDebit(fixedAsset: FixedAssetUser, success, failed){
    this.httpclient
      .post(
        SERVICE_URL + UPDATE_FIXEDASSETDEBIT, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedFixedAsset: FixedAssetUser = new FixedAssetUser();
            Object.assign(updatedFixedAsset, response.ResultObject);
            success(response.LanguageKeyword);
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
