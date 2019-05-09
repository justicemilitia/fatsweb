import { HttpHeaders } from "@angular/common/http";


//export const SERVICE_URL = "http://localhost:5000/api/";
export const SERVICE_URL = "http://localhost:11889/api/";
// export const SERVICE_URL = "http://dev.fatsapi.com/api/";
export const LOGIN = "Auth/token";

export const FORGET_PASSWORD = "Auth/forgotpassword"
export const DOCUMENT_URL = "http://dev.fatsapi.com/Documents/";
export const LANGUAGE_URL = "http://dev.fatsapi.com/Language/language.json";

export const IMAGE_URL = "http://dev.fatsapi.com/"
export const CRYPTO_KEY = "xOPecpi5elDQenHT";

//#region Departments
export const GET_DEPARTMENT_LIST = "Department/GetDepartmentsList";
export const GET_DEPARTMENT_BY_ID = "Department/GetDepartmentById";
export const INSERT_DEPARTMENT = "Department/AddDepartment";
export const UPDATE_DEPARTMENT = "Department/UpdateDepartment";
export const DELETE_DEPARTMENT = "Department/RemoveByIdList";
export const GET_DEPARTMENT_LIST_BY_LOCATION_ID = "Department/GetDepartmentsByLocationId";
export const GET_DEPARTMENTS_BY_FIRM_ID = "Department/GetDepartmentsByFirmId";
//#endregion

//#region Locations
export const GET_LOCATION_LIST = "Locations/GetLocationsList";
export const GET_LOCATION_BY_ID = "Locations/GetLocationsById";
export const INSERT_LOCATION = "Locations/AddLocation";
export const UPDATE_LOCATION = "Locations/UpdateLocation";
export const DELETE_LOCATION = "Locations/RemoveByIdList";
export const GET_LOCATIONS_BY_FIRM_ID = "Locations/GetLocationsByFirmId";
//#endregion

//#region Currency
export const GET_CURRENCY_LIST = "Currency/GetCurrencyList";
export const GET_CURRENCY_BY_ID = "Currency/GetCurrencyById";
export const INSERT_CURRENCY = "Currency/AddCurrency";
export const UPDATE_CURRENCY = "Currency/UpdateCurrency";
//#endregion

//#region Firms
export const CHANGE_FIRM = "Firm/ChangeFirmSession";
//#endregion

//#region Users
export const GET_USER_LIST = "user/GetUserList";
export const GET_USER_BY_ID = "user/GetUserById";
export const INSERT_USER = "User/AddUser";
export const UPDATE_USER = "User/UpdateUser";
export const GET_SYSTEM_USER_LIST = "User/GetSystemUserList";
export const DELETE_USER = "User/RemoveByIdList";
export const GET_USERTITLE_LIST = "UserTitle/GetTitleList";
export const GET_USER_LIST_BY_FIRM_ID = "User/GetUsersByFirmId";
export const GET_DEBITUSER_LIST = "FixedAssetUsers/GetFixedAssetUsersList";
export const GET_DEBITUSER_BY_ID = "FixedAssetUsers/GetFixedAssetUserByFixedassetId";
export const CHECK_USER_PASSWORD = "User/CheckUserIsValid";
//#endregion

//#region FixedAssetCards
export const GET_FIXEDASSETCARD_LIST = "fixedAssetcard/GetFixedAssetsCardsList";
export const GET_FIXEDASSETCARD_BY_ID = "fixedAssetcard/GetFixedAssetCardById";
export const INSERT_FIXEDASSETCARD = "fixedassetcard/AddFixedAssetCard";
export const UPDATE_FIXEDASSETCARD = "fixedassetcard/UpdateFixedAssets";
export const DELETE_FIXEDASSETCARD = "fixedassetcard/RemoveByIdList";
export const GET_FA_CARDS_BY_CATEGORY_ID = "FixedAssetCard/GetFixedAssetCardByCategoryId";
//#endregion

