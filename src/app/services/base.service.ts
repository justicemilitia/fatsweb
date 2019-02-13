import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authenticationService/authentication.service";
import { UserService } from "./userService/user.service";
import { LanguageService } from "./languageService/language.service";

@Injectable({
  providedIn: "root"
})
export class BaseService {
  constructor(
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public languageService: LanguageService
  ) {}
}
