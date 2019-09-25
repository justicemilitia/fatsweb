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
import { AuthenticationService } from 'src/app/services/authenticationService/authentication.service';
import * as pages from "../../../../../declarations/page-values";


@Component({
  selector: 'app-fa-financial-information',
  templateUrl: './fa-financial-information.component.html',
  styleUrls: ['./fa-financial-information.component.css']
})
export class FaFinancialInformationComponent extends BaseComponent implements OnInit {

 @Input() faCreate:FaCreateComponent; 

 @Output('reset') reset : EventEmitter<any> = new EventEmitter();
  
  visibleDepreciation:boolean=false;

  visibleIfrs:boolean=false;
  
  isResetForm:boolean=false;

  requiredDepreciation:boolean = false;

  requiredIFRS:boolean = true;
  
  fixedAsset:FixedAsset=new FixedAsset();
  
  companies: Company[] = [];
  expensecenters: ExpenseCenter[] = [];
  ifrscurrencies: Currency[] = [];
  currencies: Currency[] = [];
  depreciationTypes: Depreciation[] = [];
  agreements: Agreement[] = [];
  roleControl:boolean=false;

  constructor(protected baseService: BaseService, private authentication: AuthenticationService,) {

    super(baseService);

    this.loadDropdown();

    this.depreciationRoleControl(); 
   }

  ngOnInit() {
  }

  depreciationRoleControl(){
    let role = this.authentication.roles.forEach(
      x => {
        if(x.MenuCaption == pages.MENU_DEPRECIATION)
          this.roleControl = true;
      }
    );
  };

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
    this.requiredDepreciation = this.checkRequiredDepreciationField();
    
    if(this.fixedAsset.ActivationDate != null && this.fixedAsset.InvoiceDate !=null && !this.requiredDepreciation){      
        this.faCreate.nextFixedAssetList();
    }
    else return;
  }

  checkRequiredDepreciationField():boolean{  
      if(this.visibleDepreciation == true && (this.fixedAsset.DepreciationPeriod == null || this.fixedAsset.DepreciationCalculationTypeId == null)){           
        return true;
      } 
      else
        if(this.visibleIfrs == true && (this.fixedAsset.Ifrsperiod == null || this.fixedAsset.IFRSCurrecyId ==null || this.fixedAsset.Ifrsprice == null)){
          return true;
        }

     return false;        
  } 

  previousTab(){
  this.faCreate.previous();
  }

  WillDepreciationBeCalculated(event){
    if(event.target.checked==true){
      this.visibleDepreciation=true;      
    }
    else{
      this.visibleDepreciation=false;
      this.fixedAsset.DepreciationPeriod = null;
      this.fixedAsset.DepreciationCalculationTypeId = null;
      this.requiredDepreciation=false;
    }
  }

   WillIfrsbeCalculated(event){
    if(event.target.checked == true){
      this.visibleIfrs=true;
    }
    else
    {
      this.visibleIfrs=false;
      this.fixedAsset.Ifrsperiod = null;
      this.fixedAsset.IFRSCurrecyId =null;
      this.fixedAsset.Ifrsprice = null;
      this.requiredDepreciation=false;
    }
  }

  resetForm(){
    this.reset.emit();
    
    this.fixedAsset = new FixedAsset();  

    this.visibleDepreciation = false;

    this.visibleIfrs = false;
   }
 
}
