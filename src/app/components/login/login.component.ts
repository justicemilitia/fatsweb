import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../services/authenticationService/authentication.service";
import { LanguageService } from "../../services/languageService/language.service";
import { BaseComponent } from "../base/base.component";
import { BaseService } from "../../services/base.service";
import { User } from "src/app/models/LoginUser";
import { UserFirm } from "src/app/models/UserFirm";
import { Firm } from "src/app/models/Firm";

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

  ngOnInit() {}

  Login() {
    this.baseService.authenticationService.Login(this.loginUser);
  }

  GetUserFirms(usermail: string) {    
    this.baseService.authenticationService.getUserFirmList(result => {
      this.userFirms = result;
      if(this.firms.length == 0){
      this.userFirms.forEach(e => {
        let firm: Firm = new Firm();
        Object.assign(firm, e.Firm);
        this.firms.push(firm);
      });
    }
    }, usermail);  
  }

  IsUserMailCorrect() {
    if (this.userFirms != null) return true;
    else return false;
  }
  LogOut() {}


}
