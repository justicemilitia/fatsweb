import { Injectable } from '@angular/core';
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_LOST_FA_LIST,
  UNDO_LOST_PROCESS
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

    GetLostFaList(success,failed){
      this.httpclient.get(SERVICE_URL + GET_LOST_FA_LIST, {headers:GET_HEADERS(this.authenticationService.getToken())})
      .subscribe(result=>{
        let response:Response=<Response>result;
        if(response.ResultStatus == true){
          let lostFaList:FixedAsset[]=[];
          (<FixedAsset[]>response.ResultObject).forEach(e=>{
            let lostFa:FixedAsset=new FixedAsset();
            Object.assign(lostFa,e);
            lostFaList.push(lostFa);
          });
          success(lostFaList,response.LanguageKeyword);
        }else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },(error:HttpErrorResponse)=>{
        failed(error);
      });
    }

    UndoLostProcess(ids:FixedAsset,success,failed){
      this.httpclient.post(SERVICE_URL+UNDO_LOST_PROCESS,ids,{
        headers:GET_HEADERS(this.authenticationService.getToken())
      }).subscribe(result => {
        let response:Response=<Response>result;
        if(response.ResultStatus == true){          
          success(ids,response.LanguageKeyword);          
        }
        else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      });
    }
}
