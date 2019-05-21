import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import {
  GET_HEADERS,
  SERVICE_URL,
  GET_DEPRECIATION_CALCULATION_TYPE,
  GET_DEPRECIATIONTYPE_LIST,
  UPDATE_DEPRECIATION,
  GET_DEPRECIATIONLIST_BY_ID,
  GET_IFRSDEPRECIATIONLIST_BY_ID,
  CALCULATE_DEPRECIATION,
  CALCULATE_IFRSDEPRECIATION,
  GET_FIXED_ASSET_DEPRECIATION_LIST,
  GET_FIXED_ASSET_IFRS_DEPRECIATION_LIST,
  DEPRECIATION_TOTAL_VALUES,
  IFRS_DEPRECIATION_TOTAL_VALUES
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse, convertNgbDateToDateString } from "src/app/declarations/extends";
import { DepreciationCalculationType } from "src/app/models/DepreciationCalculationType";
import { FixedAsset } from '../../models/FixedAsset';
import { Depreciation } from '../../models/Depreciation';
import { DepreciationIFRS } from '../../models/DepreciationIFRS';
import { FixedAssetFilter } from '../../models/FixedAssetFilter';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: "root"
})
export class DepreciationService {
  constructor(
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}
  
  GetDepreciationFixedAsset(_perInPage: number = 25, _currentPage: number = 1, _isFilter: boolean = false, _isValid: boolean = true, success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + GET_FIXED_ASSET_DEPRECIATION_LIST,
        { Page: _currentPage, PerPage: _perInPage, IsFilter: _isFilter, IsValid : _isValid },
        {
          headers: GET_HEADERS(this.authenticationService.getToken())
        }
      ).subscribe(
        (result: any) => {

          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedAssets: FixedAsset[] = [];
            (<FixedAsset[]>response.ResultObject).forEach(e => {
              let fa: FixedAsset = new FixedAsset();
              Object.assign(fa, e);
              fixedAssets.push(fa);
            });
            success(fixedAssets, result.TotalPage, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetDepreciationFilterList(fixedAsset: FixedAssetFilter, callback, failed){
    this.httpclient
    .post(
      SERVICE_URL + GET_FIXED_ASSET_DEPRECIATION_LIST, fixedAsset,
      {
        headers: GET_HEADERS(this.authenticationService.getToken())
      }
    )
    .subscribe(
      (result: any) => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let fixedAssets: FixedAsset[] = [];
          (<FixedAsset[]>response.ResultObject).forEach(e => {
            let fa: FixedAsset = new FixedAsset();
            Object.assign(fa, e);
            fixedAssets.push(fa);
          });

          callback(fixedAssets, result.TotalPage);


          // Object.assign(fixedAssets, response.ResultObject);
          // callback(<FixedAsset[]>result["ResultObject"]);
          // success(response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      }
    );
  }

  GetDepreciationIFRSFilterList(fixedAsset: FixedAssetFilter, callback, failed){
    this.httpclient
    .post(
      SERVICE_URL + GET_FIXED_ASSET_IFRS_DEPRECIATION_LIST, fixedAsset,
      {
        headers: GET_HEADERS(this.authenticationService.getToken())
      }
    )
    .subscribe(
      (result: any) => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let fixedAssets: FixedAsset[] = [];
          (<FixedAsset[]>response.ResultObject).forEach(e => {
            let fa: FixedAsset = new FixedAsset();
            Object.assign(fa, e);
            fixedAssets.push(fa);
          });

          callback(fixedAssets, result.TotalPage);


          // Object.assign(fixedAssets, response.ResultObject);
          // callback(<FixedAsset[]>result["ResultObject"]);
          // success(response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      }
    );
  }

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

  CalculateAllDepreciation(fixedAssets: FixedAsset, success, failed){

    this.httpclient
    .post(
      SERVICE_URL + CALCULATE_DEPRECIATION, fixedAssets, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
    .subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let fixedAsset: FixedAsset = new FixedAsset();
          Object.assign(fixedAsset, response.ResultObject);
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

  CalculateAllIfrsDepreciation(fixedAssets: FixedAsset, success, failed){

    this.httpclient
    .post(
      SERVICE_URL + CALCULATE_IFRSDEPRECIATION, fixedAssets, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
    .subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let fixedAsset: FixedAsset = new FixedAsset();
          Object.assign(fixedAsset, response.ResultObject);
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

  DepreciationTotalValues(date: NgbDate, success, failed){
    
    let dep = new Depreciation();
    dep.TargetDate =convertNgbDateToDateString(date);

    this.httpclient
    .post(
      SERVICE_URL + DEPRECIATION_TOTAL_VALUES, dep, {
        headers: GET_HEADERS(this.authenticationService.getToken())
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
  
  DepreciationIFRSTotalValues(date: NgbDate, success, failed){

    this.httpclient
    .post(
      SERVICE_URL + IFRS_DEPRECIATION_TOTAL_VALUES, date, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
    .subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let totalIFRSValues: any;
          success(totalIFRSValues, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      }
    );
  }

  UpdateDepreciation(fixedAsset: FixedAsset, success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + UPDATE_DEPRECIATION, fixedAsset, {
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

  GetDepreciationById(fixedAssetId: number, success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_DEPRECIATIONLIST_BY_ID + "/" + fixedAssetId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      }).subscribe(
        result=>{
          let response:Response=<Response>result;
          if(response.ResultStatus == true){
              let fixedAssets:Depreciation[]=[];
              (<Depreciation[]>response.ResultObject).forEach(e=>{
                let fa:Depreciation=new Depreciation();
                Object.assign(fa,e);
                fixedAssets.push(fa);
              })
              success(fixedAssets, response.LanguageKeyword);
          }
          else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },(error:HttpErrorResponse)=>{
          failed(error);
        }
      );
  }

  GetIFRSDepreciationById(fixedAssetId: number, success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_IFRSDEPRECIATIONLIST_BY_ID + "/" + fixedAssetId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      }).subscribe(
        result=>{
          let response:Response=<Response>result;
          if(response.ResultStatus == true){
              let fixedAssets:DepreciationIFRS[]=[];
              (<DepreciationIFRS[]>response.ResultObject).forEach(e=>{
                let fa:DepreciationIFRS=new DepreciationIFRS();
                Object.assign(fa,e);
                fixedAssets.push(fa);
              })
              success(fixedAssets, response.LanguageKeyword);
          }
          else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },(error:HttpErrorResponse)=>{
          failed(error);
        }
      );
  }
}
