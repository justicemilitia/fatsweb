import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authenticationService/authentication.service";
import { ExpenseCenterService } from "./expense-center-service/expense-center.service";
import { CheckOutReasonService } from "./check-out-reason-service/check-out-reason.service";
import { UserService } from "./user-service/user.service";
import { LanguageService } from "./language-service/language.service";
import { DepartmentService } from "./department-service/department.service";
import { LocationService } from "./location-service/location.service";
import { CompanyService } from "./company-service/company.service";
import { CountryService } from "./country-service/country.service";
import { CityService } from "./city-service/city.service";
import { FixedAssetCardCategoryService } from "./fixed-asset-card-category-service/fixed-asset-card-category.service";
import { FixedAssetCardService } from "./fixed-asset-card-service/fixed-asset-card.service";
import { FixedAssetCardPropertyService } from "./fixed-asset-card-property-service/fixed-asset-card-property.service";
import { PopupService } from "./popup-service/popup.service";
import { ErrorService } from "./error-service/error.service";
import { AgreementService } from "./agreement-service/agreement.service";
import { FixedAssetCardBrandService } from "./fixed-asset-card-brand-service/fixed-asset-card-brand.service";
import { FixedAssetCardModelService } from "./fixed-asset-card-model-service/fixed-asset-card-model.service";
import { RoleService } from "./role-service/role.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { RoleAuthorizationService } from "./role-authorization-service/role-authorization.service";
import { RoleUserService } from "./role-user-service/role-user.service";
import { FileUploadService } from './file-upload-service/file-upload.service';
import { StatusService } from './status-service/status.service';
import { FixedAssetService } from './fixed-asset-service/fixed-asset.service';
import { DashboardService } from './dashboard-service/dashboard.service';
import { SuspendedFixedAssetService } from './suspended-fixed-asset-service/suspended-fixed-asset.service';
import { CurrencyService } from './currency-service/currency.service';
import { LostFixedAssetService } from './lost-fixed-asset-service/lost-fixed-asset.service';
import { DepreciationService } from './depreciation-service/depreciation.service';
import { AlertInfoService } from '../extends/alert-infos/alert-infos-service/alert-info.service';
import { FirmService } from './firm-service/firm.service';
import { TransactionService } from './transaction-service/transaction.service';
import { FixedAssetCreateService } from './fixed-asset-create-service/fixed-asset-create.service';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { CycleCountService } from './cycle-count-service/cycle-count.service';
import { ConsumableCategoryService } from './consumable-category-service/consumable-category.service';
import { ConsumableCard } from '../models/ConsumableCard';
import { ConsumableCardService } from './consumable-card-service/consumable-card.service';
import { ConsumableUnitService } from './consumable-card-service/consumable-unit.service';
import { ConsumableService } from './consumable-service/consumable.service';

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
    public fixedAssetCardPropertyService: FixedAssetCardPropertyService,
    public consumableCategoryService : ConsumableCategoryService,
    public consumableCardService: ConsumableCardService,
    public consumableUnitService: ConsumableUnitService,
    public consumableService: ConsumableService,
    public popupService: PopupService,
    public errorService: ErrorService,
    public expenseCenterService: ExpenseCenterService,
    public checkOutReasonService: CheckOutReasonService,
    public agreementService: AgreementService,
    public currencyService: CurrencyService,
    public fixedAssetCardBrandService: FixedAssetCardBrandService,
    public fixedAssetCardModelService: FixedAssetCardModelService,
    public fixedAssetCreateService: FixedAssetCreateService,
    public fixedAssetStatusService: StatusService,
    public roleService: RoleService,
    public roleUserService: RoleUserService,
    public fixedAssetService: FixedAssetService,
    public roleAuthorizationService: RoleAuthorizationService,
    public lostFixedAssetService: LostFixedAssetService,
    public suspendedService: SuspendedFixedAssetService,
    public depreciationService: DepreciationService,
    public fileUploadService: FileUploadService,
    public spinner: NgxSpinnerService,
    public router: Router,
    public dashboardService: DashboardService,
    public firmService: FirmService,
    public transactionService: TransactionService,
    public cycleCountService : CycleCountService,
    public alertInfoService: AlertInfoService,
    public activeRoute: ActivatedRoute) { }

}
