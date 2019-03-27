import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SERVICE_URL, GET_DASHBOARD_FIXED_ASSETS_INFO, GET_HEADERS, GET_DASHBOARD_TRANSACTIONS_INFO, GET_DASHBOARD_PERSONALS_INFO } from 'src/app/declarations/service-values';
import { AuthenticationService } from '../authenticationService/authentication.service';
import { Response } from 'src/app/models/Response';
import { getAnErrorResponse } from 'src/app/declarations/extends';
import vGetDashboardTransactions from 'src/app/models/vGetDashboardTransactions';
import vGetDashboardPersonalInfo from 'src/app/models/GetDashboardPersonalInfo';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient, private aService: AuthenticationService) {

  }

  GetDashboardFixedAssetsInfo(success, failed) {
    this.httpClient.get(SERVICE_URL + GET_DASHBOARD_FIXED_ASSETS_INFO, {
      headers: GET_HEADERS(this.aService.getToken())
    }).subscribe((result: Response) => {
      if (result.ResultStatus == true) {
        success(result.ResultObject);
      } else {
        failed(getAnErrorResponse(result.LanguageKeyword));
      }
    }, (error: HttpErrorResponse) => {
      failed(error);
    })
  }

  GetDashboardTransactionsInfo(success, failed) {
    this.httpClient.get(SERVICE_URL + GET_DASHBOARD_TRANSACTIONS_INFO, {
      headers: GET_HEADERS(this.aService.getToken())
    }).subscribe((result: Response) => {
      if (result.ResultStatus == true) {


        let transactions: vGetDashboardTransactions[] = [];

        (<vGetDashboardTransactions[]>result.ResultObject).forEach(element => {
          let transaction = new vGetDashboardTransactions();
          Object.assign(transaction, element);
          transactions.push(transaction);
        });

        success(transactions);

      } else {
        failed(getAnErrorResponse(result.LanguageKeyword));
      }
    }, (error: HttpErrorResponse) => {
      failed(error);
    })
  }

  GetDashboardPersonalsInfo(success, failed) {
    this.httpClient.get(SERVICE_URL + GET_DASHBOARD_PERSONALS_INFO, {
      headers: GET_HEADERS(this.aService.getToken())
    }).subscribe((result: Response) => {
      if (result.ResultStatus == true) {
        success(result.ResultObject);
      } else {
        failed(getAnErrorResponse(result.LanguageKeyword));
      }
    }, (error: HttpErrorResponse) => {
      failed(error);
    })
  }

}
