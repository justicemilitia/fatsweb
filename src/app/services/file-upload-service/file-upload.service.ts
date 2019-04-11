import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
  HttpHeaders
} from "@angular/common/http";
import { Response } from "src/app/models/Response";
import { AuthenticationService } from "../authenticationService/authentication.service";
import {
  SERVICE_URL,
  FILE_UPLOAD,
  GET_HEADERS,
  UPLOAD_IMAGE
} from "../../declarations/service-values";
import { getAnErrorResponse } from "../../declarations/extends";

@Injectable({
  providedIn: "root"
})
export class FileUploadService {
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  FileUpload(barcodes:any,files: any, success, failed) {

    let formData=new FormData();
    formData.append("BarcodeIds",barcodes);
    if (files && files.length > 0) 
    for(let i=0; i < files.length;i++){
    formData.append(files[i].name, files[i]);
    }
    let headers:HttpHeaders=new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + this.authenticationService.getToken());
    headers = headers.append('Accept', 'application/json');

    this.httpClient
      .post(SERVICE_URL + FILE_UPLOAD, formData, {
        headers: headers
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let file = {};
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

  ImageUpload(files:any,success,failed){

    let formData = new FormData();
    
    if (files && files.length > 0) formData.append(files[0].name, files[0]);

    let headers: HttpHeaders=new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + this.authenticationService.getToken());
    headers = headers.append('Accept', 'application/json');

    this.httpClient.post(SERVICE_URL + UPLOAD_IMAGE, formData,{
      headers:headers
    }).subscribe(
      result => {
        let response: Response = <Response>result;
        
        if (response.ResultStatus == true) {       
          //let file = {};
          let filePath = response.ResultObject;

          //Object.assign(file,response.ResultObject);
          success(filePath, response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      }
    );
  }
}
