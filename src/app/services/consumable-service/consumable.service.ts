import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_CONSUMABLE_LIST,
  ADD_CONSUMABLE_MATERIAL,
  GET_CONSUMABLE_CARD_UNIT_BY_ID,
  GET_CONSUMABLE_MATERIAL_BY_ID,
  ADD_FREE_REQUESTED_MATERIAL
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { Consumable } from "src/app/models/Consumable";
import { getAnErrorResponse } from "src/app/declarations/extends";

@Injectable({
  providedIn: "root"
})
export class ConsumableService {
  constructor(
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  GetConsumableList(success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_CONSUMABLE_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if ((response.ResultStatus = true)) {
            let consumables: Consumable[] = [];
            (<Consumable[]>response.ResultObject).forEach(e => {
              let consumable: Consumable = new Consumable();
              Object.assign(consumable, e);
              consumables.push(consumable);
            });
            success(consumables, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetConsumableCardUnitByCardId(cardId: number, success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_CONSUMABLE_CARD_UNIT_BY_ID + "/" + cardId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            success(response.ResultObject, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertConsumableMaterial(material: Consumable, success, failed) {
    this.httpclient
      .post(SERVICE_URL + ADD_CONSUMABLE_MATERIAL, material, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedItem: Consumable = new Consumable();
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

  GetConsumableMaterialById(consumableId: number, success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_CONSUMABLE_MATERIAL_BY_ID + "/" + consumableId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let consumable: Consumable[] = [];
            Object.assign(consumable, response.ResultObject);
            success(consumable, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  ExitConsumableMaterial(exitconsumable: Consumable, success, failed) {
    this.httpclient
      .post(SERVICE_URL + ADD_FREE_REQUESTED_MATERIAL, exitconsumable, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
        let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let exitItem: Consumable = new Consumable();
            Object.assign(exitItem, response.ResultObject);
            success(exitItem, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
      },(error: HttpErrorResponse) => {
        failed(error);
      });
  }
}
