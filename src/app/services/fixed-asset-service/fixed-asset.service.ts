import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  SERVICE_URL,
  GET_HEADERS,
  GET_FIXED_ASSET,
  GET_FIXEDASSETCARDPROPERTY_LIST,
  EXIT_FIXEDASSET,
  GET_EXITFIXEDASSETLIST,
  UPDATE_FIXEDASSETBARCODENUMBER,
  UPDATE_FIXEDASSETLOCATION,
  UPDATE_FIXEDASSETDEPARTMENT,
  UPDATE_FIXEDASSETFIRM,
  UPDATE_FIXEDASSETDEBIT,
  DELETE_FIXEDASSETDEBIT,
  ADD_FIXEDASSETDEBIT,
  CHANGE_COLLECTIVEPARAMETER,
  SUSPENSIONPROCESS,
  LOST_PROCESS,
  CHANGE_RELATIONSHIP,
  BREAK_RELATIONSHIP,
  GET_DEBITUSER_BY_ID,
  GET_FIXEDASSET_BY_ID
} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { FixedAsset } from "src/app/models/FixedAsset";
import { FixedAssetCardProperty } from "src/app/models/FixedAssetCardProperty";
import { TransactionLog } from '../../models/TransactionLog';
import { FixedAssetComponent } from '../../components/operations/fixed-asset/fixed-asset.component';
import { FixedAssetUser } from '../../models/FixedAssetUser';
import { FixedAssetRelationship } from '../../models/FixedAssetRelationship';
import { FixedAssetFilter } from '../../models/FixedAssetFilter';
import { User } from 'src/app/models/LoginUser';

