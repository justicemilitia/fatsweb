import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../services/authenticationService/authentication.service";
import { LanguageService } from "../../services/language-service/language.service";
import { BaseComponent } from "../base/base.component";
import { BaseService } from "../../services/base.service";
import { User } from "src/app/models/LoginUser";
import { UserFirm } from "src/app/models/UserFirm";
import { Firm } from "src/app/models/Firm";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent extends BaseComponent implements OnInit {
  loginUser: any = {};
  userFirms: UserFirm[] = [];
  firms: Firm[] = [];
  isUserMailCorrect: boolean = true;
  showFirmList: boolean = true;
  isPasswordCorrect:boolean=true;
  constructor(protected baseService: BaseService) {
    super(baseService);
  }

  ngOnInit() {}

  Login() {
    debugger;
    this.baseService.authenticationService.Login(
      this.loginUser,
      (error: HttpErrorResponse) => {
        if (error.error.ResultStatus == false) {
          this.isPasswordCorrect=false;          
        }
      }
    );
  }

  GetUserFirms(usermail: string) {
    this.baseService.authenticationService.getUserFirmList(
      result => {
        debugger;
        this.firms = [];
        this.userFirms = result;
        this.userFirms.forEach(e => {
          let firm: Firm = new Firm();
          Object.assign(firm, e.Firm);
          this.firms.push(firm);
        });
        this.isUserMailCorrect = true;
        this.showFirmList=false; 
      },
      usermail,
      (error: HttpErrorResponse) => {
        if (error.error.ResultStatus == false) {
          this.isUserMailCorrect = false;
          this.showFirmList=true;      
        }
      }
    );
  }

  LogOut() {}
}