//#region FixedAssets
export const GET_FIXEDASSET_LIST = "FixedAsset/GetFixedAssetsList";
export const UPDATE_FIXEDASSET = "FixedAsset/UpdateFixedAsset";
export const UPDATE_FIXEDASSETBARCODENUMBER = "FixedAsset/UpdateFixedAssetBarcodeNumber";
export const UPDATE_FIXEDASSETLOCATION = "FixedAsset/ChangeLocation";
export const UPDATE_FIXEDASSETDEPARTMENT = "FixedAsset/ChangeDepartment";
export const UPDATE_FIXEDASSETFIRM = "FixedAsset/ChangeFirm";
export const GET_FIXEDASSET_BY_ID = "FixedAsset/GetFixedAssetsById";
export const SUSPENSIONPROCESS = "FixedAsset/SuspensionProcess";
export const CHANGE_RELATIONSHIP = "FixedAsset/SetFixedAssetRelationship";
export const BREAK_RELATIONSHIP = "FixedAsset/BreakFixedAssetRelationship";
export const FIXEDASSET_PROPERTY_UNIQUE_CHECK = "FixedAsset/GetFixedAssetDetailUniqueCheck";
export const UPDATE_DEPRECIATION = "Depreciation/UpdateDepreciation";
export const CALCULATE_DEPRECIATION = "Depreciation/CalculateFixedAssetDepreciationValues";
export const CALCULATE_IFRSDEPRECIATION = "DepreciationIFRS/UpdateDepreciationIFRS";
//#endregion

//#region Depreciations
export const GET_DEPRECIATIONTYPE_LIST = "DepreciationCalculationTypes/GetDepreciationCalculationTypes";
export const GET_DEPRECIATIONLIST_BY_ID="Depreciation/GetDepreciationListbyFixedAssetId";
export const GET_IFRSDEPRECIATIONLIST_BY_ID="DepreciationIFRS/GetDepreciationIFRSListbyFixedAssetId";
//#endregion

//#region FixedAssetDebit
export const ADD_FIXEDASSETDEBIT = "FixedAsset/AddDebitPersonOnBarcode";
export const UPDATE_FIXEDASSETDEBIT = "FixedAsset/ChangeDebitPersonOnBarcode";
export const PRESS_DEBITFORM = "PdfCreator/DebitChangeForm";
export const DELETE_FIXEDASSETDEBIT = "FixedAsset/DeleteDebitPersonOnBarcode";
export const GET_FIXEDASSET_DEBIT_FORM = "FixedAssetForms/GetFixedAssetDebitFormList";
// export const PRESS_DELETEDEBITFORM = "PdfCreator/CreateDebitForm";
//#endregion

//#region ChangeCollectiveParameter
export const CHANGE_COLLECTIVEPARAMETER = "FixedAsset/CollectiveChangeProcess";
//#endregion

//#region FixedAssetCreate
export const UNIQUE_BARCODE = "FixedAsset/BarcodeUniqueControl";
export const GET_PROPERTYVALUE_LIST_BY_PROPERTYVALUE_ID = "FixedAssetProperyValues/GetFixedAssetPropertyValueByPropertyId";
export const GET_VALID_BARCODE_LAST_NUMBER = "FixedAsset/GetValidBarcodeLastNumber";
export const ADD_FIXED_ASSET = "FixedAsset/AddFixedAssetWithPieces";
//#endregion


//#region ExitFixedAssets
export const EXIT_FIXEDASSET = "FixedAsset/ExitFixedAsset";
export const GET_EXITFIXEDASSETLIST = "FixedAsset/GetExitFixedAssetList";
//#endregion


//#region SuspendedFixedAsset
export const GET_SUSPENDED_LIST = "FixedAsset/GetFixedAssetsSuspendedList";
export const UNDO_SUSPENSION_PROCESS = "FixedAsset/UndoSuspensionProcess";
export const UPDATE_FIXEDASSETSUSPENDEDSTATUS = "FixedAsset/UpdateFixedAssetIsSuspendedStatus";
//#endregion

//#region LostFixedAsset
export const GET_LOST_FA_LIST = "FixedAsset/GetFixedAssetsLostList";
export const UNDO_LOST_PROCESS = "FixedAsset/UndoLostByArrayProcess";
export const UPDATE_FIXEDASSETLOSTSTATUS = "FixedAsset/UpdateFixedAssetIsLostStatus";
//#endregion

