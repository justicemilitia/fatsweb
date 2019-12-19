import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";

import {
  GET_HEADERS,
  SERVICE_URL,
  INSERT_AGREEMENT,
  GET_AGREEMENT_LIST,
  UPDATE_AGREEMENT,
  GET_AGREEMENT_BY_ID,
  DELETE_AGREEMENT,
  FILE_UPLOAD,
  IMAGE_URL
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "../../../../src/app/models/Response";
import { Agreement } from "../../../../src/app/models/Agreement";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';
import { Observable } from 'rxjs';
import { RequestOptions, ResponseContentType, Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: "root"
})
export class AgreementService {
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private http: Http
  ) {}

  GetAgreement(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_AGREEMENT_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let agreements: Agreement[] = [];
            (<Agreement[]>response.ResultObject).forEach(e => {
              let agreement: Agreement = new Agreement();
              Object.assign(agreement, e);
              agreements.push(agreement);
            });
            success(agreements, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertAgreement(agreement: Agreement, files: any, success, failed) {
    
    let formData = new FormData();
    
    formData.append("model", JSON.stringify(agreement));    
    if (files && files.length > 0) formData.append(files[0].name, files[0]);

    let headers: HttpHeaders=new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + this.authenticationService.getToken());
    headers = headers.append('Accept', 'application/json');

    this.httpClient
      .post(SERVICE_URL + INSERT_AGREEMENT, formData, {
        headers: headers
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedAgreement: Agreement = new Agreement();
            Object.assign(insertedAgreement, response.ResultObject);
            success(insertedAgreement, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          console.log(error);
          failed(error);
        }
      );
  }

  UpdateAgreement(agreement: Agreement,files:any, success, failed) {

    let formData = new FormData();
    
    formData.append("model", JSON.stringify(agreement));    
    if (files && files.length > 0) formData.append(files[0].name, files[0]);

    let headers: HttpHeaders=new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + this.authenticationService.getToken());
    headers = headers.append('Accept', 'application/json');

    this.httpClient
      .put(SERVICE_URL + UPDATE_AGREEMENT, formData, {
        headers: headers
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            success(agreement, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  GetAgreementById(AgreementId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_AGREEMENT_BY_ID + "/" + AgreementId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let agreement: Agreement = new Agreement();
            Object.assign(agreement, response.ResultObject);
            success(agreement, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  DeleteAgreements(ids: number[], success, failed) {
    this.httpClient
      .post(
        SERVICE_URL + DELETE_AGREEMENT,
        { AgreementIds: ids },
        {
          headers: GET_HEADERS(this.authenticationService.getToken())
        }
      )
      .subscribe(
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
        }
      );
  }

  FileUpload(files: any, success, failed) {
    // const formData = new FormData();
    // formData.append(files[0].name, files[0]);
    // formData.append("Agreement",);

    this.httpClient
      .post(SERVICE_URL + FILE_UPLOAD, files, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let file = {};
            if (files.length === 0) return;

            // for (let file of files)
            // formData.append(file.name, file);

            // const uploadReq = new HttpRequest(
            //   "POST",
            //   SERVICE_URL+FILE_UPLOAD,
            //   formData,
            //   {
            //     reportProgress: true
            //   }
            // );

            Object.assign(file, response.ResultObject);
            success(file, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  DownloadFile(data){
     const REQUEST_PARAMS = new HttpParams().set('fileName', data.fileName);
     const REQUEST_URI =  IMAGE_URL + "UploadFiles/" + data.fileName;
     window.open(REQUEST_URI, '_blank');
     return this.httpClient
     .get(REQUEST_URI, {
       headers: GET_HEADERS(this.authenticationService.getToken()),
       params: REQUEST_PARAMS,
       responseType: 'arraybuffer'
     });    
}


//   DownloadFile(filePath: string): Observable<Blob> {
//     let options = new RequestOptions({responseType: ResponseContentType.Blob });
//     return this.http.get(IMAGE_URL + "UploadFiles/" + filePath, options)
//         .map(res => res.blob())
        
// }
  
}
