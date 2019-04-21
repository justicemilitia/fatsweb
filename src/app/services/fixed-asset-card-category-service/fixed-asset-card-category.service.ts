import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
} from "@angular/common/http";
import {
  SERVICE_URL,
  GET_HEADERS,
  INSERT_FIXEDASSETCARDCATEGORY,
  UPDATE_FIXEDASSETCARDCATEGORY,
  GET_FIXEDASSETCARDCATEGORY_BY_ID,
  GET_FIXEDASSETCARDCATEGORY_LIST,
  DELETE_FIXEDASSETCARDCATEGORY
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { FixedAssetCardCategory } from "../../models/FixedAssetCardCategory";
import { getAnErrorResponse } from 'src/app/declarations/extends';
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

@Injectable({
  providedIn: "root"
})
export class FixedAssetCardCategoryService {
  fixedAssetCardCategoryData: FixedAssetCardCategory[] = [];

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  GetFixedAssetCardCategories(success, failed) {
    this.httpClient.get(SERVICE_URL + GET_FIXEDASSETCARDCATEGORY_LIST, {
      headers: GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let fixedAssetCardCategories: FixedAssetCardCategory[] = [];
          (<FixedAssetCardCategory[]>response.ResultObject).forEach(e => {
            let facc: FixedAssetCardCategory = new FixedAssetCardCategory();
            Object.assign(facc, e);
            fixedAssetCardCategories.push(facc);
          });
          success(fixedAssetCardCategories, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, (error: HttpErrorResponse) => {
        failed(error);
      });
  }

  InsertFixedAssetCardCategory(fixedAssetCardCategory: FixedAssetCardCategory, success, failed) {
    this.httpClient
      .post(
        SERVICE_URL + INSERT_FIXEDASSETCARDCATEGORY, fixedAssetCardCategory, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedFixedAssetCardCategory: FixedAssetCardCategory = new FixedAssetCardCategory();
            Object.assign(insertedFixedAssetCardCategory, response.ResultObject);
            success(insertedFixedAssetCardCategory, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  UpdateFixedAssetCardCategory(fixedAssetCardCategory: FixedAssetCardCategory, success, failed) {
    this.httpClient
      .put(SERVICE_URL + UPDATE_FIXEDASSETCARDCATEGORY, fixedAssetCardCategory, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let _updatedFixedAssetCardCategory: FixedAssetCardCategory = new FixedAssetCardCategory();
            Object.assign(_updatedFixedAssetCardCategory, fixedAssetCardCategory);
            success(_updatedFixedAssetCardCategory, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  GetFixedAssetCardCategoryById(fixedAssetCardCategoryId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARDCATEGORY_BY_ID + "/" + fixedAssetCardCategoryId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let fixedAssetCardCategory: FixedAssetCardCategory = new FixedAssetCardCategory();
          Object.assign(fixedAssetCardCategory, response.ResultObject);
          success(fixedAssetCardCategory, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, error => {
        failed(error);
      });
  }

  DeleteFixedAssetCardCategories(ids: number[], success, failed) {
    this.httpClient.post(SERVICE_URL + DELETE_FIXEDASSETCARDCATEGORY, { "FixedAssetCardCategoriesIds": ids }, {
      headers: GET_HEADERS(this.authenticationService.getToken()),
    }).subscribe(
      result => {
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
