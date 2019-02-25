import { Injectable } from '@angular/core';
import {
  HttpClient,
} from "@angular/common/http";

import { GET_HEADERS,SERVICE_URL, INSERT_AGREEMENT, GET_AGREEMENT_LIST } from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from 'src/app/models/Response';
import { Router } from "@angular/router";
import { Agreement } from 'src/app/models/Agreement';

@Injectable({
  providedIn: 'root'
})
export class AgreementService {

constructor(    
  private httpClient: HttpClient,
  private router: Router,
  private aService: AuthenticationService) { }

  GetAgreement(callback,failed) {
    this.httpClient
      .get(SERVICE_URL + GET_AGREEMENT_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(result => {
        
        let response: Response = <Response>result;
        let agreements: Agreement[] = [];
        
        (<Agreement[]>response.ResultObject).forEach((e) => {
            let aggr: Agreement = new Agreement();
            Object.assign(aggr, e);
            agreements.push(aggr);
        });

        callback(agreements);
        
      },
        error => {
          failed(error);
        }
      );
  }

  InsertAgreement(agreement: Agreement) {
    debugger;
    this.httpClient
      .post(SERVICE_URL + INSERT_AGREEMENT, agreement, {
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
