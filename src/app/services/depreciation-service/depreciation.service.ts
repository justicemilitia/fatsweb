import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import {
  GET_HEADERS,
  SERVICE_URL,
  GET_DEPRECIATION_CALCULATION_TYPE,
  GET_DEPRECIATIONTYPE_LIST,
  UPDATE_DEPRECIATION,
  GET_DEPRECIATIONLIST_BY_ID,
  GET_IFRSDEPRECIATIONLIST_BY_ID
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { DepreciationCalculationType } from "src/app/models/DepreciationCalculationType";
import { FixedAsset } from '../../models/FixedAsset';
import { Depreciation } from '../../models/Depreciation';

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

  CalculateAllDepreciation(){
    
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
}
