import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authenticationService/authentication.service";
import { UserService } from "./userService/user.service";
import { LanguageService } from "./languageService/language.service";
import { DepartmentService } from "./departmentService/department.service";
import { LocationService } from "./locationService/location.service";
import { FixedAssetCategoryService } from "./FixedAssetCategoryService/fixedAssetCategory.service";
import { FixedAssetService } from "./FixedAssetService/fixedAsset.service";
import { PopupService } from "./popupService/popup.service";
import { ErrorService} from './errorService/error.service';

@Injectable({
  providedIn: "root"
})
export class BaseService {
  constructor(
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public languageService: LanguageService,
    public departmentService: DepartmentService,
    public locationService: LocationService,
    public fixedAssetCategoryService: FixedAssetCategoryService,
    public fixedAssetService: FixedAssetService,
    public popupService: PopupService,
    public errorService:ErrorService
  ) {}
}
