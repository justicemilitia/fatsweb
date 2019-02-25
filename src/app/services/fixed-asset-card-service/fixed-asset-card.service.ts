import { Injectable } from "@angular/core";
import {
  HttpClient,
} from "@angular/common/http";

import { GET_HEADERS,SERVICE_URL,GET_FIXEDASSETCARD_LIST,INSERT_FIXEDASSETCARD } from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from 'src/app/models/Response';
import { Router } from "@angular/router";

import { Department } from "../../models/Department";
import { FixedAssetCard } from "../../models/FixedAssetCard";

@Injectable({
  providedIn: "root"
})
export class FixedAssetCardService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private aService: AuthenticationService
  ) {}

  GetFixedAssetCard(callback,failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARD_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(result => {
        
        let response: Response = <Response>result;
        let fixedAssetCards: FixedAssetCard[] = [];
        
        (<FixedAssetCard[]>response.ResultObject).forEach((e) => {
            let fac: FixedAssetCard = new FixedAssetCard();
            Object.assign(fac, e);
            fixedAssetCards.push(fac);
        });

        callback(fixedAssetCards);
        
      },
        error => {
          failed(error);
        }
      );
  }

  InsertFixedAssetCard(fixedAssetCard: FixedAssetCard) {
    debugger;
    this.httpClient
      .post(SERVICE_URL + INSERT_FIXEDASSETCARD, fixedAssetCard, {
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
