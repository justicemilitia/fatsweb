import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  GET_HEADERS,
  SERVICE_URL,
  GET_FIXEDASSETCARDBRAND_LIST,
  GET_FIXEDASSETCARDMODEL_LIST,
  INSERT_FIXEDASSETCARDMODEL
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { FixedAssetCardBrand } from "../../models/FixedAssetCardBrand";
import { FixedAssetCardModel } from "../../models/FixedAssetCardModel";
import { Response } from "src/app/models/Response";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class FixedAssetCardModelService {
  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService,
    private router: Router
  ) {}

  GetFixedAssetCardModels(callback, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARDMODEL_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          let fixedAssetCardModels: FixedAssetCardModel[] = [];

          (<FixedAssetCardModel[]>response.ResultObject).forEach(e => {
            let facms: FixedAssetCardModel = new FixedAssetCardModel();
            Object.assign(facms, e);
            fixedAssetCardModels.push(facms);
          });
          callback(fixedAssetCardModels);
        },
        error => {
          failed(error);
        }
      );
  }

  InsertFixedAssetCardModel(fixedAssetCardModel: FixedAssetCardModel) {
    this.httpClient
      .post(SERVICE_URL + INSERT_FIXEDASSETCARDMODEL, fixedAssetCardModel, {
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
