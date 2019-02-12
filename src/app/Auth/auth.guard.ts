import { Injectable } from "@angular/core";
import {
  CanActivate, 
  ActivatedRouteSnapshot,
  RouterStateSnapshot, 
  Router
} from "@angular/router";
import { AuthenticationService } from "../services/authenticationService/authentication.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private authentication: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let logged= this.authentication.loggedIn();
  
    if (localStorage.getItem("token") != null) 
    {
      return true;
    }
    else
    {
    this.router.navigate(["login"]);
    return false;
  }
  }
}
