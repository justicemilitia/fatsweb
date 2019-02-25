import { Injectable } from "@angular/core";
import {
  HttpClient
} from "@angular/common/http";

import { GET_DEPARTMENT_LIST, GET_HEADERS, SERVICE_URL, INSERT_DEPARTMENT, GET_LOCATION_LIST, GET_FIXEDASSETCARDBRAND_LIST, INSERT_FIXEDASSETCARDBRAND } from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { FixedAssetCardBrand } from '../../models/FixedAssetCardBrand';
import { Response } from 'src/app/models/Response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FixedAssetCardBrandService {

constructor(
  private httpClient: HttpClient,
  private aService: AuthenticationService,
  private router: Router) { }

  GetFixedAssetCardBrands(callback,failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARDBRAND_LIST, { headers: GET_HEADERS(this.aService.getToken()) })
      .subscribe(result => {
        
        let response: Response = <Response>result;
        let fixedAssetCardBrands: FixedAssetCardBrand[] = [];
        
        (<FixedAssetCardBrand[]>response.ResultObject).forEach((e) => {
            let facbs: FixedAssetCardBrand = new FixedAssetCardBrand();
            Object.assign(facbs, e);
            fixedAssetCardBrands.push(facbs);
        });
        callback(fixedAssetCardBrands);
      },
        error => {
          failed(error);
        }
      );
  }

  InsertFixedAssetCardBrand(fixedAssetCardBrand: FixedAssetCardBrand) {
    this.httpClient
      .post(SERVICE_URL + INSERT_FIXEDASSETCARDBRAND, fixedAssetCardBrand, { headers: GET_HEADERS(this.aService.getToken()) })
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
