import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent
} from "@angular/common/http";import { AuthenticationService } from '../authenticationService/authentication.service';
import { Http, RequestOptions } from "@angular/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import {
  GET_FIXEDASSETCATEGORY_LIST, SERVICE_URL, GET_HEADERS, INSERT_FIXEDASSETCATEGORY
} from "../../declarations/service-values";
import { FixedAssetCategory } from '../../models/FixedAssetCategory';

@Injectable({
  providedIn: 'root'
})
export class FixedAssetCategoryService {

constructor(
  private httpClient: HttpClient,
  private router: Router,
  private aService: AuthenticationService
) { }

GetFixedAssetCategories(callback) {
  debugger;
  this.httpClient
    .get(SERVICE_URL + GET_FIXEDASSETCATEGORY_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
    .subscribe(
      result => {
        callback(<FixedAssetCategory[]>result["ResultObject"]);
      },
      error => console.error(error)
    );
}

InsertFixedAssetCategory(fixedAssetCategory: FixedAssetCategory) {
  debugger;
  this.httpClient
    .post(SERVICE_URL + INSERT_FIXEDASSETCATEGORY, fixedAssetCategory, { headers: GET_HEADERS(this.aService.getToken()) })
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