//#region LostFixedAsset
export const LOST_PROCESS = "FixedAsset/SetLostByArrayProcess";
export const GET_CHECKOUT_FA_LIST = "";

//#endregion

//#region FixedAssetCardCategories
export const GET_FIXEDASSETCARDCATEGORY_LIST =
  "FixedAssetCardCategories/GetFixedAssetCardCategoriesList";
export const GET_FIXEDASSETCARDCATEGORY_BY_ID =
  "FixedAssetCardCategories/GetFixedAssetCardCategoryById";
export const INSERT_FIXEDASSETCARDCATEGORY =
  "FixedAssetCardCategories/AddFixedAssetCardCategory";
export const UPDATE_FIXEDASSETCARDCATEGORY =
  "FixedAssetCardCategories/UpdateFixedAssetCardCategories";
export const DELETE_FIXEDASSETCARDCATEGORY =
  "FixedAssetCardCategories/RemoveByIdList";
export const GET_MODELS_BY_BRAND_ID =
  "FixedAssetsCardModels/GetFixedAssetsCardModelsByBrandId";
//#endregion

//#region FixedAssetCardProperties
export const GET_FIXEDASSETCARDPROPERTY_LIST = "FixedAssetCardProperties/GetFixedAssetCardPropertiesList";
export const GET_FIXEDASSETCARDPROPERTY_BY_ID = "FixedAssetCardProperties/GetFixedAssetCardPropertyById";
export const INSERT_FIXEDASSETCARDPROPERTY = "FixedAssetCardProperties/AddFixedAssetCardProperty";
export const UPDATE_FIXEDASSETCARDPROPERTY = "FixedAssetCardProperties/UpdateFixedAssetCardProperties";
export const DELETE_FIXEDASSETCARDPROPERTY = "FixedAssetCardProperties/RemoveByIdList";
export const GET_FIXEDASSETCARDPROPERTY_BY_TYPEID = "FixedAssetCardProperties/GetFixedAssetCardPropertyByTypeId";
export const GET_FIXEDASSETCARDPROPERTYTYPE_LIST = "FixedAssetPropertyTypes/GetFixedAssetPropertyTypesList";
export const GET_PROPERTYVALUES_BY_PROPERTYID = "FixedAssetProperyValues/GetFixedAssetPropertyValueByPropertyId";
//#endregion


//#region FixedAssetCardBrands
export const GET_FIXEDASSETCARDBRAND_LIST =
  "FixedAssetCardBrands/GetFixedAssetCardBrandsList";
export const GET_FIXEDASSETCARDBRAND_BY_ID =
  "FixedAssetCardBrands/GetFixedAssetCardBrandById";
export const INSERT_FIXEDASSETCARDBRAND =
  "FixedAssetCardBrands/AddFixedAssetCardBrand";
export const UPDATE_FIXEDASSETCARDBRAND =
  "FixedAssetCardBrands/UpdateFixedAssetCardBrand";
export const DELETE_FIXEDASSETCARDBRAND = "FixedAssetCardBrands/RemoveByIdList";
//#endregion

//#region FixedAssetCardModels
export const GET_FIXEDASSETCARDMODEL_LIST =
  "FixedAssetsCardModels/GetFixedAssetsCardModelsList";
export const GET_FIXEDASSETCARDMODEL_BY_ID =
  "FixedAssetsCardModels/GetFixedAssetsCardModelsById";
export const INSERT_FIXEDASSETCARDMODEL =
  "FixedAssetsCardModels/AddFixedAssetsCardModel";
export const UPDATE_FIXEDASSETCARDMODEL =
  "FixedAssetsCardModels/UpdateFixedAssetsCardModel";
export const DELETE_FIXEDASSETCARDMODEL =
  "FixedAssetsCardModels/RemoveByIdList";
//#endregion

