import { Injectable } from "@angular/core";
import { ExpenseCenter } from "src/app/models/ExpenseCenter";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  SERVICE_URL,
  INSERT_EXPENSECENTER,
  GET_HEADERS,
  GET_EXPENSECENTER_LIST,
  UPDATE_EXPENSECENTER,
  GET_EXPENSECENTER_BY_ID
} from "../../declarations/service-values";
import { Response } from 'src/app/models/Response';

@Injectable({
  providedIn: "root"
})
export class ExpenseCenterService {

  expenseCenterData:ExpenseCenter[]=[];

  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) {}

  GetExpenseCenters(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_EXPENSECENTER_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          let expenseCenters: ExpenseCenter[] = [];
          
          (<ExpenseCenter[]>response.ResultObject).forEach((e) => {
              let expCenter: ExpenseCenter = new ExpenseCenter();
              Object.assign(expCenter, e);
              expenseCenters.push(expCenter);
          });
  
          callback(expenseCenters);
        },
        error => console.error(error)
      );
  }

  InsertExpenseCenter(expenseCenter: ExpenseCenter) {
    debugger;
    this.httpClient
      .post(SERVICE_URL + INSERT_EXPENSECENTER, expenseCenter, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
  }

  UpdateExpenseCenter(expenseCenter: ExpenseCenter) {
    this.httpClient.put(SERVICE_URL + UPDATE_EXPENSECENTER, expenseCenter, {
      headers: GET_HEADERS(this.aService.getToken())
    });
  }


  GetExpenseCenteryId(callback, expenseCenterId: number) {
    this.httpClient
      .get(SERVICE_URL + GET_EXPENSECENTER_BY_ID + "/" + expenseCenterId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(result => {
      
        this.expenseCenterData = <ExpenseCenter[]>result["ResultObject"];
        callback(this.expenseCenterData);
      });
  }
}
