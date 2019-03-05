import { Injectable } from "@angular/core";
import { ExpenseCenter } from "src/app/models/ExpenseCenter";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  SERVICE_URL,
  INSERT_EXPENSECENTER,
  GET_HEADERS,
  GET_EXPENSECENTER_LIST,
  UPDATE_EXPENSECENTER,
  GET_EXPENSECENTER_BY_ID,
 DELETE_EXPENSECENTER
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { ErrorService } from "../error-service/error.service";
import { SubjectSubscriber } from "rxjs/internal/Subject";
import { getAnErrorResponse } from 'src/app/declarations/extends';

@Injectable({
  providedIn: "root"
})
export class ExpenseCenterService {
  expenseCenterData: ExpenseCenter[] = [];

  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService,
    private errorService: ErrorService
  ) {}

  GetExpenseCenters(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_EXPENSECENTER_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let expenseCenters: ExpenseCenter[] = [];
            (<ExpenseCenter[]>response.ResultObject).forEach(e => {
              let expCenter: ExpenseCenter = new ExpenseCenter();
              Object.assign(expCenter, e);
              expenseCenters.push(expCenter);
            });
            success(expenseCenters, response.LanguageKeyword);
          } else {
            failed(
              getAnErrorResponse(response.LanguageKeyword)
            );
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertExpenseCenter(expenseCenter: ExpenseCenter, success, failed) {
    this.httpClient
      .post(SERVICE_URL + INSERT_EXPENSECENTER, expenseCenter, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let expCenter: ExpenseCenter = new ExpenseCenter();
            Object.assign(expCenter, response.ResultObject);
            success(expCenter, response.LanguageKeyword);
          } else {
            failed(
              getAnErrorResponse(response.LanguageKeyword)
            );
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  UpdateExpenseCenter(expenseCenter: ExpenseCenter, success, failed) {
    this.httpClient
      .put(SERVICE_URL + UPDATE_EXPENSECENTER, expenseCenter, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedExpenseCenter: ExpenseCenter = new ExpenseCenter();
            Object.assign(updatedExpenseCenter, response.ResultObject);
            success(updatedExpenseCenter, response.LanguageKeyword);
          } else {
            failed(
              getAnErrorResponse(response.LanguageKeyword)
            );
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  DeleteExpenseCenters(ids: number[], success, failed) {
    this.httpClient.post(SERVICE_URL + DELETE_EXPENSECENTER, { "ExpenseCenterIds": ids }, {
      headers: GET_HEADERS(this.aService.getToken()),
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          success(response.ResultObject, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      });
  }

  GetExpenseCenterById(expenseCenterId: number,success,failed) {
    this.httpClient
      .get(SERVICE_URL + GET_EXPENSECENTER_BY_ID + "/" + expenseCenterId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(result => {
        let response:Response=<Response>result;
        if(response.ResultStatus==true){
          let expCenter:ExpenseCenter=new ExpenseCenter();
          Object.assign(expCenter,response.ResultObject);
          success(expCenter,response.LanguageKeyword);
        }
        else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },(error:HttpErrorResponse)=>{
        failed(error);
      });
  }
}
