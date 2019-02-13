import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { AuthenticationService } from "../authenticationService/authentication.service";
import { MENU_LOGIN, MENU_DASHBOARD } from 'src/app/declarations/page-values';

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

    let logged = this.authentication.isLoggedIn();
    let pageKeyword = next.data.pageKeyword;
    if (pageKeyword == MENU_LOGIN) {
      if (logged == true) {
        this.router.navigate(["dashboard"]); // Eğer Kullanıcı giriş yapmışsa bu sayfaya yönlendir.
        return false;
      }
      return true;
    }

    if (logged) {

      if (pageKeyword == MENU_DASHBOARD)
        return true;
      /* Bu menüyü görmeye yetkimiz var mı kontrolü */
      var role = this.authentication.roles.find(x => x.menuCaption == pageKeyword);
      if (role) {
        return role.outBrowse ? true : false;
      }else {
        this.router.navigate(["dashboard"]); // Eğer Yetki YOksa anasayfaya at.
        return false;
      }
    } else {
      this.router.navigate(["login"]); // Eğer Giriş yapılmamışsa  giriş sayfasına at.
      return false;
    }
  }
}
