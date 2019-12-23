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
  UPLOAD_IMAGE,
  DELETE_FIXEDASSET_FILE,
  DOWNLOAD_FILE
} from "../../declarations/service-values";
import { getAnErrorResponse } from "../../declarations/extends";
import { FixedAssetFile } from "src/app/models/FixedAssetFile";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { ResponseContentType, Http } from '@angular/http';


@Injectable({
  providedIn: "root"
})
export class FileUploadService {
  constructor(
    private httpClient: HttpClient,
    private http: Http,
    private authenticationService: AuthenticationService
  ) {}

  FileUpload(barcodes: any, files: any, success, failed) {
    let formData = new FormData();
    formData.append("BarcodeIds", barcodes);
    if (files && files.length > 0)
      for (let i = 0; i < files.length; i++) {
        formData.append(files[i].FileName, files[i]);
      }
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append(
      "Authorization",
      "Bearer " + this.authenticationService.getToken()
    );
    headers = headers.append("Accept", "application/json");

    this.httpClient
      .post(SERVICE_URL + FILE_UPLOAD, formData, {
        headers: headers
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let file = [];
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

  DeleteFiles(fixedAssetFileIds: number[], success, failed) {
    this.httpClient
      .post(SERVICE_URL + DELETE_FIXEDASSET_FILE, { "FixedAssetFileIds": fixedAssetFileIds }, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result=>{
       let response:Response=<Response>result;
       if(response.ResultStatus==true){
         success(response.ResultObject,response.LanguageKeyword);
       }
      },(error:HttpErrorResponse)=>{
        failed(error);
      });
  }

  ImageUpload(files: any, success, failed) {
    let formData = new FormData();

    if (files && files.length > 0) formData.append(files[0].name, files[0]);

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append(
      "Authorization",
      "Bearer " + this.authenticationService.getToken()
    );
    headers = headers.append("Accept", "application/json");

    this.httpClient
      .post(SERVICE_URL + UPLOAD_IMAGE, formData, {
        headers: headers
      })
      .subscribe(
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


  public getFile(filename: string)
  {
    return this.getFileEndpoint(filename).toPromise();
  }

  public getFileEndpoint(filename: string): Observable<Response>
  {
    return this.httpClient
    .get(SERVICE_URL + DOWNLOAD_FILE + "/" + filename, {
      headers: GET_HEADERS(this.authenticationService.getToken())
    })
    .map((response: Response) =>
    {
      return response;
    });
  }

  private baseUrl() 
  {
    if (window.location.origin)  return window.location.origin;
  
    return window.location.protocol + "//" + window.location.hostname + 
      (window.location.port ? ':' + window.location.port : '');
  }

  DownloadFile(fileName: string, fileType:string): Observable<any>{
    let fileExtension = fileType;
    // let input = fileName;
    return this.http
    .get(SERVICE_URL + DOWNLOAD_FILE + "/" + fileName,
    { responseType: ResponseContentType.Blob })
    .map(
      (res) => {
            var blob = new Blob([res.blob()], {type: fileExtension} )
            return blob;            
      });
  }
}