@Injectable({
  providedIn: "root"
})
export class FixedAssetService {
  constructor(
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  GetFixedAsset(success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + GET_FIXED_ASSET,
        { Page: "1", PerPage: "100", sortOrder: "asc", filter: {} },
        {
          headers: GET_HEADERS(this.authenticationService.getToken())
        }
      ).subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedAssets: FixedAsset[] = [];
            (<FixedAsset[]>response.ResultObject).forEach(e => {
              let fa: FixedAsset = new FixedAsset();
              Object.assign(fa, e);
              fixedAssets.push(fa);
            });
            success(fixedAssets, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetFixedAssetRelationship(success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + GET_FIXED_ASSET,
        { Page: "1", PerPage: "100", sortOrder: "asc", filter: {} },
        {
          headers: GET_HEADERS(this.authenticationService.getToken())
        }
      ).subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let fixedAssets: FixedAssetRelationship[] = [];
            (<FixedAssetRelationship[]>response.ResultObject).forEach(e => {
              let fa: FixedAssetRelationship = new FixedAssetRelationship();
              Object.assign(fa, e);
              fixedAssets.push(fa);
            });
            success(fixedAssets, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetExitFixedAssetList(success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_EXITFIXEDASSETLIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let exitFixedAssets: FixedAsset[] = [];
            (<FixedAsset[]>response.ResultObject).forEach(e => {
              let efa: FixedAsset = new FixedAsset();
              Object.assign(efa, e);
              exitFixedAssets.push(efa);
            });
            success(exitFixedAssets, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        }, (error: HttpErrorResponse) => {
          failed(error);
        });
  }

  GetFixedAssetProperties(success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_FIXEDASSETCARDPROPERTY_LIST, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let faProperties: FixedAssetCardProperty[] = [];
            (<FixedAssetCardProperty[]>response.ResultObject).forEach(e => {
              let faProperty: FixedAssetCardProperty = new FixedAssetCardProperty();
              Object.assign(faProperty, e);
              faProperties.push(faProperty);
            });
            success(faProperties, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  ExitFixedAsset(transactionLog: TransactionLog, success, failed){
    this.httpclient
      .post(
        SERVICE_URL + EXIT_FIXEDASSET, transactionLog, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedTransactionLog: TransactionLog = new TransactionLog();
            Object.assign(insertedTransactionLog, response.ResultObject);
            success(insertedTransactionLog, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  SuspendFixedAsset(fixedAsset: TransactionLog, success, failed){
    this.httpclient
    .post(
      SERVICE_URL + SUSPENSIONPROCESS, fixedAsset, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
    .subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          let updatedFixedAsset: FixedAsset = new FixedAsset();
          Object.assign(updatedFixedAsset, response.ResultObject);
          success(response.LanguageKeyword);
        } else {
          failed(getAnErrorResponse(response.LanguageKeyword));
        }
      },
      error => {
        failed(error);
      }
    );
  }

  LostFixedAsset(transactionLog: TransactionLog, success, failed){
    this.httpclient
      .post(
        SERVICE_URL + LOST_PROCESS, transactionLog, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedTransactionLog: TransactionLog = new TransactionLog();
            Object.assign(insertedTransactionLog, response.ResultObject);
            success(insertedTransactionLog, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  BreakFixedAssetRelationship(fixedAsset: FixedAssetRelationship, success, failed){
    this.httpclient
      .post(
        SERVICE_URL + BREAK_RELATIONSHIP, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedFixedAsset: TransactionLog = new TransactionLog();
            Object.assign(insertedFixedAsset, response.ResultObject);
            success(insertedFixedAsset, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  ChangeBarcode(fixedAsset: FixedAsset, success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + UPDATE_FIXEDASSETBARCODENUMBER, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedFixedAsset: FixedAsset = new FixedAsset();
            Object.assign(updatedFixedAsset, response.ResultObject);
            success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  ChangeLocation(fixedAsset: FixedAsset, success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + UPDATE_FIXEDASSETLOCATION, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedFixedAsset: FixedAsset = new FixedAsset();
            Object.assign(updatedFixedAsset, response.ResultObject);
            success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  ChangeDepartment(fixedAsset: FixedAsset, success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + UPDATE_FIXEDASSETDEPARTMENT, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedFixedAsset: FixedAsset = new FixedAsset();
            Object.assign(updatedFixedAsset, response.ResultObject);
            success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }
  ChangeFirm(fixedAsset: FixedAsset, success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + UPDATE_FIXEDASSETFIRM, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedFixedAsset: FixedAsset = new FixedAsset();
            Object.assign(updatedFixedAsset, response.ResultObject);
            success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  GetDebitUserListById(FixedAssetId: number, success, failed) {
    this.httpclient
      .get(SERVICE_URL + GET_DEBITUSER_BY_ID + "/" + FixedAssetId, {
        headers: GET_HEADERS(this.authenticationService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let debitUserList: FixedAssetUser[] = [];
            Object.assign(debitUserList, response.ResultObject);
            success(debitUserList, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  ChangeDebit(fixedAsset: FixedAssetUser, success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + UPDATE_FIXEDASSETDEBIT, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedFixedAsset: FixedAssetUser = new FixedAssetUser();
            Object.assign(updatedFixedAsset, response.ResultObject);
            success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  DeleteDebit(fixedAsset: FixedAssetUser, success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + DELETE_FIXEDASSETDEBIT, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let deletedFixedAsset: FixedAssetUser = new FixedAssetUser();
            Object.assign(deletedFixedAsset, response.ResultObject);
            success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  ChangeCollectiveParameter(fixedAsset: FixedAsset, success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + CHANGE_COLLECTIVEPARAMETER, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedFixedAsset: FixedAssetUser = new FixedAssetUser();
            Object.assign(updatedFixedAsset, response.ResultObject);
            success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  FilterFixedAsset(fixedAsset: FixedAssetFilter, callback, failed) {
    this.httpclient
      .post(
        SERVICE_URL + GET_FIXED_ASSET, fixedAsset,
        {
          headers: GET_HEADERS(this.authenticationService.getToken())
        }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let insertedFixedAsset: FixedAssetUser = new FixedAssetUser();
            Object.assign(insertedFixedAsset, response.ResultObject);
            callback(<FixedAsset[]>result["ResultObject"]);
            // success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }


  ChangeRelationship(fixedAsset: FixedAsset, success, failed) {
    this.httpclient
      .post(
        SERVICE_URL + CHANGE_RELATIONSHIP, fixedAsset, {
          headers: GET_HEADERS(this.authenticationService.getToken())
        })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let updatedFixedAsset: FixedAssetUser = new FixedAssetUser();
            Object.assign(updatedFixedAsset, response.ResultObject);
            success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        error => {
          failed(error);
        }
      );
  }

  GetFixedAssetById(fixedAssetId:number, success,failed){
    this.httpclient
    .get(SERVICE_URL + GET_FIXEDASSET_BY_ID + "/" + fixedAssetId, {
      headers: GET_HEADERS(this.authenticationService.getToken())
    })
    .subscribe(
      result => {
        let response: Response = <Response>result;
        if (response.ResultStatus == true) {
          success(response.ResultObject, response.LanguageKeyword);
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
