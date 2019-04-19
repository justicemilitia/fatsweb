import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import {
  GET_HEADERS,
  SERVICE_URL,
  INSERT_DEPARTMENT,
  GET_FIXEDASSETCARDBRAND_LIST,
  INSERT_FIXEDASSETCARDBRAND,
  UPDATE_FIXEDASSETCARDBRAND,
  GET_FIXEDASSETCARDBRAND_BY_ID,
  DELETE_FIXEDASSETCARDBRAND
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { FixedAssetCardBrand } from "../../models/FixedAssetCardBrand";
import { Response } from "src/app/models/Response";
import { ErrorService } from "../error-service/error.service";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

@Injectable({
  providedIn: "root"
})
export class FixedAssetCardBrandService {
  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) { }

  GetFixedAssetCardBrands(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARDBRAND_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedAssetCardBrands: FixedAssetCardBrand[] = [];
            (<FixedAssetCardBrand[]>response.ResultObject).forEach(e => {
              let facbs: FixedAssetCardBrand = new FixedAssetCardBrand();
              Object.assign(facbs, e);
              fixedAssetCardBrands.push(facbs);
            });
            success(fixedAssetCardBrands, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertFixedAssetCardBrand(
    fixedAssetCardBrand: FixedAssetCardBrand,
    success,
    failed
  ) {
    this.httpClient
      .post(SERVICE_URL + INSERT_FIXEDASSETCARDBRAND, fixedAssetCardBrand, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedBrand: FixedAssetCardBrand = new FixedAssetCardBrand();
            Object.assign(insertedBrand, response.ResultObject);
            success(insertedBrand, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  UpdateFixedAssetCardBrand(fixedAssetCardBrand: FixedAssetCardBrand, success, failed) {
    this.httpClient
      .put(SERVICE_URL + UPDATE_FIXEDASSETCARDBRAND, fixedAssetCardBrand, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {

            let updatedFixedAssetBrand: FixedAssetCardBrand = new FixedAssetCardBrand();
            Object.assign(updatedFixedAssetBrand, response.ResultObject);

            success(updatedFixedAssetBrand, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        });
  }

  GetFixedAssetBrandById(fixedAssetCardBrandId: number, success, failed) {
    this.httpClient
      .get(
        SERVICE_URL +
        GET_FIXEDASSETCARDBRAND_BY_ID +
        "/" +
        fixedAssetCardBrandId,
        {
          headers: GET_HEADERS(this.aService.getToken())
        }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let brand: FixedAssetCardBrand = new FixedAssetCardBrand();
            Object.assign(brand, response.ResultObject);
            success(brand, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  DeleteFixedAssetCardBrands(ids: number[], success, failed) {
    this.httpClient.post(SERVICE_URL + DELETE_FIXEDASSETCARDBRAND, { FixedAssetCardBrandIds: ids }, {
      headers: GET_HEADERS(this.aService.getToken())
    }).subscribe(result => {
      let response: Response = <Response>result;
      if ((<[]>response.ResultObject).length == 0) {
        success(response.ResultObject, response.LanguageKeyword);
      } else {
        failed(<NotDeletedItem[]>response.ResultObject,getAnErrorResponse(response.LanguageKeyword));
      }
    }, (error: HttpErrorResponse) => {
      failed(error);
    });
  }
}
