import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import {
  GET_HEADERS,
  SERVICE_URL,
  GET_FIXEDASSETCARDBRAND_LIST,
  GET_FIXEDASSETCARDMODEL_LIST,
  INSERT_FIXEDASSETCARDMODEL,
  UPDATE_FIXEDASSETCARDMODEL,
  GET_FIXEDASSETCARDMODEL_BY_ID,
  DELETE_FIXEDASSETCARDBRAND,
  DELETE_FIXEDASSETCARDMODEL,
  GET_MODELS_BY_BRAND_ID
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { FixedAssetCardBrand } from "../../models/FixedAssetCardBrand";
import { FixedAssetCardModel } from "../../models/FixedAssetCardModel";
import { Response } from "src/app/models/Response";
import { Router } from "@angular/router";
import { ErrorService } from "../error-service/error.service";
import { getAnErrorResponse } from "src/app/declarations/extends";

@Injectable({
  providedIn: "root"
})
export class FixedAssetCardModelService {
  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService,
    private errorService: ErrorService
  ) { }

  GetFixedAssetCardModels(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARDMODEL_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedAssetCardModels: FixedAssetCardModel[] = [];
            (<FixedAssetCardModel[]>response.ResultObject).forEach(e => {
              let facms: FixedAssetCardModel = new FixedAssetCardModel();
              Object.assign(facms, e);
              fixedAssetCardModels.push(facms);
            });
            success(fixedAssetCardModels);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertFixedAssetCardModel(fixedAssetCardModel: FixedAssetCardModel, success, failed) {
    this.httpClient
      .post(SERVICE_URL + INSERT_FIXEDASSETCARDMODEL, fixedAssetCardModel, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let insertedModel: FixedAssetCardModel = new FixedAssetCardModel();
          Object.assign(insertedModel, response.ResultObject);
          success(insertedModel, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, (error: HttpErrorResponse) => {
        failed(error);
      });
  }

  UpdateFixedAssetCardModel(
    fixedAssetCardModel: FixedAssetCardModel,
    success,
    failed
  ) {
    this.httpClient
      .put(SERVICE_URL + UPDATE_FIXEDASSETCARDMODEL, fixedAssetCardModel, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedModel: FixedAssetCardModel = new FixedAssetCardModel();
            Object.assign(updatedModel, fixedAssetCardModel);
            success(updatedModel, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  GetFixedAssetCardModelById(modelId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARDMODEL_BY_ID + "/" + modelId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let model: FixedAssetCardModel = new FixedAssetCardModel();
            Object.assign(model, response.ResultObject);
            success(model, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  DeleteFixedAssetCarModels(ids: number[], success, failed) {
    this.httpClient.post(SERVICE_URL + DELETE_FIXEDASSETCARDMODEL, { ModelIds: ids }, {
      headers: GET_HEADERS(this.aService.getToken())
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        if ((<[]>response.ResultObject).length == 0) {
          success(response.ResultObject, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, (error: HttpErrorResponse) => {
        failed(error);
      });
  }

  GetFixedAssetsCardModelsByBrandId(brandId:number,success,failed){
    this.httpClient.get(SERVICE_URL + GET_MODELS_BY_BRAND_ID + "/" + brandId,{
      headers:GET_HEADERS(this.aService.getToken())
    }).subscribe(
      result=>{
        let response:Response=<Response>result;
        if((<[]>response.ResultObject).length!=0){
          success(response.ResultObject,response.LanguageKeyword);
        }else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },(error:HttpErrorResponse)=>{
        failed(error);
      }
    );
  }
}
