import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
  HttpHeaders
} from "@angular/common/http";
import {
  SERVICE_URL,
  GET_HEADERS,
  INSERT_FIXEDASSETCARDCATEGORY,
  UPDATE_FIXEDASSETCARDCATEGORY,
  GET_FIXEDASSETCARDCATEGORY_BY_ID,
  GET_FIXEDASSETCARDCATEGORY_LIST
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";

import { FixedAssetCardCategory } from "../../models/FixedAssetCardCategory";

@Injectable({
  providedIn: "root"
})
export class FixedAssetCardCategoryService {
  fixedAssetCardCategoryData: FixedAssetCardCategory[] = [];

  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) {}

  GetFixedAssetCardCategories(callback, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARDCATEGORY_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          let fixedAssetCardCategories: FixedAssetCardCategory[] = [];
          (<FixedAssetCardCategory[]>response.ResultObject).forEach(e => {
            let facc: FixedAssetCardCategory = new FixedAssetCardCategory();
            Object.assign(facc, e);
            fixedAssetCardCategories.push(facc);
          });
          callback(fixedAssetCardCategories);
        },
        error => console.error(error)
      );
  }

  InsertFixedAssetCardCategory(fixedAssetCardCategory: FixedAssetCardCategory, failed) {
    this.httpClient
      .post(
        SERVICE_URL + INSERT_FIXEDASSETCARDCATEGORY, fixedAssetCardCategory,{ 
          headers: GET_HEADERS(this.aService.getToken())
        })
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
        failed(error);          
        }
      );
  }

  UpdateFixedAssetCategory(fixedAssetCardCategory: FixedAssetCardCategory, failed) {
    this.httpClient
      .put(SERVICE_URL + UPDATE_FIXEDASSETCARDCATEGORY, fixedAssetCardCategory, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(  
        data=>{
          console.log(data);
        },     
        error => {          
          failed(error);
        }
      );
  }

  GetFixedAssetCardCategoryById(callback, fixedAssetCardCategoryId: number) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARDCATEGORY_BY_ID + "/" + fixedAssetCardCategoryId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(result => {
        this.fixedAssetCardCategoryData = <FixedAssetCardCategory[]>result["ResultObject"];
        callback(this.fixedAssetCardCategoryData);
        console.log(this.fixedAssetCardCategoryData);
      });
  }
}
