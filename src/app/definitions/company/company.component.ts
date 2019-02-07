import { Component, OnInit } from "@angular/core";
import { CompanyServiceService } from "../../services/companyService/company-service.service";

@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.css"]
})
export class CompanyComponent implements OnInit {
  [x: string]: any;

  constructor() {}
  private companyService: CompanyServiceService;
  
  ngOnInit() {}
  openModal(id: string) {
    this.companyService.openCompanyModal(id);
  }
}
