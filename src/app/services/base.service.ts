import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authenticationService/authentication.service";
import { ExpenseCenterService } from './ExpenseCenterService/expense-center.service';
import { CheckOutReasonService } from './check-out-reason-service/check-out-reason.service';
import { UserService } from "./user-service/user.service";
import { LanguageService } from "./language-service/language.service";
import { DepartmentService } from "./department-service/department.service";
import { LocationService } from "./location-service/location.service";
import { CompanyService } from "./company-service/company.service";
import { CountryService } from "./country-service/country.service";
import { CityService } from "./city-service/city.service";
import { FixedAssetCardCategoryService } from "./fixed-asset-card-category-service/fixed-asset-card-category.service";
import { FixedAssetCardService } from "./fixed-asset-card-service/fixed-asset-card.service";
import { PopupService } from "./popup-service/popup.service";
import { ErrorService } from "./error-service/error.service";
import { AgreementService } from "./agreement-service/agreement.service";
import { FixedAssetCardBrandService } from "./fixed-asset-card-brand-service/fixed-asset-card-brand.service";
import { FixedAssetCardModelService } from "./fixed-asset-card-model-service/fixed-asset-card-model.service";
import { RoleService } from './role-service/role.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

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
    public companyService: CompanyService,
    public countryService: CountryService,
    public cityService: CityService,
    public fixedAssetCardCategoryService: FixedAssetCardCategoryService,
    public fixedAssetCardService: FixedAssetCardService,
    public popupService: PopupService,
    public errorService:ErrorService,
    public expenseCenterService:ExpenseCenterService,
    public checkOutReasonService:CheckOutReasonService,
    public agreementService: AgreementService,
    public fixedAssetCardBrandService: FixedAssetCardBrandService,
    public fixedAssetCardModelService: FixedAssetCardModelService,
    public roleService:RoleService,
    public spinner: NgxSpinnerService,
    public router:Router
  ) {}
  
}
