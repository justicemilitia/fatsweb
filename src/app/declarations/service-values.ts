import { HttpHeaders } from "@angular/common/http";

export const SERVICE_URL = "http://localhost:5000/api/";
export const LOGIN = "Auth/token";
export const CREATE_USER = "Auth/register";

export const GET_DEPARTMENT_LIST = "department/getdepartmentslist";
export const GET_LOCATION_LIST = "locations/getlocationslist";
export const GET_USER_LIST = "user/GetUsers";
export const GET_ROLE_LIST = "role/GetRoleList";
export const GET_FIRM_LIST = "firm/GetFirmsList";

export const INSERT_DEPARTMENT = "department/AddDepartment";

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
