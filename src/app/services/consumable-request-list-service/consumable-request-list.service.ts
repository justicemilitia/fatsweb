import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_CONSUMABLE_REQUEST_LIST,
  REQUEST_CONSUMABLE_MATERIAL,
  GET_CONSUMABLE_MATERIAL_REQUESTLIST_BY_ID,
  CANCEL_REQUEST_CONSUMABLE_MATERIAL,
  RECEIVED_CONSUMABLE_MATERIAL
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { Consumable } from "src/app/models/Consumable";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { ConsumableRequest } from "src/app/models/ConsumableRequest";

@Injectable({
  providedIn: "root"
})
export class ConsumableRequestListService {
  constructor(
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  GetConsumableRequestList(
    _perInPage: number = 25,
    _currentPage: number = 1, consumableLogType:number[],
    success,
    failed
  ) {
    this.httpclient
      .post(
        SERVICE_URL + GET_CONSUMABLE_REQUEST_LIST,
        { Page: _currentPage, PerPage: _perInPage, ConsumableLogTypeIds: consumableLogType },
        { headers: GET_HEADERS(this.authenticationService.getToken()) }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let consumableRequestList: ConsumableRequest[] = [];
            (<ConsumableRequest[]>response.ResultObject).forEach(e => {
              let consumable: ConsumableRequest = new ConsumableRequest();
              Object.assign(consumable, e);
              consumableRequestList.push(consumable);
            });
            success(consumableRequestList, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetConsumableRequestListWithFilter(consumableFilter:ConsumableRequest, success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + GET_CONSUMABLE_REQUEST_LIST, consumableFilter,
        { headers: GET_HEADERS(this.authenticationService.getToken()) }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let consumableRequestList: ConsumableRequest[] = [];
            (<ConsumableRequest[]>response.ResultObject).forEach(e => {
              let consumable: ConsumableRequest = new ConsumableRequest();
              Object.assign(consumable, e);
              consumableRequestList.push(consumable);
            });
            success(consumableRequestList, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  RequestConsumableMaterial(consumable: ConsumableRequest, success, failed) {
    this.httpclient
      .post(SERVICE_URL + REQUEST_CONSUMABLE_MATERIAL, {ConsumableId:consumable.ConsumableId, RequestedAmount:consumable.RequestedAmount, Description:consumable.Description}, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
        let response: Response = <Response>result;
        if(response.ResultStatus == true){
          let consumableRequestList: ConsumableRequest[] = [];

          Object.assign(consumableRequestList,response.ResultObject);

          success(consumableRequestList, response.LanguageKeyword);
        }
        else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }),
      (error: HttpErrorResponse) => {
        failed(error);
      };
  }

  GetRequestConsumableMaterial(consumableId: number,success,failed){

    let consumableRequest:ConsumableRequest = new ConsumableRequest();
    consumableRequest.ConsumableLogId = consumableId;

    this.httpclient.post(SERVICE_URL + GET_CONSUMABLE_MATERIAL_REQUESTLIST_BY_ID, consumableRequest, {
      headers: GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(result => {
      let response: Response = <Response>result;
      if(response.ResultStatus == true){
        let requestConsumable: ConsumableRequest=new ConsumableRequest();
        requestConsumable = <ConsumableRequest>response.ResultObject;
        success(requestConsumable,response.LanguageKeyword);
      }else
        failed(getAnErrorResponse(response.LanguageKeyword));      
    }),(error:HttpErrorResponse)=>{
      failed(error);
    };
  }

  CancelRequestConsumableMaterial(consumableIds:number,success,failed){
    this.httpclient.post(SERVICE_URL + CANCEL_REQUEST_CONSUMABLE_MATERIAL,{ConsumableLogId:consumableIds},{
      headers:GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(result =>{
      let response:Response =<Response>result;
      if(response.ResultStatus==true)
        success(response.ResultObject,response.LanguageKeyword);
      else
        failed(getAnErrorResponse(response.LanguageKeyword));
    }),(error:HttpErrorResponse)=>{
      failed(error);
    };
  }

  ReceivedConsumableMaterial(receivedConsumable:ConsumableRequest,success,failed){
    this.httpclient.post(SERVICE_URL + RECEIVED_CONSUMABLE_MATERIAL, receivedConsumable, {
      headers: GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(result => {
      let response: Response = <Response>result;
      if(response.ResultStatus == true){
        success(response.ResultStatus,response.LanguageKeyword);
      }
    }),(error:HttpErrorResponse) =>{
      failed(error);
    }
  }

}
