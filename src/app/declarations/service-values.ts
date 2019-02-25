import { HttpHeaders } from "@angular/common/http";

export const SERVICE_URL = "http://dev.fatsapi.com/api/";
export const LOGIN = "Auth/token";
export const CREATE_USER = "Auth/register";

export const GET_DEPARTMENT_LIST = "department/GetDepartmentsList";
export const GET_LOCATION_LIST = "locations/getlocationslist";
export const GET_USER_LIST = "user/GetUsers";
export const GET_ROLE_LIST = "role/GetRoleList";
export const GET_FIRM_LIST = "firm/GetFirmsList";
export const GET_COUNTRY_LIST="definition/GetCountriesList";
export const GET_CITY_LIST="definition/GetCitiesList";
export const GET_COMPANY_LIST="company/GetCompanyList";
export const GET_EXPENSECENTER_LIST="ExpenseCenter/GetExpenseCenterList";
export const GET_MARK_LIST="";
export const GET_MODEL_LIST="";
export const GET_CHECKOUTREASON_LIST="CheckOutReason/GetCheckOutReasonsList";
export const GET_USERFIRM_LIST="UserFirms/GetUserFirmsList";
export const GET_COMPANY_BY_ID="Company/GetCompanyById";
export const GET_EXPENSECENTER_BY_ID="ExpenseCenter/GetExpenseCenterById";
export const GET_CHECKOUTREASON_BY_ID="CheckOutReasons/GetCheckOutReasonById";


export const UPDATE_COMPANY="company/UpdateCompany";
export const UPDATE_EXPENSECENTER="ExpenseCenter/UpdateExpenseCenter"; 
export const UPDATE_CHECKOUTREASON="CheckOutReasons/UpdateCheckOutReasons";

export const GET_FIXEDASSETCATEGORY_LIST = "fixedasset/GetFixedAssetCategoriesList";
export const GET_FIXEDASSET_LIST = "fixedAsset/GetFixedAssetsList";

export const INSERT_COMPANY="company/AddCompany";
export const INSERT_DEPARTMENT = "department/AddDepartment";
export const INSERT_LOCATION = "locations/AddLocation";
export const INSERT_FIXEDASSETCATEGORY = "FixedAsset/AddFixedAssetCategory";
export const INSERT_FIXEDASSET = "FixedAsset/AddFixedAsset";
export const INSERT_EXPENSECENTER="ExpenseCenter/AddExpenseCenter";
export const INSERT_MARK="";
export const INSERT_MODEL="";
export const INSERT_CHECKOUTREASON="CheckOutReason/AddCheckOutReasons"


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
