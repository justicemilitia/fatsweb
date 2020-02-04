import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse
} from "@angular/common/http";
import {
  SERVICE_URL,
  GET_DEPARTMENT_LIST,
  GET_HEADERS,
  GET_LOCATION_LIST,
  GET_USER_LIST,
  GET_ROLE_LIST,
  GET_FIRM_LIST,
  INSERT_USER,
  UPDATE_USER,
  DELETE_USER,
  GET_USER_BY_ID,
  GET_USERTITLE_LIST,
  GET_USER_LIST_BY_FIRM_ID,
  GET_DEBITUSER_LIST,
  CHECK_USER_PASSWORD,
  GET_USER_BY_DEPARTMENT_ID,
  GET_USER_PAGED_LIST
} from "../../declarations/service-values";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { User } from "../../models/User";
import { Department } from "../../models/Department";
import { Location } from "../../models/Location";
import { Role } from "../../models/Role";
import { Firm } from "../../models/Firm";
import { Response } from "src/app/models/Response";
import { getAnErrorResponse } from "src/app/declarations/extends";
import UserTitle from "src/app/models/UserTitle";
import { FixedAssetUser } from 'src/app/models/FixedAssetUser';
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private aService: AuthenticationService
  ) {}

  GetDepartments(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_DEPARTMENT_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          callback(<Department[]>result["ResultObject"]);
        },
        error => console.error(error)
      );
  }

  GetLocations(callback, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_LOCATION_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          callback(<Location[]>result["ResultObject"]);
        },
        error => console.error(error)
      );
  }

  GetUsers(callback, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_USER_LIST,        
        {headers: GET_HEADERS(this.aService.getToken())}
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          let users: User[] = [];

          (<User[]>response.ResultObject).forEach(e => {
            let usr: User = new User();
            Object.assign(usr, e);
            users.push(usr);
          });

          callback(users);
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetUsersByPagedList(_pageSize: number = 100, _currentPage: number = 1, callback, failed) {
    this.httpClient
      .post(SERVICE_URL + GET_USER_PAGED_LIST, 
        {PageSize: _pageSize, PageNumber: _currentPage},
        {headers: GET_HEADERS(this.aService.getToken())}
      )
      .subscribe(
        (result: any) => {
          let response: Response = <Response>result;
          let users: User[] = [];

          (<User[]>response.ResultObject).forEach(e => {
            let usr: User = new User();
            Object.assign(usr, e);
            users.push(usr);
            
          });
          callback(users, result.TotalPage, result.TotalRecords);
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetDebitUsers(callback, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_DEBITUSER_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          let users: FixedAssetUser[] = [];

          (<User[]>response.ResultObject).forEach(e => {
            let usr: FixedAssetUser = new FixedAssetUser();
            Object.assign(usr, e);
            users.push(usr);
          });

          callback(users);
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }
  
  GetUserByFirmId(firmId: number,success,failed) {
    this.httpClient
      .get(SERVICE_URL + GET_USER_LIST_BY_FIRM_ID + "/" + firmId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(result=>{
        let response:Response = <Response>result;
        let users:User[]=[];
        (<User[]>response.ResultObject).forEach(e=>{
          let user:User=new User();
          Object.assign(user,e);
          users.push(user);  
        });
        success(users,response.LanguageKeyword);
      },(error:HttpErrorResponse)=>{
        failed(error);
      });
  }

  GetUserByDepartmentId(departmentId: number,success,failed) {
    this.httpClient
      .get(SERVICE_URL + GET_USER_BY_DEPARTMENT_ID + "/" + departmentId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(result=>{
        let response:Response = <Response>result;
        let users:User[]=[];
        
        (<User[]>response.ResultObject).forEach(e=>{
          let user:User=new User();
          Object.assign(user,e);
          users.push(user);  
        });
        success(users,response.LanguageKeyword);
      },(error:HttpErrorResponse)=>{
        failed(error);
      });
  }
  
  GetRoles(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_ROLE_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let roles = [];
          (<Role[]>result["ResultObject"]).forEach(x => {
            let role = new Role();
            Object.assign(role, x);
            roles.push(role);
          });
          callback(roles);
        },
        error => console.error(error)
      );
  }

  GetUserTitles(callback) {
    this.httpClient
      .get(SERVICE_URL + GET_USERTITLE_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          callback(<UserTitle[]>result["ResultObject"]);
        },
        error => {
          console.error(error);
        }
      );
  }

  GetFirms(callback, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_FIRM_LIST, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(        
        result => {
          let firms =[];
          (<Firm[]>result["ResultObject"]).forEach(x=>{
            let firm = new Firm();
            Object.assign(firm,x);
            firms.push(firm);
          })
          callback(firms);
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  InsertUser(user: User, success, failed) {
    this.httpClient
      .post(SERVICE_URL + INSERT_USER, user, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            success(response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  UpdateUser(user: User, success, failed) {
    this.httpClient
      .post(SERVICE_URL + UPDATE_USER, user, {
        headers: GET_HEADERS(this.aService.getToken())
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
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  CheckUserPassword(user: User, success, failed) {
    this.httpClient
      .post(SERVICE_URL + CHECK_USER_PASSWORD, user, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            success(response.ResultStatus, response.LanguageKeyword);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  GetUserById(userId: number, success, failed) {
    this.httpClient
      .get(SERVICE_URL + GET_USER_BY_ID + "/" + userId, {
        headers: GET_HEADERS(this.aService.getToken())
      })
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if (response.ResultStatus == true) {
            let user = new User();
            Object.assign(user, response.ResultObject);
            success(user);
          } else {
            failed(getAnErrorResponse(response.LanguageKeyword));
          }
        },
        (error: HttpErrorResponse) => {
          failed(error);
        }
      );
  }

  DeleteUsers(ids: number[], success, failed) {
    this.httpClient
      .post(
        SERVICE_URL + DELETE_USER,
        { UserIds: ids },
        {
          headers: GET_HEADERS(this.aService.getToken())
        }
      )
      .subscribe(
        result => {
          let response: Response = <Response>result;
          if ((<[]>response.ResultObject).length == 0)
            success(response.ResultObject, response.LanguageKeyword);          
          else
            failed(<NotDeletedItem[]>response.ResultObject,getAnErrorResponse(response.LanguageKeyword));
 
        },
        error => {
          failed(error);
        }
      );
  }
}
