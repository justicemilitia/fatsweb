import { HttpHeaders } from "@angular/common/http";

export const SERVICE_URL = "http://localhost:11889/api/";
export const LOGIN = "Auth/token";

export const GET_HEADERS = (token=null) => {
  let headers = new HttpHeaders();
  headers = headers.append("Content-Type", "application/json");
  headers = headers.append(
    "Authorization",
    "Basic " + btoa("username:password")
  );
  if(token){
    headers = headers.append(
        "Authorization",
        "Bearer " + token
      );
  }
  return headers;
};
