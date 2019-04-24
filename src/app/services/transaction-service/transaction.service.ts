import { Injectable } from "@angular/core";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  GET_HEADERS,
  SERVICE_URL,
  GET_TRANSACTION_LIST,
  GET_TRANSACTION_BY_ID
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { TransactionLog } from 'src/app/models/TransactionLog';

@Injectable({
  providedIn: "root"
})
export class TransactionService {
  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) {}

  
  GetTransactionLogList(_perInPage: number = 25, _currentPage: number = 1, success, failed) {

    this.httpClient
      .post(SERVICE_URL + GET_TRANSACTION_LIST, { Page:_currentPage, PerPage: _perInPage },
       { headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        (result:any)=>{
          let response:Response = <Response>result;
          if(response.ResultStatus==true){
            let transactionList:TransactionLog[]=[];
            (<TransactionLog[]>response.ResultObject).forEach(e=>{
              let transaction: TransactionLog = new TransactionLog();
              Object.assign(transaction,e);
              transactionList.push(transaction);
            });
            success(transactionList, result.TotalPage,response.LanguageKeyword);
          }
          else{
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },(error:HttpErrorResponse)=>{
          failed(error);
        }
      );
  }

  GetTransactionById(transactionId:number, success,failed){
    this.httpClient.get(SERVICE_URL + GET_TRANSACTION_BY_ID + "/" + transactionId, {
      headers: GET_HEADERS(this.aService.getToken())
    }).subscribe(
      result=>{
        let response: Response = <Response>result;
        if(response.ResultStatus == true){
          success(response.ResultObject,response.LanguageKeyword);
        }
        else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, error => {
        failed(error);
      }
    );
  }
}
