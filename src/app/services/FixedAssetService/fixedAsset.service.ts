import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpClient,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent
} from "@angular/common/http";
import { Http, RequestOptions } from "@angular/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import {
  GET_HEADERS,
  SERVICE_URL,
  GET_FIXEDASSET_LIST,
  INSERT_FIXEDASSET
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Department } from "../../models/Department";
import { FixedAsset } from "../../models/FixedAsset";

@Injectable({
  providedIn: "root"
})
export class FixedAssetService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private aService: AuthenticationService
  ) {}

  GetFixedAsset(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSET_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          callback(<FixedAsset[]>result["ResultObject"]);
        },
        error => console.error(error)
      );
  }

  InsertFixedAsset(fixedAsset: FixedAsset) {
    debugger;
    this.httpClient
      .post(SERVICE_URL + INSERT_FIXEDASSET, fixedAsset, {
        headers: GET_HEADERS(this.aService.getToken())
      })
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
