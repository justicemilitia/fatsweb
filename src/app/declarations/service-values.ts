import { HttpHeaders } from "@angular/common/http";

export const SERVICE_URL = "http://dev.fatsapi.com/api/";
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
export const UPDATE_FIXEDASSETCARD = "fixedassetcard/UpdateFixedAssetCard";
export const DELETE_FIXEDASSETCARD = "fixedassetcard/RemoveByIdList";
//#endregion

//#region FixedAssetCards
export const GET_FIXEDASSET_LIST = "FixedAsset/GetFixedAssetsList";
export const UPDATE_FIXEDASSET = "FixedAsset/UpdateFixedAsset";
export const UPDATE_FIXEDASSETBARCODENUMBER = "FixedAsset/UpdateFixedAssetBarcodeNumber";
export const UPDATE_FIXEDASSETSUSPENDEDSTATUS = "FixedAsset/UpdateFixedAssetIsSuspendedStatus";
export const UPDATE_FIXEDASSETLOSTSTATUS = "FixedAsset/UpdateFixedAssetIsLostStatus";
export const GET_FIXEDASSET_BY_ID = "FixedAsset/GetFixedAssetById";
export const DELETE_FIXEDASSET = "FixedAsset/RemoveByRemoveFixedAssetIdList";
//#endregion

//#region FixedAssetCardCategories
export const GET_FIXEDASSETCARDCATEGORY_LIST = "FixedAssetCardCategories/GetFixedAssetCardCategoriesList";
export const GET_FIXEDASSETCARDCATEGORY_BY_ID = "FixedAssetCardCategories/GetFixedAssetCardCategoryById";
export const INSERT_FIXEDASSETCARDCATEGORY = "FixedAssetCardCategories/AddFixedAssetCardCategory";
export const UPDATE_FIXEDASSETCARDCATEGORY = "FixedAssetCardCategories/UpdateFixedAssetCardCategories";
export const DELETE_FIXEDASSETCARDCATEGORY = "FixedAssetCardCategories/RemoveByIdList";
//#endregion

//#region FixedAssetCardProperties
//#endregion

//#region FixedAssetCardBrands
export const GET_FIXEDASSETCARDBRAND_LIST = "FixedAssetCardBrands/GetFixedAssetCardBrandsList";
export const GET_FIXEDASSETCARDBRAND_BY_ID = "FixedAssetCardBrands/GetFixedAssetCardBrandById";
export const INSERT_FIXEDASSETCARDBRAND = "FixedAssetCardBrands/AddFixedAssetCardBrand";
export const UPDATE_FIXEDASSETCARDBRAND = "FixedAssetCardBrands/UpdateFixedAssetCardBrand";
export const DELETE_FIXEDASSETCARDBRAND = "FixedAssetCardBrands/RemoveByIdList";
//#endregion

//#region FixedAssetCardModels
export const GET_FIXEDASSETCARDMODEL_LIST = "FixedAssetsCardModels/GetFixedAssetsCardModelsList";
export const GET_FIXEDASSETCARDMODEL_BY_ID = "FixedAssetsCardModels/GetFixedAssetsCardModelsById";
export const INSERT_FIXEDASSETCARDMODEL = "FixedAssetsCardModels/AddFixedAssetsCardModel";
export const UPDATE_FIXEDASSETCARDMODEL = "FixedAssetsCardModels/UpdateFixedAssetsCardModel";
export const DELETE_FIXEDASSETCARDMODEL = "FixedAssetsCardModels/RemoveByIdList";
//#endregion

//#region Agreements
export const GET_AGREEMENT_LIST = "Aggrement/GetAgreementListByFirmId";
export const GET_AGREEMENT_BY_ID = "Aggrement/GetAgreementListById";
export const INSERT_AGREEMENT = "Aggrement/AddAgreementWithFileupload";
export const UPDATE_AGREEMENT = "Aggrement/UpdateAgreement";
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
export const GET_CHECKOUTREASON_LIST = "CheckOutReason/GetCheckOutReasonsList";
export const GET_CHECKOUTREASON_BY_ID = "CheckOutReasons/GetCheckOutReasonById";
export const INSERT_CHECKOUTREASON = "CheckOutReason/AddCheckOutReasons"
export const UPDATE_CHECKOUTREASON = "CheckOutReasons/UpdateCheckOutReasons";
//#endregion

//#region ExpenseCenters
export const GET_EXPENSECENTER_LIST = "ExpenseCenter/GetExpenseCenterList";
export const GET_EXPENSECENTER_BY_ID = "ExpenseCenter/GetExpenseCenterById";
export const INSERT_EXPENSECENTER = "ExpenseCenter/AddExpenseCenter";
export const UPDATE_EXPENSECENTER = "ExpenseCenter/UpdateExpenseCenter";
export const DELETE_EXPENSECENTER = "ExpenseCenter/RemoveByIdList";

//#endregion


export const INSERT_FIXEDASSET = "FixedAsset/AddFixedAsset";


//#region Roles
export const UPDATE_ROLE = "Role/UpdateRole";
export const INSERT_ROLE = "Role/AddRole";
export const GET_ROLE_BY_ID = "Role/GetRoleById";
export const GET_ROLE_LIST = "role/GetRoleList";
export const DELETE_ROLES = "role/RemoveByIdList";

//#endregion

//#region RoleAuthorization
export const GET_ROLE_AUTHORIZATION_LIST = "Role/GetRoleAuthorizationList";
//#endregion

//#region UserRole
export const INSERT_USER_ROLE = "role/AddRoleToUserByArray";
export const GET_USER_ROLE_LIST = "role/GetUserRoleList";
export const GET_USER_ROLE_BY_ID = "role/GetUserRoleById";
export const DELETE_ROLE_USER = "role/RemoveByIdListRoleUser";
//#endregion

export const GET_FIRM_LIST = "firm/GetFirmsList";
export const GET_COUNTRY_LIST = "definition/GetCountriesList";
export const GET_CITY_LIST = "definition/GetCitiesList";
export const GET_USERFIRM_LIST = "UserFirms/GetUserFirmsList";
export const GET_CITY_BY_COUNTRY_ID = "definition/GetCityByCountryId";


const FILE_UPLOAD_URL = 'http://localhost:8000/upload';

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
