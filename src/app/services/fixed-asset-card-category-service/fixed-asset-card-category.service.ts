import { Injectable } from '@angular/core';
import {
   HttpClient,
} from "@angular/common/http";

import { GET_FIXEDASSETCATEGORY_LIST, SERVICE_URL, GET_HEADERS, INSERT_FIXEDASSETCARDCATEGORY } from "../../declarations/service-values";
import { AuthenticationService } from '../authenticationService/authentication.service';
import { Response } from 'src/app/models/Response';
import { Router } from "@angular/router";

import { FixedAssetCardCategory } from '../../models/FixedAssetCardCategory';

@Injectable({
  providedIn: 'root'
})
export class FixedAssetCardCategoryService {

constructor(
  private httpClient: HttpClient,
  private router: Router,
  private aService: AuthenticationService
) { }

GetFixedAssetCardCategories(callback,failed) {
  debugger;
  this.httpClient
    .get(SERVICE_URL + GET_FIXEDASSETCATEGORY_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
    .subscribe(result => {
        
      let response: Response = <Response>result;
      let fixedAssetCardCategories: FixedAssetCardCategory[] = [];
      
      (<FixedAssetCardCategory[]>response.ResultObject).forEach((e) => {
          let facc: FixedAssetCardCategory = new FixedAssetCardCategory();
          Object.assign(facc, e);
          fixedAssetCardCategories.push(facc);
      });

      callback(fixedAssetCardCategories);
      
    },
      error => {
        failed(error);
      }
    );
}

InsertFixedAssetCardCategory(fixedAssetCardCategory: FixedAssetCardCategory) {
  debugger;
  this.httpClient
    .post(SERVICE_URL + INSERT_FIXEDASSETCARDCATEGORY, fixedAssetCardCategory, { headers: GET_HEADERS(this.aService.getToken()) })
    .subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
}
}
