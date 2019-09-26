import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { BaseService } from "../../services/base.service";
import { Firm } from "src/app/models/Firm";
import { HttpErrorResponse } from "@angular/common/http";
import { UserLogin } from 'src/app/models/UserLogin';
import { NgForm } from '@angular/forms';
import { getAnErrorResponse } from 'src/app/declarations/extends';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent extends BaseComponent implements OnInit {

  loginUser: UserLogin = new UserLogin();

  firms: Firm[] = [];

  isUserFirmsGetting: boolean = false;

  isLoggining: boolean = false;
  
  errorMessage: string = '';

  isWaitingForResetPassword: boolean = false;

  resetPasswordSucceed: boolean = false;

  visible: boolean = true;

  constructor(protected baseService: BaseService) {
    super(baseService);
  }

  ngOnInit() {

    /* if user cookie saved then load firms for it */
    $("#username").focus();

  }


  Login(data: NgForm) {

    if (data.form.invalid == true)
      return;

    if (this.loginUser.FirmId == -1) {
      this.GetUserFirms(this.loginUser.UserMail);
      this.errorMessage = this.getLanguageValue("Chose_firm_please");
      return;
    }

    /* isLoggining will show loading */
    this.isLoggining = true;

    /* Login if success redirect user to dashboard */
    this.baseService.authenticationService.Login(this.loginUser,
      () => {

        this.isLoggining = false;
        this.baseService.router.navigateByUrl("/dashboard");

      }, (error: HttpErrorResponse) => {

        /* show login button */
        this.isLoggining = false;

        /* if 401 error say user username or password is wrong otherwise just show error message*/
        if (error.status == 401)
          this.errorMessage = this.getLanguageValue("Username_or_Password_Incorrect");
        else {
          this.errorMessage = this.getLanguageValue("Unknown_Error");
        }

      }
    )

  }

  async GetUserFirms(usermail: string) {

    if (usermail == '' || !usermail)
      return;

    /* Loading State of firms */
    this.isUserFirmsGetting = true;


    /* Get firms from server */
    this.baseService.authenticationService.getUserFirmList(usermail,
      (result: Firm[]) => {

        /* if success put results to firms */
        this.firms = result;
        this.baseService.authenticationService.Firms = result;
        this.isUserFirmsGetting = false;
        this.errorMessage = '';

      }, (error: HttpErrorResponse) => {
        /* if any error show on screen and stop getting firms */
        let errorType:string = getAnErrorResponse(error.statusText).statusText;
        this.errorMessage = this.getLanguageValue(errorType);
        
        this.firms = [];
        this.isUserFirmsGetting = false;

      });

  }

  async SendRecoveryCode(data: NgForm) {

    if (data.form.invalid == true) return;

    if (!data.value.email || data.value.email.length < 2)
      return;

    this.isWaitingForResetPassword = true;
    await this.baseService.authenticationService.sendRecoveryCode(data.value.email, (message) => {

      this.isWaitingForResetPassword = false;
      this.resetPasswordSucceed = true;
      this.baseService.popupService.ShowSuccessPopup(message);
      data.reset();

    }, (error: HttpErrorResponse) => {

      this.baseService.popupService.ShowErrorPopup(error);
      this.isWaitingForResetPassword = false;

    });
  }

  resetPasswordAreas(event, data: NgForm) {
    data.reset();
    this.isWaitingForResetPassword = false;
    this.resetPasswordSucceed = false;
    $('#closePopup').trigger('click');
  }

}
