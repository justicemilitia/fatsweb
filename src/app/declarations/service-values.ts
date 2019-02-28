import { HttpHeaders } from "@angular/common/http";

export const SERVICE_URL = "http://dev.fatsapi.com/api/";
export const LOGIN = "Auth/token";

//#region Departments
export const GET_DEPARTMENT_LIST = "department/GetDepartmentsList";
export const GET_DEPARTMENT_BY_ID="Locations/GetDepartmentById";
export const INSERT_DEPARTMENT = "department/AddDepartment";
export const UPDATE_DEPARTMENT = "department/UpdateDepartment";
//#endregion

//#region Locations
export const GET_LOCATION_LIST = "locations/getlocationslist";
export const GET_LOCATION_BY_ID="Locations/GetLocationsById";
export const INSERT_LOCATION = "locations/AddLocation";
export const UPDATE_LOCATION = "locations/UpdateLocation";
//#endregion

//#region Users
export const GET_USER_LIST = "user/GetUserList";
export const GET_USER_LIST_BY_ID = "userfirms/GetUserFirmsListbyFirmId";
export const INSERT_USER ="auth/register";
export const UPDATE_USER = "locations/UpdateLocation";
//#endregion

//#region FixedAssetCards
export const GET_FIXEDASSETCARD_LIST = "fixedAssetcard/GetFixedAssetsCardsList";
export const GET_FIXEDASSETCARD_BY_ID = "fixedAssetcard/GetFixedAssetCardById";
export const INSERT_FIXEDASSETCARD = "fixedassetcard/AddFixedAssetCard";
export const UPDATE_FIXEDASSETCARD = "fixedassetcard/UpdateFixedAssetCard";

//#endregion

//#region FixedAssetCardCategories
export const GET_FIXEDASSETCARDCATEGORY_LIST = "FixedAssetCardCategories/GetFixedAssetCardCategoriesList";
export const GET_FIXEDASSETCARDCATEGORY_BY_ID = "FixedAssetCardCategories/GetFixedAssetCardCategoryById";
export const INSERT_FIXEDASSETCARDCATEGORY = "FixedAssetCardCategories/AddFixedAssetCardCategory";
export const UPDATE_FIXEDASSETCARDCATEGORY = "FixedAssetCardCategories/UpdateFixedAssetCardCategory";
//#endregion

//#region FixedAssetCardProperties
//#endregion

//#region FixedAssetCardBrands
export const GET_FIXEDASSETCARDBRAND_LIST="FixedAssetCardBrands/GetFixedAssetCardBrandsList";
export const GET_FIXEDASSETCARDBRAND_BY_ID="FixedAssetCardBrands/GetFixedAssetCardBrandById";
export const INSERT_FIXEDASSETCARDBRAND = "FixedAssetCardBrands/AddFixedAssetCardBrand";
export const UPDATE_FIXEDASSETCARDBRAND = "FixedAssetCardBrands/UpdateFixedAssetCardBrand";
//#endregion

//#region FixedAssetCardModels
export const GET_FIXEDASSETCARDMODEL_LIST="FixedAssetsCardModels/GetFixedAssetsCardModelsList";
export const GET_FIXEDASSETCARDMODEL_BY_ID="FixedAssetsCardModels/GetFixedAssetsCardModelsById";
export const INSERT_FIXEDASSETCARDMODEL = "FixedAssetsCardModels/AddFixedAssetsCardModel";
export const UPDATE_FIXEDASSETCARDMODEL = "FixedAssetsCardModels/UpdateFixedAssetsCardModel";
//#endregion

//#region Agreements
export const GET_AGREEMENT_LIST="Aggrement/GetAgreementListByFirmId";
export const GET_AGREEMENT_BY_ID="Aggrement/GetAgreementListById";
export const INSERT_AGREEMENT = "Aggrement/AddAgreement";
export const UPDATE_AGREEMENT = "Aggrement/UpdateAgreement";
//#endregion

//#region Companies
export const GET_COMPANY_LIST="company/GetCompanyList";
export const GET_COMPANY_BY_ID="Company/GetCompanyById";
export const INSERT_COMPANY="company/AddCompany";
export const UPDATE_COMPANY="company/UpdateCompany";
//#endregion

//#region CheckOutReasons
export const GET_CHECKOUTREASON_LIST="CheckOutReason/GetCheckOutReasonsList";
export const GET_CHECKOUTREASON_BY_ID="CheckOutReasons/GetCheckOutReasonById";
export const INSERT_CHECKOUTREASON="CheckOutReason/AddCheckOutReasons"
export const UPDATE_CHECKOUTREASON="CheckOutReasons/UpdateCheckOutReasons";
//#endregion

//#region ExpenseCenters
export const GET_EXPENSECENTER_LIST="ExpenseCenter/GetExpenseCenterList";
export const GET_EXPENSECENTER_BY_ID="ExpenseCenter/GetExpenseCenterById";
export const INSERT_EXPENSECENTER="ExpenseCenter/AddExpenseCenter";
export const UPDATE_EXPENSECENTER="ExpenseCenter/UpdateExpenseCenter"; 
//#endregion

//#region ExpenseCenters
export const INSERT_FIXEDASSET = "FixedAsset/AddFixedAsset";
//#endregion


export const GET_ROLE_LIST = "role/GetRoleList";
export const GET_FIRM_LIST = "firm/GetFirmsList";
export const GET_COUNTRY_LIST="definition/GetCountriesList";
export const GET_CITY_LIST="definition/GetCitiesList";
export const GET_USERFIRM_LIST="UserFirms/GetUserFirmsList";


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
