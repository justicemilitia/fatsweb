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
import { Response } from 'src/app/models/Response';

@Injectable({
  providedIn: "root"
})
export class CompanyService {

  companyData: Company[] = [];

  constructor(
    private httpclient: HttpClient,
    private aService: AuthenticationService,
  ) {}

  GetCompanies(callback) {
    this.httpclient
      .get(SERVICE_URL + GET_COMPANY_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(result =>{
        let response: Response = <Response>result;
        let companies: Company[] = [];
        
        (<Company[]>response.ResultObject).forEach((e) => {
            let comp: Company = new Company();
            Object.assign(comp, e);
            companies.push(comp);
        });

        callback(companies);
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
