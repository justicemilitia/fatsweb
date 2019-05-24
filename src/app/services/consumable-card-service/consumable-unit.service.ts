import { Injectable } from '@angular/core';
import { ConsumableUnit } from "src/app/models/ConsumableUnit";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  SERVICE_URL,
  INSERT_CONSUMABLE_UNIT,
  GET_HEADERS,
  GET_CONSUMABLE_UNIT_LIST,
  UPDATE_CONSUMABLE_UNIT,
  GET_CONSUMABLE_UNIT_BY_ID,
  DELETE_CONSUMABLE_UNIT
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { ErrorService } from "../error-service/error.service";
import { getAnErrorResponse } from 'src/app/declarations/extends';
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

@Injectable({
  providedIn: 'root'
})
export class ConsumableUnitService {

  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService,
    private errorService: ErrorService
  ) { }

  
  GetConsumableUnits(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_CONSUMABLE_UNIT_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let consumableUnits: ConsumableUnit[] = [];
            (<ConsumableUnit[]>response.ResultObject).forEach(e => {
              let consUnit: ConsumableUnit = new ConsumableUnit();
              Object.assign(consUnit, e);
              consumableUnits.push(consUnit);
            });
            success(consumableUnits, response.LanguageKeyword);
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

  InsertConsumableUnit(consumableUnit: ConsumableUnit, success, failed) {
    this.httpClient
      .post(SERVICE_URL + INSERT_CONSUMABLE_UNIT, consumableUnit, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let expCenter: ConsumableUnit = new ConsumableUnit();
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

  UpdateConsumableUnit(consumableUnit: ConsumableUnit, success, failed) {
    this.httpClient
      .put(SERVICE_URL + UPDATE_CONSUMABLE_UNIT, consumableUnit, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            success(consumableUnit, response.LanguageKeyword);
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

  DeleteConsumableUnits(ids: number[], success, failed) {
    this.httpClient.post(SERVICE_URL + DELETE_CONSUMABLE_UNIT, { "ConsumableUnitIds": ids }, {
      headers: GET_HEADERS(this.aService.getToken()),
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        if ((<[]>response.ResultObject).length == 0) {
          success(response.ResultObject, response.LanguageKeyword);
        } else {
          failed(<NotDeletedItem[]>response.ResultObject,getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      });
  }

  GetConsumableUnitById(consumableUnitId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_CONSUMABLE_UNIT_BY_ID + "/" + consumableUnitId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          success(response.ResultObject, response.LanguageKeyword);
        }
        else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, (error: HttpErrorResponse) => {
        failed(error);
      });
  }
}
