import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authenticationService/authentication.service";
import{} from "../../declarations/service-values";
import { Response } from "src/app/models/Response";
import { ErrorService } from "../error-service/error.service";
import { User } from "src/app/models/User";
import { getAnErrorResponse } from "src/app/declarations/extends";
import { UserRole } from "src/app/models/UserRole";
import RoleAuthorization from 'src/app/models/RoleAuthorization';


@Injectable({
  providedIn: 'root'
})
export class RoleAuthorizationService {

  roleAuth:RoleAuthorization[]=[];

  constructor(  private httpclient: HttpClient,
    private aService: AuthenticationService,
    private errorService: ErrorService) { }

    GetRoleAuth(){
      
    }
}
