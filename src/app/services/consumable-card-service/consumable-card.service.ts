import { Injectable } from "@angular/core";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_CONSUMABLE_CARDS_BY_CATEGORY_ID
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { NotDeletedItem } from "src/app/models/NotDeletedItem";
import { ConsumableCategory } from "../../models/ConsumableCategory";
import { ConsumableCard } from 'src/app/models/ConsumableCard';

@Injectable({
  providedIn: "root"
})
export class ConsumableCardService {
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
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
}
