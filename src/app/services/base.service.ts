import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authenticationService/authentication.service";
import { UserService } from "./userService/user.service";
import { LanguageService } from "./languageService/language.service";
import { DepartmentService } from './departmentService/department.service';
import { LocationService } from './locationService/location.service';
import { CompanyService } from './companyService/company.service';
import { CountryService } from './country-service/country.service';
import { CityService } from './city-service/city.service';

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
    public companyService:CompanyService,
    public countryService:CountryService, 
    public cityService:CityService
  ) {}
}
