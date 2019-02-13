import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { AuthenticationService } from "../authenticationService/authentication.service";

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
    let pageID = next.data.pageID;
    if (pageID == -1) {
      if (logged == true) {
        this.router.navigate(["company"]); // Eğer Kullanıcı giriş yapmışsa bu sayfaya yönlendir.
        return false;
      }
      return true;
    }

    if (logged) {
      /* Bu menüyü görmeye yetkimiz var mı kontrolü */
      var menu = this.authentication.menus.find(x => x.menuId == pageID);
      if (menu) {
        return true;
      }else {
        this.router.navigate(["company"]); // Eğer Giriş yapılmamışsa  giriş sayfasına at.
        return false;
      }
    } else {
      this.router.navigate(["login"]); // Eğer Giriş yapılmamışsa  giriş sayfasına at.
      return false;
    }
  }
}
