import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  GET_HEADERS,
  SERVICE_URL,
  GET_FIXEDASSETCARD_LIST,
  INSERT_FIXEDASSETCARD,
  UPDATE_FIXEDASSETCARD,
  GET_FIXEDASSETCARD_BY_ID,
  DELETE_FIXEDASSETCARD
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { FixedAssetCard } from "../../models/FixedAssetCard";
import { ErrorService } from "src/app/services/error-service/error.service";
import { getAnErrorResponse } from 'src/app/declarations/extends';

@Injectable({
  providedIn: "root"
})
export class FixedAssetCardService {
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService
  ) { }

  GetFixedAssetCards(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARD_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedAssetCards: FixedAssetCard[] = [];
            (<FixedAssetCard[]>response.ResultObject).forEach(e => {
              let fac: FixedAssetCard = new FixedAssetCard();
              Object.assign(fac, e);
              fixedAssetCards.push(fac);
            });
            success(fixedAssetCards, response.LanguageKeyword);
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

  InsertFixedAssetCard(fixedAssetCard: FixedAssetCard, success, failed) {
    this.httpClient
      .post(SERVICE_URL + INSERT_FIXEDASSETCARD, fixedAssetCard, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedFixedAssetCard = new FixedAssetCard();
            Object.assign(insertedFixedAssetCard, response.LanguageKeyword);
            success(insertedFixedAssetCard, response.LanguageKeyword);
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

  UpdateFixedAssetCard(fixedAssetCard: FixedAssetCard, success, failed) {
    this.httpClient.put(SERVICE_URL + UPDATE_FIXEDASSETCARD, fixedAssetCard, {
      headers: GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          success(<FixedAssetCard>response.ResultObject, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      }
    );
  }

  GetFixedAssetCardById(fixedAssetCardId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARD_BY_ID + "/" + fixedAssetCardId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let fixedAssetCard: FixedAssetCard = new FixedAssetCard();
          Object.assign(fixedAssetCard, response.ResultObject);
          success(fixedAssetCard, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      }, error => {
        failed(error);
      });
  }
  DeleteFixedAssetCards(ids: number[], success, failed) {
    this.httpClient.post(SERVICE_URL + DELETE_FIXEDASSETCARD, { "FixedAssetCardIds": ids }, {
      headers: GET_HEADERS(this.authenticationService.getToken()),
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        if ((<[]>response.ResultObject).length == 0) {
          success(response.ResultObject, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      });
  }
}
