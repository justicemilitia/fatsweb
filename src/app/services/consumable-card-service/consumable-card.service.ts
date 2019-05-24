import { Injectable } from "@angular/core";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_CONSUMABLE_CARDS_BY_CATEGORY_ID,
  GET_CONSUMABLE_CARD_LIST,
  INSERT_CONSUMABLE_CARD,
  UPDATE_CONSUMABLE_CARD,
  GET_CONSUMABLE_CARD_BY_ID,
  DELETE_CONSUMABLE_CARD
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { NotDeletedItem } from "src/app/models/NotDeletedItem";
import { ConsumableCategory } from "../../models/ConsumableCategory";
import { ConsumableCard } from 'src/app/models/ConsumableCard';
import { ErrorService } from "src/app/services/error-service/error.service";

@Injectable({
  providedIn: "root"
})
export class ConsumableCardService {
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService    
  ) {}

  GetConsumableCardsByCategoryId(categoryId: number,success,failed) {
    this.httpClient
      .get(
        SERVICE_URL + GET_CONSUMABLE_CARDS_BY_CATEGORY_ID + "/" + categoryId,
        { headers: GET_HEADERS(this.authenticationService.getToken()) }
      )
      .subscribe(result => {
        let response:Response = <Response>result;
        if(response.ResultStatus == true){
          let consumablecard : ConsumableCard = new ConsumableCard();
          Object.assign(consumablecard,response.ResultObject);
          success(consumablecard,response.LanguageKeyword);
        }
        else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
        (error:HttpErrorResponse) => {
          failed(error);
        });
  }

  GetConsumableCards(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_CONSUMABLE_CARD_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let consumableCards: ConsumableCard[] = [];
            (<ConsumableCard[]>response.ResultObject).forEach(e => {
              let fac: ConsumableCard = new ConsumableCard();
              Object.assign(fac, e);
              consumableCards.push(fac);
            });
            success(consumableCards, response.LanguageKeyword);
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

  InsertConsumableCard(consumableCard: ConsumableCard, success, failed) {
    this.httpClient
      .post(SERVICE_URL + INSERT_CONSUMABLE_CARD, consumableCard, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedConsumableCard = new ConsumableCard();
            Object.assign(insertedConsumableCard, response.ResultObject);
            success(insertedConsumableCard, response.LanguageKeyword);
          } else {
            failed(
              getAnErrorResponse(response.LanguageKeyword)
            );
          }
        },
        error => {
          failed(error);
        }
      );
  }

  UpdateConsumableCard(consumableCard: ConsumableCard, success, failed) {
    this.httpClient.put(SERVICE_URL + UPDATE_CONSUMABLE_CARD, consumableCard, {
      headers: GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          success(<ConsumableCard>response.ResultObject, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      }
    );
  }

  GetConsumableCardById(consumableCardId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_CONSUMABLE_CARD_BY_ID + "/" + consumableCardId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let consumableCard: ConsumableCard = new ConsumableCard();
          Object.assign(consumableCard, response.ResultObject);
          success(consumableCard, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, error => {
        failed(error);
      });
  }

  DeleteConsumableCards(ids: number[], success, failed) {
    this.httpClient.post(SERVICE_URL + DELETE_CONSUMABLE_CARD, { "ConsumableCardIds": ids }, {
      headers: GET_HEADERS(this.authenticationService.getToken()),
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
}
