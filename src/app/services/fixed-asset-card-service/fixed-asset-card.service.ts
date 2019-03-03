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
import { Department } from "../../models/Department";
import { FixedAssetCard } from "../../models/FixedAssetCard";
import { ErrorService } from "src/app/services/error-service/error.service";

@Injectable({
  providedIn: "root"
})
export class FixedAssetCardService {
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService
  ) {}

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
              this.errorService.getAnErrorResponse(response.LanguageKeyword)
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
              this.errorService.getAnErrorResponse(response.LanguageKeyword)
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
          let _updatedFixedAssetCard: FixedAssetCard = new FixedAssetCard();
          Object.assign(_updatedFixedAssetCard, fixedAssetCard);
          success(_updatedFixedAssetCard, response.LanguageKeyword);
        } else {
          failed(this.errorService.getAnErrorResponse(response.LanguageKeyword));
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
          failed(this.errorService.getAnErrorResponse(response.LanguageKeyword));
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
        if (response.ResultStatus == true) {
          success(response.ResultObject, response.LanguageKeyword);
        } else {
          failed(this.errorService.getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      });
  }
}
