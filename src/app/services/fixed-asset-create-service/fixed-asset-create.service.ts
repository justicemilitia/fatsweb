import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import {
  GET_HEADERS,
  SERVICE_URL,
  UNIQUE_BARCODE,
  GET_VALID_BARCODE_LAST_NUMBER,
  ADD_FIXED_ASSET,
  FIXEDASSET_PROPERTY_UNIQUE_CHECK
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { FixedAssetCard } from "../../models/FixedAssetCard";
import { ErrorService } from "src/app/services/error-service/error.service";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { BaseService } from "../base.service";
import { FixedAsset } from "src/app/models/FixedAsset";
import { NgForm } from '@angular/forms';
import { FixedAssetPropertyDetails } from 'src/app/models/FixedAssetPropertyDetails';


@Injectable({
  providedIn: "root"
})
export class FixedAssetCreateService {

  data:NgForm;

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  

  isBarcodeUnique(barcode: string, success, failed) {
    this.httpClient
      .post(
        SERVICE_URL + UNIQUE_BARCODE,
        { Barcode: barcode },
        { headers: GET_HEADERS(this.authenticationService.getToken()) }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
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

  GetValidBarcodeLastNumber(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_VALID_BARCODE_LAST_NUMBER, {
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
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  AddFixedAsset(fixedAsset: FixedAsset, success, failed) {
    this.httpClient
      .post(SERVICE_URL + ADD_FIXED_ASSET, fixedAsset, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedFixedAsset: FixedAsset = new FixedAsset();
            Object.assign(insertedFixedAsset, response.ResultObject);
            success(
              insertedFixedAsset,
              response.ResultStatus,
              response.LanguageKeyword
            );
          } else {
            let existBarcode: [] = [];
            Object.assign(existBarcode, response.ResultObject);
            success(
              existBarcode,
              response.ResultStatus,
              response.LanguageKeyword
            );
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  CheckFixedAssetPropertyUnique(propertyDetail:FixedAssetPropertyDetails,success,failed) {
    this.httpClient
      .post(SERVICE_URL + FIXEDASSET_PROPERTY_UNIQUE_CHECK, propertyDetail, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
        let response:Response=<Response>result;      
        success(response.ResultStatus,response.ResultObject);
      },
      (error:HttpErrorResponse)=>{
        failed(error);
      });
  }


 
}
