import { Injectable } from '@angular/core';
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_LOST_FA_LIST
} from "../../declarations/service-values";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Response } from "src/app/models/Response";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { ErrorService } from "../error-service/error.service";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { FixedAsset } from 'src/app/models/FixedAsset';
import { TransactionLog } from 'src/app/models/TransactionLog';

@Injectable({
  providedIn: 'root'
})
export class LostFixedAssetService {

  constructor( 
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService) { }

    GetLostFaList(){
      this.httpclient.get(SERVICE_URL + GET_LOST_FA_LIST)
    }
}
