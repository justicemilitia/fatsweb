import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_CYCLE_COUNT_PLAN_LIST,
  INSERT_AGREEMENT,
  INSERT_CYCLE_COUNT_PLAN,
  GET_LOCATION_BY_CYCLE_PLAN_ID
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  getAnErrorResponse,
  convertDateToNgbDate,
  convertNgbDateToDateString
} from "src/app/declarations/extends";
import { CycleCountPlan } from "src/app/models/CycleCountPlan";

@Injectable({
  providedIn: "root"
})
export class CycleCountService {
  constructor(
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  GetCycleCountPlan(success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_CYCLE_COUNT_PLAN_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let cyclecountplans: CycleCountPlan[] = [];
            (<CycleCountPlan[]>response.ResultObject).forEach(e => {
              let cyclecountplan: CycleCountPlan = new CycleCountPlan();
              Object.assign(cyclecountplan, e);
              cyclecountplans.push(cyclecountplan);
            });

            success(cyclecountplans, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertCycleCountPlan(cycleCountPlan: CycleCountPlan, success, failed) {
    this.httpclient
      .post(SERVICE_URL + INSERT_CYCLE_COUNT_PLAN, cycleCountPlan, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedItem: CycleCountPlan = new CycleCountPlan();
            Object.assign(insertedItem, response.ResultObject);
            success(insertedItem, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  CanceledCycleCountPlan(statuId: number, success, failed) {}

  GetLocationByCycleCountPlanId(planId: number, success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_LOCATION_BY_CYCLE_PLAN_ID + "/" + planId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result=>{
        let response:Response=<Response>result;
        if(response.ResultStatus==true){
          let locations:Location[]=[];
          (<CycleCountPlan[]>response.ResultObject).forEach(e=>{
            let location:Location=new Location();
            Object.assign(location,e);
            locations.push(location);
          });
          success(locations,response.LanguageKeyword);
        }
        else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },(error:HttpErrorResponse)=>{
        failed(error);
      });
  }
}
