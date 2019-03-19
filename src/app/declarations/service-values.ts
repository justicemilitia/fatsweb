import { HttpHeaders } from "@angular/common/http";
import { Currency } from '../models/Currency';

export const SERVICE_URL = "http://localhost:11889/api/";
export const LOGIN = "Auth/token";

//#region Departments
export const GET_DEPARTMENT_LIST = "Department/GetDepartmentsList";
export const GET_DEPARTMENT_BY_ID = "Department/GetDepartmentById";
export const INSERT_DEPARTMENT = "Department/AddDepartment";
export const UPDATE_DEPARTMENT = "Department/UpdateDepartment";
export const DELETE_DEPARTMENT = "Department/RemoveByIdList";
//#endregion

//#region Locations
export const GET_LOCATION_LIST = "Locations/GetLocationsList";
export const GET_LOCATION_BY_ID = "Locations/GetLocationsById";
export const INSERT_LOCATION = "Locations/AddLocation";
export const UPDATE_LOCATION = "Locations/UpdateLocation";
export const DELETE_LOCATION = "Locations/RemoveByIdList";
//#endregion

//#region Currency
export const GET_CURRENCY_LIST = "Currency/GetCurrencyList";
export const GET_CURRENCY_BY_ID = "Currency/GetCurrencyById";
export const INSERT_CURRENCY = "Currency/AddCurrency";
export const UPDATE_CURRENCY = "Currency/UpdateCurrency";
//#endregion

//#region Users
export const GET_USER_LIST = "user/GetUserList";
export const GET_USER_BY_ID = "user/GetUserById";
export const INSERT_USER = "auth/register";
export const UPDATE_USER = "User/UpdateUser";
export const GET_SYSTEM_USER_LIST = "User/GetSystemUserList";
export const DELETE_USER = "User/RemoveByIdList";
//#endregion

//#region FixedAssetCards
export const GET_FIXEDASSETCARD_LIST = "fixedAssetcard/GetFixedAssetsCardsList";
export const GET_FIXEDASSETCARD_BY_ID = "fixedAssetcard/GetFixedAssetCardById";
export const INSERT_FIXEDASSETCARD = "fixedassetcard/AddFixedAssetCard";
export const UPDATE_FIXEDASSETCARD = "fixedassetcard/UpdateFixedAssets";
export const DELETE_FIXEDASSETCARD = "fixedassetcard/RemoveByIdList";
export const GET_FA_CARDS_BY_CATEGORY_ID="fixedassetcard/GetFixedAssetCardByCategoryId";
//#endregion

//#region FixedAssets
export const GET_FIXEDASSET_LIST = "FixedAsset/GetFixedAssetsList";
export const UPDATE_FIXEDASSET = "FixedAsset/UpdateFixedAsset";
export const UPDATE_FIXEDASSETBARCODENUMBER = "FixedAsset/UpdateFixedAssetBarcodeNumber";
export const UPDATE_FIXEDASSETSUSPENDEDSTATUS = "FixedAsset/UpdateFixedAssetIsSuspendedStatus";
export const UPDATE_FIXEDASSETLOSTSTATUS = "FixedAsset/UpdateFixedAssetIsLostStatus";
export const GET_FIXEDASSET_BY_ID = "FixedAsset/GetFixedAssetById";
export const EXIT_FIXEDASSET = "FixedAsset/ExitFixedAsset";
//#endregion

//#region SuspendedFixedAsset
export const GET_SUSPENDED_LIST="FixedAsset/GetFixedAssetsSuspendedList";
export const UNDO_SUSPENSION_PROCESS="FixedAsset/UndoSuspensionProcess";
//#endregion

//#region LostFixedAsset
export const GET_LOST_FA_LIST="";
export const UNDO_LOST_PROCESS="";

//#endregion

//#region LostFixedAsset
export const GET_CHECKOUT_FA_LIST="";

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
export const GET_MODELS_BY_BRAND_ID=
  "FixedAssetsCardModels/GetFixedAssetsCardModelsByBrandId";
