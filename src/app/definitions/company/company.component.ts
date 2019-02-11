import { Component, OnInit } from "@angular/core";
import { CompanyService } from "../../services/companyService/company.service";

@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.css"]
})
export class CompanyComponent implements OnInit {
  [x: string]: any;

  constructor() {}
  private companyService: CompanyService;
  
  ngOnInit() {}

}
