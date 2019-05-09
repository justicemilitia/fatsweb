import { Injectable } from '@angular/core';
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_SUSPENDED_LIST,
  UNDO_SUSPENSION_PROCESS,  
  CREATE_FIXED_ASSET_FORM
} from "../../declarations/service-values";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Response } from "src/app/models/Response";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { ErrorService } from "../error-service/error.service";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { FixedAsset } from 'src/app/models/FixedAsset';
import { TransactionLog } from 'src/app/models/TransactionLog';
import { CreateDebitForm } from 'src/app/models/CreateDebitForm';
import { FixedAssetForm } from '../../models/FixedAssetForm';
@Injectable({
  providedIn: 'root'
})
export class SuspendedFixedAssetService {

  constructor(
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService) { }

    GetFixedAssetsSuspendedList(success,failed){
      this.httpclient.get(SERVICE_URL + GET_SUSPENDED_LIST,
         {headers:GET_HEADERS(this.authenticationService.getToken())})
      .subscribe(result=>{
        let response:Response=<Response>result;
        if(response.ResultStatus == true){
          let fasuspendedList:FixedAsset[]=[];
          (<FixedAsset[]>response.ResultObject).forEach(e=>{
            let fasuspended:FixedAsset=new FixedAsset();
            Object.assign(fasuspended,e);
            fasuspendedList.push(fasuspended);
          });
          success(fasuspendedList,response.LanguageKeyword);
        }else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },(error:HttpErrorResponse)=>{
        failed(error);
      });
    }

    UndoSuspensionProcess(ids:TransactionLog,success,failed){
      this.httpclient.post(SERVICE_URL+UNDO_SUSPENSION_PROCESS,ids,{
        headers:GET_HEADERS(this.authenticationService.getToken())
      }).subscribe(result=>{
        let response:Response=<Response>result;
        if(response.ResultStatus == true){          
          let updatedFixedAsset: FixedAssetForm = new FixedAssetForm();
          Object.assign(updatedFixedAsset, response.ResultObject);
          // success(updatedFixedAsset, response.LanguageKeyword);
          success(response.ResultObject, response.LanguageKeyword);
          // success(ids, response.LanguageKeyword);          
        }
        else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      });
    }
    
    CreateFixedAssetDeliveryForm(form:CreateDebitForm,success,failed){
      this.httpclient.post(SERVICE_URL+CREATE_FIXED_ASSET_FORM,form,{headers:GET_HEADERS(this.authenticationService.getToken())}).subscribe(result=>{
        let response:Response=<Response>result;
        if(response.ResultStatus==true){
          success(form,response.LanguageKeyword)
        }else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },error=>{
        failed(error);
      })
    }
}
