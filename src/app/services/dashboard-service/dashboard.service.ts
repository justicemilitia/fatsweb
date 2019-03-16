import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SERVICE_URL,GET_DASHBOARD_VALUES, GET_HEADERS } from 'src/app/declarations/service-values';
import { AuthenticationService } from '../authenticationService/authentication.service';
import { Response } from 'src/app/models/Response';
import { getAnErrorResponse } from 'src/app/declarations/extends';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient:HttpClient,private aService:AuthenticationService) {

   }

  GetDashboardValues(success,failed) {
    this.httpClient.get(SERVICE_URL + GET_DASHBOARD_VALUES,{
      headers:GET_HEADERS(this.aService.getToken())
    }).subscribe((result:Response) => {
      if(result.ResultStatus == true) {
        success(result.ResultObject);
      }else {
        failed(getAnErrorResponse(result.LanguageKeyword));
      }
    },(error:HttpErrorResponse) => {
      failed(error);
    })
  }


}
