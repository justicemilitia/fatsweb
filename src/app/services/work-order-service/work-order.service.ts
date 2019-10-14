import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../authenticationService/authentication.service';
import { ErrorService } from '../error-service/error.service';
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { SERVICE_URL, GET_HEADERS, GET_WORK_ORDER_LIST, GET_WORK_ORDERS_BY_FIXEDASSETCARD_ID, GET_VALID_BARCODE_LAST_NUMBER, GET_VALID_WORK_ORDER_CODE, GET_CONSUMABLES_BY_CONSUMABLE_CARD_ID } from '../../declarations/service-values';
import { Maintenance } from '../../models/Maintenance';
import { WorkOrders } from 'src/app/models/WorkOrders';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService
  ) {}

  GetWorkOrdersAndBreakdownRequestList(workOrder: Maintenance, success, failed) {
    this.httpClient
      .post(SERVICE_URL + GET_WORK_ORDER_LIST, workOrder,{
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let workOrders: Maintenance[] = [];
            (<Maintenance[]>response.ResultObject).forEach(e => {
              let workOrder: Maintenance = new Maintenance();
              Object.assign(workOrder, e);
              workOrders.push(workOrder);
            });
            success(workOrders, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }


  GetWorkOrderByFixedAssetCardId(fixedassetcardId:number,success,failed){
    this.httpClient.post(SERVICE_URL + GET_WORK_ORDERS_BY_FIXEDASSETCARD_ID, fixedassetcardId,{
      headers: GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(result=>{
      let response:Response=<Response>result;
      if(response.ResultStatus == true){
        let workOrders: WorkOrders[]=[];
        (<WorkOrders[]>response.ResultObject).forEach(e=>{
          let workOrder:WorkOrders=new WorkOrders();
          Object.assign(workOrder,e);
          workOrders.push(workOrder);
        });
        success(workOrders,response.LanguageKeyword);
        }else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      (error:HttpErrorResponse)=>{
        
        failed(error);
      }

      );
  }

  GetValidWorkOrderNumber(success,failed){
    this.httpClient.get(SERVICE_URL+ GET_VALID_WORK_ORDER_CODE, {
      headers:GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(result=>{
      let response:Response = <Response>result;
      if(response.ResultStatus == true){
        success(response.ResultObject,response.LanguageKeyword);
      }else{
        failed(getAnErrorResponse(response.LanguageKeyword));
      }
    },(error:HttpErrorResponse)=>{
      failed(error);
    });
  }

  GetConsumablesByConsumableCardId(consumableCardId:number,success,failed){
    this.httpClient.post(SERVICE_URL + GET_CONSUMABLES_BY_CONSUMABLE_CARD_ID, consumableCardId,{
      headers:GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(result=>{
      let response:Response=<Response>result;
      if(response.ResultStatus==true){
        console.log(response.ResultObject);
        success(response.ResultObject);
      }else{

      }
    },(error:HttpErrorResponse)=>{
      failed(error);
    })
  }
}
