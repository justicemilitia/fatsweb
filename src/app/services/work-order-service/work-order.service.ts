import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../authenticationService/authentication.service';
import { ErrorService } from '../error-service/error.service';
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { SERVICE_URL, GET_HEADERS, GET_WORK_ORDER_LIST } from '../../declarations/service-values';
import { Maintenance } from '../../models/Maintenance';

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

  ReportBreakdown(workOrder: Maintenance, success, failed){

  }

  FixBreakdown(workOrder: Maintenance, success, failed){

  }

  WorkOrderDetail(workOrder: Maintenance, success, failed){

  }
}
