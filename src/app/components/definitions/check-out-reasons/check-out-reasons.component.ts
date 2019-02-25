import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { BaseComponent } from '../../base/base.component';
import { CheckOutReason } from 'src/app/models/CheckOutReason';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-check-out-reasons',
  templateUrl: './check-out-reasons.component.html',
  styleUrls: ['./check-out-reasons.component.css']
})
export class CheckOutReasonsComponent extends BaseComponent implements OnInit {

  checkOutReasons: CheckOutReason[]=[];
  checkoutreason:CheckOutReason=new CheckOutReason();

  constructor(protected baseService: BaseService) { super(baseService); }

  ngOnInit() {
  
  }
  LoadCheckOutReasons() {
    this.baseService.checkOutReasonService.GetCheckOutReason(
      (checkOutReason: CheckOutReason[]) => {
        checkOutReason.forEach(e => {
          this.checkOutReasons.push(e);
        });
      }
    );
  }

  ResetForm(form?: NgForm){
    if(form!=null)
    this.ResetForm();
    this.checkoutreason=new CheckOutReason();
  }

  OnSubmit(data: NgForm) {
    if (data.value.checkOutReasonService == null) this.AddCheckOutReason(data);
    else this.UpdateCheckOutReason(data);
    this.LoadCheckOutReasons();
    this.ResetForm();
  }

  AddCheckOutReason(data: NgForm) {
    debugger;
    this.checkoutreason = <CheckOutReason>data.value;
    this.baseService.checkOutReasonService.AddCheckOutReason(
      this.checkoutreason
    );
  }

  UpdateCheckOutReason(data: NgForm) {
    this.checkoutreason = <CheckOutReason>data.value;
    this.baseService.checkOutReasonService.UpdateCheckOutReason(
      this.checkoutreason
    );
  }

  FillCompanyModal(checkOutReason: CheckOutReason) {
    this.baseService.checkOutReasonService.GetCheckOutReasonById(result => {
      this.checkoutreason = result;
    }, checkOutReason.CheckOutReasonId);
  }


}
