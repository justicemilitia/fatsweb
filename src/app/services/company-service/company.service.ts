import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Company } from "src/app/models/Company";
import {
  SERVICE_URL,
  INSERT_COMPANY,
  GET_HEADERS,
  GET_COMPANY_LIST,
  UPDATE_COMPANY,
  GET_COMPANY_BY_ID,
  DELETE_COMPANY
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { AuthenticationService } from '../authenticationService/authentication.service';
import { ErrorService } from '../error-service/error.service';

@Injectable({
  providedIn: "root"
})
export class CompanyService {

  constructor(
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService
  ) { }

  GetCompanies(success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_COMPANY_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let companies: Company[] = [];
            (<Company[]>response.ResultObject).forEach(e => {
              let comp: Company = new Company();
              Object.assign(comp, e);
              companies.push(comp);
            });
            success(companies, response.LanguageKeyword);
          } else {
            failed(this.errorService.getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertCompany(company: Company, success, failed) {
    this.httpclient.post(SERVICE_URL + INSERT_COMPANY, company, {
      headers: GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let insertedCompany: Company = new Company();
          Object.assign(insertedCompany, response.ResultObject);
          success(insertedCompany, response.LanguageKeyword);
        } else {
          failed(this.errorService.getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      });
  }

  UpdateCompany(company: Company, success, failed) {
    this.httpclient.put(SERVICE_URL + UPDATE_COMPANY, company, {
      headers: GET_HEADERS(this.authenticationService.getToken())
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          success(company, response.LanguageKeyword);
        } else {
          failed(this.errorService.getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      }
    );
  }

  GetCompanyById(companyId: number, success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_COMPANY_BY_ID + "/" + companyId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let company: Company = new Company();
          Object.assign(company, response.ResultObject);
          success(company, response.LanguageKeyword);
        } else {
          failed(this.errorService.getAnErrorResponse(response.LanguageKeyword));
        }
      }, error => {
        failed(error);
      });
  }

  DeleteCompanies(ids: number[], success, failed) {
    this.httpclient.post(SERVICE_URL + DELETE_COMPANY, { "CompanyIds": ids }, {
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