//#region Agreements
export const GET_AGREEMENT_LIST = "Aggrement/GetAgreementListByFirmId";
export const GET_AGREEMENT_BY_ID = "Aggrement/GetAgreementListById";
export const INSERT_AGREEMENT = "Aggrement/AddAgreementWithFileupload";
export const UPDATE_AGREEMENT = "Aggrement/UpdateAgreementWithFileupload";
export const DELETE_AGREEMENT = "Aggrement/RemoveByIdList";
export const FILE_UPLOAD = "File/UploadFile";
//#endregion

//#region Companies
export const GET_COMPANY_LIST = "company/GetCompanyList";
export const GET_COMPANY_BY_ID = "Company/GetCompanyById";
export const INSERT_COMPANY = "company/AddCompany";
export const UPDATE_COMPANY = "company/UpdateCompany";
export const DELETE_COMPANY = "company/RemoveByIdList";
//#endregion

//#region CheckOutReasons
export const GET_CHECKOUTREASON_LIST = "CheckOutReasons/GetCheckOutReasonsList";
export const GET_SUSPENDED_BY_ID = "CheckOutReasons/GetSuspendedById";
export const INSERT_CHECKOUTREASON = "CheckOutReasons/AddCheckOutReasons";
export const UPDATE_CHECKOUTREASON = "CheckOutReasons/UpdateCheckOutReasons";
export const GET_SUSPENSION_LIST = "CheckOutReasons/GetCheckOutReasonsIsSuspendedList";
export const DELETE_SUSPENSION = "CheckOutReasons/RemoveByIdList";
//#endregion

//#region FixedAssetStatus
export const GET_FIXEDASSETSTATUS_LIST = "FixedAssetStatus/GetFixedAssetStatusList";
export const INSERT_STATUS = "FixedAssetStatus/AddFixedAssetStatus";
export const UPDATE_STATUS = "FixedAssetStatus/UpdateFixedAssetStatus";
export const GET_FIXEDASSETSTATUS_BY_ID = "FixedAssetStatus/GetFixedAssetStatusById";
export const DELETE_STATUS = "FixedAssetStatus/RemoveFixedAssetStatusByIdList";
//#endregion

//#region ExpenseCenters
export const GET_EXPENSECENTER_LIST = "ExpenseCenter/GetExpenseCenterList";
export const GET_EXPENSECENTER_BY_ID = "ExpenseCenter/GetExpenseCenterById";
export const INSERT_EXPENSECENTER = "ExpenseCenter/AddExpenseCenter";
export const UPDATE_EXPENSECENTER = "ExpenseCenter/UpdateExpenseCenter";
export const DELETE_EXPENSECENTER = "ExpenseCenter/RemoveByIdList";
//#endregion

//#region FixedAsset
export const GET_FIXED_ASSET = "FixedAsset/GetFixedAssetsList";
export const GET_FIXED_ASSET_DESCRIPTION = "FixedAsset/SearchFixedAssetsList";
export const INSERT_FIXEDASSET = "FixedAsset/AddFixedAsset";
export const UPLOAD_IMAGE = "File/UploadImage";
export const DELETE_FIXEDASSET_FILE = "File/DeleteFixedAssetFiles";
//#endregion

//#region Roles
export const UPDATE_ROLE = "Role/UpdateRole";
export const INSERT_ROLE = "Role/AddRole";
export const GET_ROLE_BY_ID = "Role/GetRoleById";
export const GET_ROLE_LIST = "role/GetRoleList";
export const DELETE_ROLES = "role/RemoveByIdList";
export const Do_ROLE_AUTHORIZATIONS = "role/DoRoleAuthorizations";
//#endregion

//#region RoleAuthorization
export const GET_ROLE_AUTHORIZATION_LIST = "Role/GetRoleAuthorizationList";
export const GET_ROLE_AUTHORIZATION_LIST_BY_FIRMID = "Role/GetMenuListbyFirmId";
export const INSERT_ROLE_AUTHORIZATION = "Role/AddRoleAuthorizationsByArray";
export const GET_ROLE_AUTHORIZATION_LIST_BY_ROLEID = "Role/GetRoleAuthorizationListbyRoleId";
export const UPDATE_ROLE_AUTHORIZATION = "Role/UpdateRoleAuthorizationsByArray";
export const DELETE_ROLE_AUTHORIZATION = "Role/RemoveRoleAuthorizationsByIdList";
//#endregion

