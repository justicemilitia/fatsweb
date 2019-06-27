import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SERVICE_URL, GET_DASHBOARD_FIXED_ASSETS_INFO, GET_HEADERS, GET_DASHBOARD_TRANSACTIONS_INFO, GET_DASHBOARD_PERSONALS_INFO, GET_DASHBOARD_FIXED_ASSETS_COUNTS, GET_DASHBOARD_FIXED_ASSETS_COUNT_BY_LOCATIONS, GET_DASHBOARD_FIXED_ASSETS_COUNT_BY_DEPARTMENTS, GET_DASHBOARD_FIXED_ASSETS_STATUS_COUNT, GET_DASHBOARD_FIXED_ASSET_PRICE_COUNT_LINE, GET_DASHBOARD_FIXED_ASSETS_COUNT_BY_CATEGORY } from 'src/app/declarations/service-values';
import { AuthenticationService } from '../authenticationService/authentication.service';
import { Response } from 'src/app/models/Response';
import { getAnErrorResponse } from 'src/app/declarations/extends';
import vGetDashboardTransactions from 'src/app/models/vGetDashboardTransactions';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient, private aService: AuthenticationService) {

  }


  GetFixedAssetsStatusCount(success, failed) {
    this.httpClient.get(SERVICE_URL + GET_DASHBOARD_FIXED_ASSETS_STATUS_COUNT, {
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

  GetFixedAssetCountByDepartment(success, failed) {
    this.httpClient.get(SERVICE_URL + GET_DASHBOARD_FIXED_ASSETS_COUNT_BY_DEPARTMENTS, {
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

  GetFixedAssetCountByCategory(success, failed) {
    this.httpClient.get(SERVICE_URL + GET_DASHBOARD_FIXED_ASSETS_COUNT_BY_CATEGORY, {
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

  GetFixedAssetCountByLocation(success, failed) {
    this.httpClient.get(SERVICE_URL + GET_DASHBOARD_FIXED_ASSETS_COUNT_BY_LOCATIONS, {
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

  GetDashboardFixedAssetsCount(groupTypes: any, success, failed) {
    this.httpClient.get(SERVICE_URL + GET_DASHBOARD_FIXED_ASSETS_COUNTS + "?priceGroupType=" + groupTypes.priceGroupType
      + "&activeGroupType=" + groupTypes.activeGroupType + "&totalGroupType=" + groupTypes.totalGroupType
      , {
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

  GetDashboardFixedAssetPriceCountLine(groupType: number, previous: number, success, failed) {
    this.httpClient.get(SERVICE_URL + GET_DASHBOARD_FIXED_ASSET_PRICE_COUNT_LINE + "?previous=" + previous + "&groupType=" + groupType, {
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
