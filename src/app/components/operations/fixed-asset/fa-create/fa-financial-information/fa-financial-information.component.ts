import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FaCreateComponent } from '../fa-create.component';
import { BaseComponent } from 'src/app/components/base/base.component';
import { BaseService } from 'src/app/services/base.service';
import { FixedAsset } from 'src/app/models/FixedAsset';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Company } from 'src/app/models/Company';
import { ExpenseCenter } from 'src/app/models/ExpenseCenter';
import { Currency } from 'src/app/models/Currency';
import { Depreciation } from 'src/app/models/Depreciation';
import { Agreement } from 'src/app/models/Agreement';

@Component({
  selector: 'app-fa-financial-information',
  templateUrl: './fa-financial-information.component.html',
  styleUrls: ['./fa-financial-information.component.css']
})
export class FaFinancialInformationComponent extends BaseComponent implements OnInit {

 @Input() faCreate:FaCreateComponent; 
  //@Output() reset = new EventEmitter();
  
  visibleDepreciation:boolean=false;

  visibleIfrs:boolean=false;
  
  isResetForm:boolean=false;

  fixedAsset:FixedAsset=new FixedAsset();
  
  companies: Company[] = [];
  expensecenters: ExpenseCenter[] = [];
  ifrscurrencies: Currency[] = [];
  currencies: Currency[] = [];
  depreciationTypes: Depreciation[] = [];
  agreements: Agreement[] = [];

  constructor(protected baseService: BaseService) {

    super(baseService);

    this.loadDropdown();
    
   }

  ngOnInit() {
  }

  async loadDropdown() {
    this.baseService.companyService.GetCompanies(
      (companies: Company[]) => {
        this.companies = companies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
    
    this.baseService.expenseCenterService.GetExpenseCenters(
      (expCenters: ExpenseCenter[]) => {
        this.expensecenters = expCenters;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.currencyService.GetCurrencies(
      (currencies: Currency[]) => {
        this.currencies = currencies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.currencyService.GetCurrencies(
      (ifrscurrencies: Currency[]) => {
        this.ifrscurrencies = ifrscurrencies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.depreciationService.GetDepreciationCalculationTypes(
      (depreciationTypes: Depreciation[]) => {
        this.depreciationTypes = depreciationTypes;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.agreementService.GetAgreement(
      (agreements: Agreement[]) => {
        this.agreements = agreements;
      },
      (error: HttpErrorResponse) => {}
    );

  }

  onSubmit(data:NgForm){
    
    if(this.isResetForm)
    {
      data.resetForm();
      this.isResetForm=false;
    }

    this.faCreate.addToFixedAssetList(data);
  }

  nextTab(data:NgForm){
    if(this.fixedAsset.ActivationDate != null && this.fixedAsset.InvoiceDate !=null)
      this.faCreate.nextFixedAssetList();
    else return;
  }

  previousTab(){
  this.faCreate.previous();
  }

  WillDepreciationBeCalculated(event){
    if(event.target.checked==true)
      this.visibleDepreciation=true;
    else
      this.visibleDepreciation=false;
  }

   WillIfrsbeCalculated(event){
    if(event.target.checked == true)
      this.visibleIfrs=true;
    else
      this.visibleIfrs=false;
  }

  resetForm(){    

    this.fixedAsset = new FixedAsset();

    this.isResetForm = false;
  }
}
