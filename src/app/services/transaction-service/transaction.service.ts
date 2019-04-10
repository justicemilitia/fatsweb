import { Injectable } from "@angular/core";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  GET_HEADERS,
  SERVICE_URL,
  GET_TRANSACTION_LIST
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

  GetTransactionLogList(transaction:TransactionLog, success, failed) {
    this.httpClient
      .post(SERVICE_URL + GET_TRANSACTION_LIST, transaction, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result=>{
          let response:Response = <Response>result;
          if(response.ResultStatus==true){
            let transactionList:TransactionLog[]=[];
            (<TransactionLog[]>response.ResultObject).forEach(e=>{
              let transaction: TransactionLog = new TransactionLog();
              Object.assign(transaction,e);
              transactionList.push(transaction);
            });
            success(transactionList,response.LanguageKeyword);
          }
          else{
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },(error:HttpErrorResponse)=>{
          failed(error);
        }
      );
  }
}
