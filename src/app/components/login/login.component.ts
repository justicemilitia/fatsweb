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
  constructor(protected baseService: BaseService) {
    super(baseService);
  }

  ngOnInit() { }

  Login() {

    this.baseService.authenticationService.Login(
      this.loginUser,
      (error: HttpErrorResponse) => {
        if (error.error.ResultStatus == false) {
          this.IsUserMailOrPasswordCorrect();
          this.baseService.popupService.ShowErrorPopup(error);
        }
      }
    );
  }

  GetUserFirms(usermail: string) {
    this.baseService.authenticationService.getUserFirmList(result => {
      this.userFirms = result;
      if (this.firms.length == 0) {
        this.userFirms.forEach(e => {
          let firm: Firm = new Firm();
          Object.assign(firm, e.Firm);
          this.firms.push(firm);
        });
      }
    }, usermail);
  }

  IsUserMailOrPasswordCorrect() {
    return true;
  }

  IsUserMailCorrect() {
    if (this.userFirms != null) return true;
    else return false;
  }

  LogOut() { }
}
