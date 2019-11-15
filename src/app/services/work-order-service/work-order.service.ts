import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../authenticationService/authentication.service';
import { ErrorService } from '../error-service/error.service';
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { SERVICE_URL, GET_HEADERS, GET_WORK_ORDER_LIST, GET_WORK_ORDERS_BY_FIXEDASSETCARD_ID, GET_VALID_BARCODE_LAST_NUMBER, GET_VALID_WORK_ORDER_CODE, GET_CONSUMABLES_BY_CONSUMABLE_CARD_ID, GET_WORK_STEPS_BY_FIXED_ASSET_ID, REPORT_BREAKDOWN_WITH_FILE_UPLOAD, GET_WORK_ORDER_PERIOD_TYPES, ADD_WORK_ORDER, GET_WORK_STEP_LIST_BY_WORK_ORDER_ID, GET_WORKSTEPDETAIL_BY_WORK_STEP_ID, UPDATE_WORK_ORDER } from '../../declarations/service-values';
import { Maintenance } from '../../models/Maintenance';
import { WorkOrders } from 'src/app/models/WorkOrders';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material';
import { Consumable } from 'src/app/models/Consumable';
import { ConsumableProperties } from 'src/app/models/ConsumableProperties';
import { PeriodTypes } from 'src/app/models/PeriodTypes';
import { WorkOrderPeriodTypes } from 'src/app/models/WorkOrderPeriodTypes';
import { WorkStep } from 'src/app/models/WorkStep';
import { resetComponentState } from '@angular/core/src/render3/state';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService
  ) {
  }

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

  GetWorkStepListByWorkOrderId(workOrderId:WorkOrders,success,failed){
    this.httpClient.post(SERVICE_URL + GET_WORK_STEP_LIST_BY_WORK_ORDER_ID, workOrderId,{
      headers:GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(result=>{
      let response:Response=<Response>result;
      if(response.ResultStatus == true){       
          let workOrder:WorkOrders = new WorkOrders();
          Object.assign(workOrder,response.ResultObject); 
          
        success(workOrder,response.LanguageKeyword);
      }else{
        failed(getAnErrorResponse(response.LanguageKeyword));
      }
      },(error:HttpErrorResponse)=>{
        failed(error);
      }
    );
  }

  GetWorkStepDetailByWorkStepId(WorkStepId:number,success,failed){
    
    this.httpClient.post(SERVICE_URL+ GET_WORKSTEPDETAIL_BY_WORK_STEP_ID,{WorkStepId:WorkStepId},{
      headers:GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(result=>{
      let response:Response=<Response>result;
      if(response.ResultStatus == true){
        let workStep:WorkStep=new WorkStep();
        Object.assign(workStep,response.ResultObject);
        success(workStep,response.LanguageKeyword);
      }else{
        failed(getAnErrorResponse(response.LanguageKeyword));
      }
    },(error:HttpErrorResponse)=>{
      failed(error);
    });
  }

  GetWorkOrderByFixedAssetCardId(fixedassetcardId:number,success,failed){
    this.httpClient.post(SERVICE_URL + GET_WORK_ORDERS_BY_FIXEDASSETCARD_ID, fixedassetcardId,{
      headers: GET_HEADERS(this.authenticationService.getToken())
    })
    .subscribe(result => {
        let response:Response=<Response>result;
        if(response.ResultStatus == true){            
            let workOrder:WorkOrders=new WorkOrders();
            Object.assign(workOrder,response.ResultObject);    
            success(workOrder,response.LanguageKeyword);
        }else{
            failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      (error:HttpErrorResponse)=>{
        
        failed(error);
      }
    );
  }


  GetWorkStepsByFixedAssetId(maintenance:Maintenance, success, failed) {
    this.httpClient
      .post(SERVICE_URL + GET_WORK_STEPS_BY_FIXED_ASSET_ID, maintenance, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let maintenance: Maintenance = new Maintenance();
            Object.assign(maintenance, response.ResultObject)
            success(maintenance, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
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
    this.httpClient.post(SERVICE_URL + GET_CONSUMABLES_BY_CONSUMABLE_CARD_ID,{ConsumableCardId:consumableCardId},{
      headers:GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(result=>{
      let response:Response=<Response>result;
      if(response.ResultStatus==true){
        let consumables:ConsumableProperties[]=[];
        (<ConsumableProperties[]>response.ResultObject).forEach(e=>{
          let consumable:ConsumableProperties=new ConsumableProperties();
          if(e.ConsumableParentId != null){
            Object.assign(consumable,e);
            consumables.push(consumable);
          }
        }); 
        success(consumables,response.LanguageKeyword);
      }else{
        failed(getAnErrorResponse(response.LanguageKeyword));
      }
    },(error:HttpErrorResponse)=>{
      failed(error);
    })
  }
  
  ReportBreakdown(maintenance: Maintenance, files: any, success, failed){

    let formData = new FormData();
    formData.append("model", JSON.stringify(maintenance));    
    
    if (files && files.length > 0)
    { 
     for (let i = 0; i < files.length; i++) {
      formData.append(files[i].name, files[i]);       
     }
      // formData.append(files[0].name, files[0]);
      
    }
    let headers: HttpHeaders=new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + this.authenticationService.getToken());
    headers = headers.append('Accept', 'application/json');


    this.httpClient
      .post(
        SERVICE_URL + REPORT_BREAKDOWN_WITH_FILE_UPLOAD, formData, {
          headers: headers
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let maintenance: Maintenance = new Maintenance();
            Object.assign(maintenance, response.ResultObject);
            success(response.ResultObject, response.LanguageKeyword);            
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  GetWorkOrderPeriodTypes(success,failed){
    this.httpClient.get(SERVICE_URL + GET_WORK_ORDER_PERIOD_TYPES,{headers:GET_HEADERS(this.authenticationService.getToken())}).subscribe(result => {
      let response: Response = <Response>result;
      if(response.ResultStatus == true){
        let periods:WorkOrderPeriodTypes[]=[];
        (<WorkOrderPeriodTypes[]>response.ResultObject).forEach(e=>{
          let period:WorkOrderPeriodTypes=new WorkOrderPeriodTypes();
            Object.assign(period,e);
            periods.push(period);          
        }); 
        success(periods,response.LanguageKeyword);
      }else{
        failed(getAnErrorResponse(response.LanguageKeyword));
      }
    },error=>{
      failed(error);
    });
  }

  AddWorkOrder(workOrder:WorkOrders,success,failed){
    this.httpClient.post(SERVICE_URL + ADD_WORK_ORDER, workOrder,{
      headers:GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(result=>{
      let response: Response = <Response>result;
      if(response.ResultStatus == true){
        success(response.LanguageKeyword);
      }else{
        failed(getAnErrorResponse(response.LanguageKeyword));
      }
    },error=>{
      failed(error);
    });
  }

  UpdateWorkOrder(workOrder:WorkOrders,success,failed){
    this.httpClient.post(SERVICE_URL + UPDATE_WORK_ORDER, workOrder,{
      headers:GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(result=>{
      let response:Response=<Response>result;
      if(response.ResultStatus==true)
        success(response.LanguageKeyword)
       else
       failed(getAnErrorResponse(response.LanguageKeyword)); 
    },error=>{
      failed(error);
    });
  }

  // FixBreakdown(workOrder: Maintenance, success, failed){

  // }

  // WorkOrderDetail(workOrder: Maintenance, success, failed){

  // }
}
