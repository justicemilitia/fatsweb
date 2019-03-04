import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { BaseService } from "../../services/base.service";
import { Firm } from "src/app/models/Firm";
import { HttpErrorResponse } from "@angular/common/http";
import { UserLogin } from 'src/app/models/UserLogin';
import { NgForm } from '@angular/forms';

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
      this.errorMessage = "Lütfen firma seçiniz!";
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
          this.errorMessage = "Kullanıcı adı veya şifre hatalı";
        else {
          this.baseService.popupService.ShowErrorPopup(error);
        }

      }
    )

  }

  async GetUserFirms(usermail: string) {

    if (usermail == '')
      return;

    /* Loading State of firms */
    this.isUserFirmsGetting = true;

    /* Get firms from server */
    await this.baseService.authenticationService.getUserFirmList(usermail,
      (result: Firm[]) => {

        /* if success put results to firms */
        this.firms = result;
        this.isUserFirmsGetting = false;

      },
      (error: HttpErrorResponse) => {
        /* if any error show on screen and stop getting firms */
        this.errorMessage = error.statusText;
        this.firms = [];
        this.isUserFirmsGetting = false;

      }
    );
  }

}
