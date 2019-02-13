import { Injectable } from "@angular/core";
import { User } from "../../models/User";
import {
  HttpHeaders,
  HttpClient,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent
} from "@angular/common/http";
import { Headers } from "@angular/http";
import { Http, RequestOptions } from "@angular/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UserService {
  departments: any[];
  path = "http://localhost:5000/api/auth/";
  decodedToken: any;
  userToken: any;
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY = "token";
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    http: Http
  ) {
    debugger;
    // this.userToken= "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTU1MDAwMDY3MCwiaXNzIjoibXlzaXRlLmNvbSIsImF1ZCI6Im15c2l0ZS5jb20ifQ.Wh1jTdE0w6U3e_vYP5aEO_Mls8encT3xVrQnJCBZH5k";    
    let headers = new Headers({
      'Token': "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9",
      'Content-Type': 'application/json'
  });
    // let headers = new Headers({ "Content-Type": "application/json" });
    // headers.append("Authorization", "Bearer " + this.userToken);
    http
      .get("http://localhost:5000/api/department/getdepartmentslist", { headers: headers })
      .subscribe(
        result => {
          this.departments = result.json() as any[];
        },
        error => console.error(error)
      );
  }

  Register(registerUser: User) {
    debugger;
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append(
      "Authorization",
      "Basic " + btoa("username:password")
    );
    console.log(registerUser);
    debugger;
    this.httpClient
      .post(this.path + "register", registerUser, { headers: headers })
      .subscribe(
        data => {
          console.log(data["token"]);
          this.saveToken(data["token"]);
          this.userToken = data["token"];
          this.decodedToken = this.jwtHelper.decodeToken(data["token"]);
          window.alert("Selamlaaaar :)");

          this.router.navigateByUrl("/user");
        },
        error => {
          console.log(error);
          return;
        }
      );
  }

  saveToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}
