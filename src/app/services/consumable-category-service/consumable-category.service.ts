import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authenticationService/authentication.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SERVICE_URL, INSERT_CONSUMABLE_CATEGORY, UPDATE_CONSUMABLE_CATEGORY, DELETE_CONSUMABLE_CATEGORY, GET_CONSUMABLE_CATEGORY_BY_ID, GET_CONSUMABLE_CATEGORY_LIST, GET_HEADERS } from '../../declarations/service-values';
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from 'src/app/declarations/extends';
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';
import { ConsumableCategory } from '../../models/ConsumableCategory';

@Injectable({
  providedIn: 'root'
})
export class ConsumableCategoryService {

constructor(private httpClient: HttpClient,
  private authenticationService: AuthenticationService) { }

  GetConsumableCategories(success, failed) {
    this.httpClient.get(SERVICE_URL + GET_CONSUMABLE_CATEGORY_LIST, {
      headers: GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let consumableCategories: ConsumableCategory[] = [];
          (<ConsumableCategory[]>response.ResultObject).forEach(e => {
            let cc: ConsumableCategory = new ConsumableCategory();
            Object.assign(cc, e);
            consumableCategories.push(cc);
          });
          success(consumableCategories, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, (error: HttpErrorResponse) => {
        failed(error);
      });
  }

  InsertConsumableCategory(consumableCategory: ConsumableCategory, success, failed) {
    this.httpClient
      .post(
        SERVICE_URL + INSERT_CONSUMABLE_CATEGORY, consumableCategory, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedConsumableCategory: ConsumableCategory = new ConsumableCategory();
            Object.assign(insertedConsumableCategory, response.ResultObject);
            success(insertedConsumableCategory, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  UpdateConsumableCategory(consumableCategory: ConsumableCategory, success, failed) {
    this.httpClient
      .put(SERVICE_URL + UPDATE_CONSUMABLE_CATEGORY, consumableCategory, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let _updatedConsumableCategory: ConsumableCategory = new ConsumableCategory();
            Object.assign(_updatedConsumableCategory, consumableCategory);
            success(_updatedConsumableCategory, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  GetConsumableCategoryById(consumableCategoryId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_CONSUMABLE_CATEGORY_BY_ID + "/" + consumableCategoryId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let consumableCategory: ConsumableCategory = new ConsumableCategory();
          Object.assign(consumableCategory, response.ResultObject);
          success(consumableCategory, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, error => {
        failed(error);
      });
  }

  DeleteConsumableCardCategories(ids: number[], success, failed) {
    this.httpClient.post(SERVICE_URL + DELETE_CONSUMABLE_CATEGORY, { "ConsumableCategoryIds": ids }, {
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
