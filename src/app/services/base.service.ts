import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authenticationService/authentication.service";
import { UserService } from "./userService/user.service";
import { LanguageService } from "./languageService/language.service";
import { DepartmentService } from './departmentService/department.service';
import { LocationService } from './locationService/location.service';
import { CompanyService } from './companyService/company.service';
import { CountryService } from './country-service/country.service';
import { CityService } from './city-service/city.service';
import { FixedAssetCategoryService } from "./FixedAssetCategoryService/fixedAssetCategory.service";
import { FixedAssetService } from "./FixedAssetService/fixedAsset.service";
import { PopupService } from "./popupService/popup.service";
import { ErrorService} from './errorService/error.service';
import { ExpenseCenter } from '../models/ExpenseCenter';
import { ExpenseCenterService } from './ExpenseCenterService/expense-center.service';
import { CheckOutReasonService } from './check-out-reason-service/check-out-reason.service';

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
    public companyService:CompanyService,
    public countryService:CountryService, 
    public cityService:CityService,
    public fixedAssetCategoryService: FixedAssetCategoryService,
    public fixedAssetService: FixedAssetService,
    public popupService: PopupService,
    public errorService:ErrorService,
    public expenseCenterService:ExpenseCenterService,
    public checkOutReasonService:CheckOutReasonService
  ) {}
}