//#region UserRole
export const INSERT_USER_ROLE = "role/AddRoleToUserByArray";
export const GET_USER_ROLE_LIST = "role/GetUserRoleList";
export const GET_USER_ROLE_BY_ID = "role/GetUserRoleById";
export const DELETE_ROLE_USER = "role/RemoveUserRoleByIdList";
export const UPDATE_USER_ROLE = "role/UpdateUserRole";
//#endregion

export const GET_FIRM_LIST = "firm/GetFirmsList";
export const GET_COUNTRY_LIST = "definition/GetCountriesList";
export const GET_CITY_LIST = "definition/GetCitiesList";
export const GET_USERFIRM_LIST = "UserFirms/GetUserFirmsList";
export const GET_USERFIRM_LIST_WITHOUT_PARAMS = "UserFirms/GetUserFirmsListbyFirmId";
export const GET_CITY_BY_COUNTRY_ID = "definition/GetCityByCountryId";

//#region FixedAssetForm
export const CREATE_FIXED_ASSET_FORM = "PdfCreator/CreateFixedAssetDeliveryForm";
//#endregion

//#region Dashboard
export const GET_DASHBOARD_FIXED_ASSETS_INFO = "Dashboard/GetDashboardValues";
export const GET_DASHBOARD_TRANSACTIONS_INFO = "Dashboard/GetDashboardTransactions";
export const GET_DASHBOARD_PERSONALS_INFO = "Dashboard/GetDashboardPersonalInfo";
export const GET_DASHBOARD_FIXED_ASSETS_COUNTS = "Dashboard/GetDashboardFixedAssetsCount";
export const GET_DASHBOARD_FIXED_ASSET_PRICE_COUNT_LINE = "Dashboard/GetDashboardFixedAssetPriceCountLine";
export const GET_DASHBOARD_FIXED_ASSETS_COUNT_BY_LOCATIONS = "Dashboard/GetDashboardFixedAssetCountByLocation";
export const GET_DASHBOARD_FIXED_ASSETS_COUNT_BY_DEPARTMENTS = "Dashboard/GetDashboardFixedAssetCountByDepartment";
export const GET_DASHBOARD_FIXED_ASSETS_COUNT_BY_CATEGORY = "Dashboard/GetDashboardFixedAssetCountByCategory";
export const GET_DASHBOARD_FIXED_ASSETS_STATUS_COUNT = "Dashboard/GetDashboardFixedAssetsStatusCount";
//#endregion

//#region Depreciation
export const GET_DEPRECIATION_CALCULATION_TYPE = "DepreciationCalculationTypes/GetDepreciationCalculationTypes";
//#endregion

//#region CycleCountPlan
export const GET_CYCLE_COUNT_PLAN_LIST ="CycleCountingPlans/GetCountingPlansList";

//#endregion

//#region TransactionList
export const GET_TRANSACTION_LIST = "TransactionLog/TransactionLogsList";
export const GET_TRANSACTION_BY_ID = "TransactionLog/TransactionLogsListById";
//#endregion

const FILE_UPLOAD_URL = "http://localhost:8000/upload";

export const GET_HEADERS = (token = null): HttpHeaders => {
  let headers = new HttpHeaders();
  headers = headers.append("Content-Type", "application/json");
  if (token) {
    headers = headers.append("Authorization", "Bearer " + token);
  } else {
    headers = headers.append(
      "Authorization",
      "Basic " + btoa("username:password")
    );
  }
  return headers;
};

export const GET_HEADERS_FORMDATA = (token = null): HttpHeaders => {
  let headers = new HttpHeaders();
  headers = headers.append("Content-Type", "multipart/form-data");

  if (token) {
    headers = headers.append("Authorization", "Bearer " + token);
  } else {
    headers = headers.append(
      "Authorization",
      "Basic " + btoa("username:password")
    );
  }
  return headers;
};
