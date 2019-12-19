import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  SERVICE_URL,
  GET_HEADERS,
  INSERT_FIXEDASSETCARDPROPERTY,
  UPDATE_FIXEDASSETCARDPROPERTY,
  DELETE_FIXEDASSETCARDPROPERTY,
  GET_FIXEDASSETCARDPROPERTY_BY_ID,
  GET_FIXEDASSETCARDPROPERTY_BY_TYPEID,
  GET_FIXEDASSETCARDPROPERTY_LIST,
  GET_FIXEDASSETCARDPROPERTYTYPE_LIST,
  GET_PROPERTYVALUES_BY_PROPERTYID
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { FixedAssetCardProperty } from "../../models/FixedAssetCardProperty";
import { FixedAssetCardPropertyValue } from 'src/app/models/FixedAssetCardPropertyValue';
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

@Injectable({
  providedIn: "root"
})
export class FixedAssetCardPropertyService {
  fixedAssetCardPropertyData: FixedAssetCardProperty[] = [];

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  GetFixedAssetCardProperties(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARDPROPERTY_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedAssetCardProperties: FixedAssetCardProperty[] = [];
            (<FixedAssetCardProperty[]>response.ResultObject).forEach(e => {
              let facp: FixedAssetCardProperty = new FixedAssetCardProperty();
              Object.assign(facp, e);
              fixedAssetCardProperties.push(facp);
            });
            success(fixedAssetCardProperties, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertFixedAssetCardProperty(
    fixedAssetCardProperty: FixedAssetCardProperty,
    success,
    failed
  ) {
    this.httpClient
      .post(
        SERVICE_URL + INSERT_FIXEDASSETCARDPROPERTY,
        fixedAssetCardProperty,
        {
          headers: GET_HEADERS(this.authenticationService.getToken())
        }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedFixedAssetCardProperty: FixedAssetCardProperty = new FixedAssetCardProperty();
            Object.assign(
              insertedFixedAssetCardProperty,
              response.ResultObject
            );
            success(insertedFixedAssetCardProperty, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  UpdateFixedAssetCardProperty(
    fixedAssetCardProperty: FixedAssetCardProperty,
    success,
    failed
  ) {
    this.httpClient
      .put(
        SERVICE_URL + UPDATE_FIXEDASSETCARDPROPERTY,
        fixedAssetCardProperty,
        {
          headers: GET_HEADERS(this.authenticationService.getToken())
        }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let _updatedFixedAssetCardProperty: FixedAssetCardProperty = new FixedAssetCardProperty();
            Object.assign(_updatedFixedAssetCardProperty,fixedAssetCardProperty);
            success(_updatedFixedAssetCardProperty, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  GetFixedAssetCardPropertyById(
    fixedAssetCardPropertyId: number,
    success,
    failed
  ) {
    this.httpClient
      .get(
        SERVICE_URL +
          GET_FIXEDASSETCARDPROPERTY_BY_ID +
          "/" +
          fixedAssetCardPropertyId,
        {
          headers: GET_HEADERS(this.authenticationService.getToken())
        }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedAssetCardProperty: FixedAssetCardProperty = new FixedAssetCardProperty();
            Object.assign(fixedAssetCardProperty, response.ResultObject);
            success(fixedAssetCardProperty, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  DeleteFixedAssetCardProperties(ids: number[], success, failed) {
    this.httpClient
      .post(
        SERVICE_URL + DELETE_FIXEDASSETCARDPROPERTY,
        { FixedAssetCardPropertyIds: ids },
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
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetFixedAssetCardPropertyTypes(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARDPROPERTYTYPE_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedAssetCardProperties: FixedAssetCardProperty[] = [];
            (<FixedAssetCardProperty[]>response.ResultObject).forEach(e => {
              let facp: FixedAssetCardProperty = new FixedAssetCardProperty();
              Object.assign(facp, e);
              fixedAssetCardProperties.push(facp);
            });
            success(fixedAssetCardProperties, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetFixedAssetCardPropertyValues(success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIXEDASSETCARDPROPERTYTYPE_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedAssetCardProperties: FixedAssetCardProperty[] = [];
            (<FixedAssetCardProperty[]>response.ResultObject).forEach(e => {
              let facp: FixedAssetCardProperty = new FixedAssetCardProperty();
              Object.assign(facp, e);
              fixedAssetCardProperties.push(facp);
            });
            success(fixedAssetCardProperties, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetFixedAssetPropertyValueByPropertyId(propertyId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_PROPERTYVALUES_BY_PROPERTYID + "/" + propertyId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(result => {
        let response:Response=<Response>result;
        if(response.ResultStatus==true){     
          let fixedAssetCardProperties: FixedAssetCardProperty[] = [];
          (<FixedAssetCardProperty[]>response.ResultObject).forEach(e => {
            let facp: FixedAssetCardProperty = new FixedAssetCardProperty();
            Object.assign(facp, e);
            fixedAssetCardProperties.push(facp);
          });
          success(fixedAssetCardProperties,response.LanguageKeyword);
        }
        else{
          failed(getAnErrorResponse(response.LanguageKeyword));
        }  
      },error=>{
        failed(error);
      });
  }
}
