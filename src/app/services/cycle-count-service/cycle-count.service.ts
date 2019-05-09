import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_CYCLE_COUNT_PLAN_LIST
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { CycleCountPlan } from 'src/app/models/CycleCountPlan';

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
      .subscribe(result=>{
        let response: Response = <Response>result;
        if(response.ResultStatus == true){
          let cyclecountplans:CycleCountPlan[]=[];
          (<CycleCountPlan[]>response.ResultObject).forEach(e => {
            let cyclecountplan: CycleCountPlan = new CycleCountPlan();
            Object.assign(cyclecountplan, e);
            cyclecountplans.push(cyclecountplan);
          });

          success(cyclecountplans,response.LanguageKeyword);
        }else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },(error:HttpErrorResponse)=>{
        failed(error);
      });
  }

  
}
