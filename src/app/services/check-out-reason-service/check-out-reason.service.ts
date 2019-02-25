import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import {
  GET_HEADERS,
  SERVICE_URL,
  INSERT_CHECKOUTREASON,
  GET_CHECKOUTREASON_LIST,
  UPDATE_CHECKOUTREASON,
  GET_CHECKOUTREASON_BY_ID
} from "../../declarations/service-values";
import { CheckOutReason } from "src/app/models/CheckOutReason";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
@Injectable({
  providedIn: "root"
})
export class CheckOutReasonService {

  checkOutReasons: CheckOutReason[] = [];
  checkoutreason: CheckOutReason = new CheckOutReason();
  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) {}

  GetCheckOutReason(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_CHECKOUTREASON_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          let checkOutReasons: CheckOutReason[] = [];

          (<CheckOutReason[]>response.ResultObject).forEach(e => {
            let check: CheckOutReason = new CheckOutReason();
            Object.assign(check, e);
            checkOutReasons.push(check);
          });
          callback(checkOutReasons);
        },
        error => console.error(error)
      );
  }

  AddCheckOutReason(checkOutReason: CheckOutReason) {
    this.httpClient
      .post(SERVICE_URL + INSERT_CHECKOUTREASON, checkOutReason, {
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

  UpdateCheckOutReason(checkOutReason: CheckOutReason) {
    this.httpClient.put(SERVICE_URL + UPDATE_CHECKOUTREASON, checkOutReason, {
      headers: GET_HEADERS(this.aService.getToken())
    });
  }

  GetCheckOutReasonById(callback, checkOutReasonId: number) {
    this.httpClient
      .get(SERVICE_URL + GET_CHECKOUTREASON_BY_ID + "/" + checkOutReasonId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(result => {
        this.checkOutReasons = <CheckOutReason[]>result["ResultObject"];
        callback(this.checkOutReasons);
      });
  }
}
