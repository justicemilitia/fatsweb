import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../authenticationService/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(protected router: Router, 
    private authenticationService: AuthenticationService) { }

  redirect(url: string) {
    this.router.navigateByUrl(url);
  }

  errorManager(error: HttpErrorResponse) {
    switch (error.status) {
      case 401:
        this.authenticationService.logOut();
        this.redirect("/login");
        break;
      case 405:
        break;
      case 500:
        break;
    }
  }

}
