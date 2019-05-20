import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_CYCLE_COUNT_PLAN_LIST,
  INSERT_CYCLE_COUNT_PLAN,
  GET_LOCATION_BY_CYCLE_PLAN_ID,
  UPDATE_CYCLE_COUNT_STATU,
  GET_CYCLE_PLAN_STATU,
  MAKE_COUNTING,
  GET_CYCLE_COUNT_PLAN_WITHOUT_CANCEL,
  GET_CYCLE_COUNT_RESULT,
  CANCEL_CYCLE_COUNT_PLAN,
  GET_CYCLECOUNTPLAN_BY_PLAN_ID,
  UPDATE_FIND_DIFFERENT_LOCATION
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  getAnErrorResponse,
  convertDateToNgbDate,
  convertNgbDateToDateString
} from "src/app/declarations/extends";
import { CycleCountPlan } from "src/app/models/CycleCountPlan";
import { Location } from "src/app/models/Location";
import { CycleCountResults } from "src/app/models/CycleCountResults";
import { FixedAsset } from "src/app/models/FixedAsset";

@Injectable({
  providedIn: "root"
})
export class CycleCountService {
  constructor(
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  GetCycleCountPlanWithoutCanceledPlan(success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_CYCLE_COUNT_PLAN_WITHOUT_CANCEL, {
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

  GetCycleCountResult(result: CycleCountResults, success, failed) {
    this.httpclient
      .post(SERVICE_URL + GET_CYCLE_COUNT_RESULT, result, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        (result: any) => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let cycleCountResults: CycleCountResults[] = [];
            (<CycleCountResults[]>response.ResultObject).forEach(e => {
              let cycleCountResult: CycleCountResults = new CycleCountResults();
              Object.assign(cycleCountResult, e);
              cycleCountResults.push(cycleCountResult);
            });
            console.log(cycleCountResults);
            success(cycleCountResults, result.TotalPage);
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetCycleCountResultNotFoundFixedAsset(
    result: CycleCountResults,
    success,
    failed
  ) {
    this.httpclient
      .post(SERVICE_URL + GET_CYCLE_COUNT_RESULT, result, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        (result: any) => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedAssets: FixedAsset[] = [];
            (<FixedAsset[]>response.ResultObject).forEach(e => {
              let fixedAsset: FixedAsset = new FixedAsset();
              Object.assign(fixedAsset, e);
              fixedAssets.push(fixedAsset);
            });
            success(fixedAssets, result.TotalPage);
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

  CancelCyleCountPlan(cycleCountPlan: CycleCountPlan, success, failed) {
    this.httpclient
      .post(SERVICE_URL + CANCEL_CYCLE_COUNT_PLAN, cycleCountPlan, {
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

  GetCycleCountPlanByPlanId(planId: number, success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_CYCLECOUNTPLAN_BY_PLAN_ID + "/" + planId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
        let response:Response=<Response>result;
        if(response.ResultStatus==true){
          let cyclePlan:CycleCountPlan=new CycleCountPlan();
          Object.assign(cyclePlan,response.ResultObject);
          success(cyclePlan,response.LanguageKeyword);
        }else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },(error:HttpErrorResponse)=>{
        failed(error);
      });
  }

  UpdateFindDifferentLocationsFixedassets(cycleCountPlan:CycleCountPlan,success,failed){
    this.httpclient.post(SERVICE_URL + UPDATE_FIND_DIFFERENT_LOCATION, cycleCountPlan,{
      headers: GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(result=>{
      let response:Response=new Response();
      if(response.ResultStatus==true){
        success(response.LanguageKeyword);
      }else{
        failed(getAnErrorResponse(response.LanguageKeyword));
      }
    },(error:HttpErrorResponse)=>{
      failed(error);
    });
  }


  //#region CYCLE COUNT TERMINAL

  GetLocationByCycleCountPlanId(planId: number, success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_LOCATION_BY_CYCLE_PLAN_ID + "/" + planId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let locations: Location[] = [];
            (<CycleCountPlan[]>response.ResultObject).forEach(e => {
              let location: Location = new Location();
              Object.assign(location, e.Location);
              locations.push(location);
            });
            success(locations, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  MakeCycleCounting(fixedasset: CycleCountPlan, success, failed) {
    this.httpclient
      .post(SERVICE_URL + MAKE_COUNTING, fixedasset, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedasset: CycleCountResults = new CycleCountResults();
            Object.assign(fixedasset, response.ResultObject);
            success(fixedasset, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetCycleCountPlanStatusByPlanId(planId: number, success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_CYCLE_PLAN_STATU + "/" + planId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let cyclecountplan: CycleCountPlan = new CycleCountPlan();
            Object.assign(cyclecountplan, response.ResultObject);
            success(cyclecountplan, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  UpdateCycleCountStatu(cycleCountPlan: CycleCountPlan, success, failed) {
    this.httpclient
      .post(SERVICE_URL + UPDATE_CYCLE_COUNT_STATU, cycleCountPlan, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            success(cycleCountPlan, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }
  //#endregion
}
