import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Company } from "src/app/models/Company";
import {
  SERVICE_URL,
  INSERT_COMPANY,
  GET_HEADERS,
  GET_COMPANY_LIST,
  UPDATE_COMPANY,
  GET_COMPANY_BY_ID
} from "../../declarations/service-values";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class CompanyService {

  companyData: Company[] = [];

  constructor(
    private httpclient: HttpClient,
    private aService: AuthenticationService,
    private router: Router
  ) {}

  GetCompanies(callback) {
    this.httpclient
      .get(SERVICE_URL + GET_COMPANY_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          callback(<Company[]>result["ResultObject"]);
        },
        error => console.error(error)
      );
  }


  InsertCompany(company: Company) {
    this.httpclient
      .post(SERVICE_URL + INSERT_COMPANY, company, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        () => { this.GetCompanies(company);
        },
        error => {
          console.log(error);
        }
      );
  }

  UpdateCompany(company: Company) {
  this.httpclient
      .put(SERVICE_URL + UPDATE_COMPANY, company, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        data => {
        },
        error => {
          console.log(error);
        }
      );
  }

  GetCompanyById(callback, companyId: number) {
    this.httpclient
      .get(SERVICE_URL + GET_COMPANY_BY_ID + "/" + companyId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(result => {
        debugger;
        this.companyData = <Company[]>result["ResultObject"];
        callback(this.companyData);
        console.log(this.companyData)
      });
  }
}
