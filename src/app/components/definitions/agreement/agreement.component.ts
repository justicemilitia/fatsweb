import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { Agreement } from "../../../models/Agreement";
import { IData } from 'src/app/extends/TreeGridTable/models/interfaces/IData';

@Component({
  selector: "app-agreement",
  templateUrl: "./agreement.component.html",
  styleUrls: ["./agreement.component.css"]
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule, HttpClient],
  declarations: [AgreementComponent],
  providers: [AgreementComponent]
})
export class AgreementComponent extends BaseComponent
  implements OnInit, DoCheck {
  selectedFile: any;
  insertingAgreement: any = {};
  agreements: Agreement[] = [];

  filter: any = {
    Name: "",
    No: "",
    StartDate: "",
    EndDate: "",
    Price: "",
    Description: ""
  };

  order: any = {
    isDesc: false,
    column: "Name"
  };

  constructor(public baseService: BaseService, public httpClient: HttpClient) {
    super(baseService);
    this.loadAgreements();
  }
  ngOnInit() { }

  ngDoCheck(): void {
    this.doFilter();
  }

  //#region Grid Methods

  doFilter() {
    //this.TGT_doFilter(this.agreements, this.filter);
  }

  doOrder(column: string) {
    this.order.isDesc = !this.order.isDesc;
    this.order.column = column;
    // this.TGT_doOrder(this.agreements, this.filter, this.order);
  }

  doCollapse(data: IData) {
    data.isExtended = !data.isExtended;
    //this.TGT_loadData(this.agreements);
  }

  //#endregion

  insertAgreements(data: NgForm) {
    this.insertingAgreement = <Agreement>data.value;
    this.baseService.agreementService.InsertAgreement(this.insertingAgreement);
  }

  loadAgreements() {
    this.baseService.agreementService.GetAgreement(
      (facs: Agreement[]) => {
        //  this.agreements = <Agreement[]>this.convertDataToTree(facs);
        //this.TGT_loadData(this.agreements);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
  onFileSelected(event) {
    debugger;
    this.selectedFile = event.target.files[0];
  }

}
