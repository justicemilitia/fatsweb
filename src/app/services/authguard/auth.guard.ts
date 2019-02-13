import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { MENU_LOGIN } from 'src/app/declarations/page-values';

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
    debugger;
    let logged = this.authentication.isLoggedIn();
    let pageKeyword = next.data.pageKeyword;
    if (pageKeyword == MENU_LOGIN) {
      if (logged == true) {
        this.router.navigate(["company"]); // Eğer Kullanıcı giriş yapmışsa bu sayfaya yönlendir.
        return false;
      }
      return true;
    }

    if (logged) {
      /* Bu menüyü görmeye yetkimiz var mı kontrolü */
      var role = this.authentication.roles.find(x => x.menuCaption == pageKeyword);
      if (role) {
        return true;
      }else {
        this.router.navigate(["company"]); // Eğer Giriş yapılmamışsa  giriş sayfasına at.
        return false;
      }
      debugger;
    } else {
      this.router.navigate(["login"]); // Eğer Giriş yapılmamışsa  giriş sayfasına at.
      return false;
    }
  }
}
