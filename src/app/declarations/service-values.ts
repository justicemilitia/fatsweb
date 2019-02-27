import { HttpHeaders } from "@angular/common/http";

export const SERVICE_URL = "http://dev.fatsapi.com/api/";
export const LOGIN = "Auth/token";

export const GET_DEPARTMENT_LIST = "department/GetDepartmentsList";
export const GET_LOCATION_LIST = "locations/getlocationslist";
export const GET_USER_LIST = "userfirms/GetUserFirmsListbyFirmId";
export const GET_ROLE_LIST = "role/GetRoleList";
export const GET_FIRM_LIST = "firm/GetFirmsList";
export const GET_COUNTRY_LIST="definition/GetCountriesList";
export const GET_CITY_LIST="definition/GetCitiesList";
export const GET_COMPANY_LIST="company/GetCompanyList";
export const GET_EXPENSECENTER_LIST="ExpenseCenter/GetExpenseCenterList";
export const GET_CHECKOUTREASON_LIST="CheckOutReason/GetCheckOutReasonsList";
export const GET_USERFIRM_LIST="UserFirms/GetUserFirmsList";
export const GET_COMPANY_BY_ID="Company/GetCompanyById";
export const GET_LOCATION_BY_ID="Locations/GetLocationsById";
export const GET_DEPARTMENT_BY_ID="Locations/GetLocationsById";
export const GET_EXPENSECENTER_BY_ID="ExpenseCenter/GetExpenseCenterById";
export const GET_CHECKOUTREASON_BY_ID="CheckOutReasons/GetCheckOutReasonById";


export const UPDATE_COMPANY="company/UpdateCompany";
export const UPDATE_EXPENSECENTER="ExpenseCenter/UpdateExpenseCenter"; 
export const UPDATE_CHECKOUTREASON="CheckOutReasons/UpdateCheckOutReasons";
export const GET_FIXEDASSETCATEGORY_LIST = "fixedassetcard/GetFixedAssetCardCategoriesList";
export const GET_FIXEDASSETCARD_LIST = "fixedAssetcard/GetFixedAssetsCardsList";
export const GET_AGREEMENT_LIST="aggrement/GetAgreementListByFirmId";
export const GET_FIXEDASSETCARDBRAND_LIST="fixedassetcard/GetFixedAssetCardBrandsList";
export const GET_FIXEDASSETCARDMODEL_LIST="fixedassetcard/GetFixedAssetsCardModelsList";


export const UPDATE_DEPARTMENT = "department/UpdateDepartment";
export const UPDATE_LOCATION = "locations/UpdateLocation";
export const UPDATE_FIXEDASSETCARDCATEGORY = "fixedassetcard/UpdateFixedAssetCardCategory";
export const UPDATE_FIXEDASSETCARD = "fixedassetcard/UpdateFixedAssetCard";
export const UPDATE_AGREEMENT = "agreement/UpdateAgreement";
export const UPDATE_FIXEDASSETCARDBRAND = "fixedassetcard/UpdateFixedAssetCardBrand";
export const UPDATE_FIXEDASSETCARDMODEL = "FixedAssetCard/UpdateFixedAssetCardModel";

export const INSERT_USER ="auth/register";
export const INSERT_COMPANY="company/AddCompany";
export const INSERT_DEPARTMENT = "department/AddDepartment";
export const INSERT_LOCATION = "locations/AddLocation";
export const INSERT_FIXEDASSETCATEGORY = "FixedAsset/AddFixedAssetCategory";
export const INSERT_FIXEDASSET = "FixedAsset/AddFixedAsset";
export const INSERT_EXPENSECENTER="ExpenseCenter/AddExpenseCenter";
export const INSERT_CHECKOUTREASON="CheckOutReason/AddCheckOutReasons"

export const INSERT_FIXEDASSETCARDCATEGORY = "fixedassetcard/AddFixedAssetCardCategory";
export const INSERT_FIXEDASSETCARD = "fixedassetcard/AddFixedAssetCard";
export const INSERT_AGREEMENT = "agreement/AddAgreement";
export const INSERT_FIXEDASSETCARDBRAND = "fixedassetcard/AddFixedAssetCardBrand";
export const INSERT_FIXEDASSETCARDMODEL = "FixedAssetCard/AddFixedAssetCardModel";

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