//#endregion

//#region FixedAssetCardProperties
export const GET_FIXEDASSETCARDPROPERTY_LIST = "FixedAssetCardProperties/GetFixedAssetCardPropertiesList";
export const GET_FIXEDASSETCARDPROPERTY_BY_ID = "FixedAssetCardProperties/GetFixedAssetCardPropertyById";
export const INSERT_FIXEDASSETCARDPROPERTY = "FixedAssetCardProperties/AddFixedAssetCardProperty";
export const UPDATE_FIXEDASSETCARDPROPERTY = "FixedAssetCardProperties/UpdateFixedAssetCardProperties";
export const DELETE_FIXEDASSETCARDPROPERTY = "FixedAssetCardProperties/RemoveByIdList";
export const GET_FIXEDASSETCARDPROPERTY_BY_TYPEID = "FixedAssetCardProperties/GetFixedAssetCardPropertyByTypeId";
//#endregion

//#region FixedAssetCardProperties
export const GET_FIXEDASSETCARDPROPERTYTYPE_LIST = "FixedAssetPropertyTypes/GetFixedAssetPropertyTypesList";
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
export const GET_SUSPENSION_LIST="CheckOutReasons/GetCheckOutReasonsIsSuspendedList";
export const DELETE_SUSPENSION="CheckOutReasons/RemoveByIdList";
//#endregion

//#region FixedAssetStatus
export const GET_FIXEDASSETSTATUS_LIST = "FixedAssetStatus/GetFixedAssetStatusList";
  export const INSERT_STATUS="FixedAssetStatus/AddFixedAssetStatus";
  export const UPDATE_STATUS="FixedAssetStatus/UpdateFixedAssetStatus";
  export const GET_FIXEDASSETSTATUS_BY_ID="FixedAssetStatus/GetFixedAssetStatusById";
  export const DELETE_STATUS="FixedAssetStatus/RemoveFixedAssetStatusByIdList";
//#endregion

//#region ExpenseCenters
export const GET_EXPENSECENTER_LIST = "ExpenseCenter/GetExpenseCenterList";
export const GET_EXPENSECENTER_BY_ID = "ExpenseCenter/GetExpenseCenterById";
export const INSERT_EXPENSECENTER = "ExpenseCenter/AddExpenseCenter";
export const UPDATE_EXPENSECENTER = "ExpenseCenter/UpdateExpenseCenter";
export const DELETE_EXPENSECENTER = "ExpenseCenter/RemoveByIdList";

//#endregion

//region FixedAsset
export const GET_FIXED_ASSET = "FixedAsset/GetFixedAssetsList";
export const INSERT_FIXEDASSET = "FixedAsset/AddFixedAsset";

//endregion


//#region Roles
export const UPDATE_ROLE = "Role/UpdateRole";
export const INSERT_ROLE = "Role/AddRole";
export const GET_ROLE_BY_ID = "Role/GetRoleById";
export const GET_ROLE_LIST = "role/GetRoleList";
export const DELETE_ROLES = "role/RemoveByIdList";
//#endregion

//#region RoleAuthorization
export const GET_ROLE_AUTHORIZATION_LIST = "Role/GetRoleAuthorizationList";
export const GET_ROLE_AUTHORIZATION_LIST_BY_FIRMID = "Role/GetMenuListbyFirmId";
export const INSERT_ROLE_AUTHORIZATION = "Role/AddRoleAuthorizationsByArray";
export const GET_ROLE_AUTHORIZATION_LIST_BY_ROLEID="Role/GetRoleAuthorizationListbyRoleId";
export const UPDATE_ROLE_AUTHORIZATION="Role/UpdateRoleAuthorizationsByArray";
export const DELETE_ROLE_AUTHORIZATION="Role/RemoveRoleAuthorizationsByIdList";
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
export const GET_CITY_BY_COUNTRY_ID = "definition/GetCityByCountryId";

//#region 
export const GET_DASHBOARD_VALUES = "Dashboard/GetDashboardValues";
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
