import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  GET_HEADERS,
  SERVICE_URL,
  UNIQUE_BARCODE,

} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { FixedAssetCard } from "../../models/FixedAssetCard";
import { ErrorService } from "src/app/services/error-service/error.service";
import { getAnErrorResponse } from 'src/app/declarations/extends';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class FixedAssetCreateService {

  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }


  isBarcodeUnique(barcode:string,success,failed){
    this.httpClient.post(SERVICE_URL + UNIQUE_BARCODE,
      {Barcode:barcode},
      {headers:GET_HEADERS(this.authenticationService.getToken())}).
      subscribe(result => {
        let response:Response=<Response>result;
        if(response.ResultStatus==true){
          success(response.ResultObject,response.LanguageKeyword);
        }
        else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      (error:HttpErrorResponse)=>{
         failed(error); 
      }
    );
  }  
}
