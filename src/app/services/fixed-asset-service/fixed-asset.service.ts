import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { SERVICE_URL, GET_HEADERS, GET_FIXED_ASSET } from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { ErrorService } from "../error-service/error.service";
import { getAnErrorResponse } from "src/app/declarations/extends";

@Injectable({
  providedIn: "root"
})
export class FixedAssetService {
  constructor(
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService
  ) {}

  GetFixedAsset(success,failed){
    this.httpclient.get(SERVICE_URL + GET_FIXED_ASSET,{
      headers:GET_HEADERS(this.authenticationService.getToken())
    })
  }
}
