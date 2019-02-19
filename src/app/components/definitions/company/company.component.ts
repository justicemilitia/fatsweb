import { Component, OnInit, NgModule } from "@angular/core";
import { CompanyService } from "../../../services/companyService/company.service";
import { BaseComponent } from "src/app/components/base/base.component";
import { LanguageService } from "src/app/services/languageService/language.service";
import { BaseService } from "../../../services/base.service";
import {
  FormBuilder,
  NgForm,
  FormsModule,
  ReactiveFormsModule
} from "@angular/forms";
import { Company } from "src/app/models/Company";
import { Country } from "src/app/models/Country";
import { City } from "src/app/models/City";

@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.css"]
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [CompanyComponent],
  providers: [CompanyComponent]
})
export class CompanyComponent extends BaseComponent implements OnInit {

  insertCompany:any={};
  countries: Country[] = [];
  cities: City[] = [];
  companies:Company[]=[];

  constructor(
    protected baseService: BaseService,
    private formBuilder: FormBuilder
  ) {
    super(baseService);
    this.LoadCompanies();
  }

  private companyService: CompanyService;

  ngOnInit() {}

  LoadCompanies(){
    this.baseService.companyService.GetCompanies((company:Company[])=>{
      company.forEach((e)=>{
        this.companies.push(e);
      })
    });
  }

  InsertCompany(data: NgForm) {
    debugger;
    console.log(data.value);
    this.insertCompany = <Company>data.value;
    this.baseService.companyService.InsertCompany(this.insertCompany);
  }

  LoadDropdownList() {
    this.baseService.countryService.GetCountryList(
      countries => (this.countries = countries)
    );
    this.baseService.cityService.GetCityList(
      cities => (this.cities = cities)
    );
  }
}

