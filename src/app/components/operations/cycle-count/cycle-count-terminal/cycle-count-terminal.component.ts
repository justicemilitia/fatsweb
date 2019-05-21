import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "src/app/components/base/base.component";
import { BaseService } from "src/app/services/base.service";
import { CycleCountPlan } from "src/app/models/CycleCountPlan";
import { HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { CycleCountStatu } from "src/app/declarations/cycle-count-statu";
import { CycleCountStatus } from "src/app/models/CycleCountStatus";
import { getAnErrorResponse } from 'src/app/declarations/extends';

@Component({
  selector: "app-cycle-count-terminal",
  templateUrl: "./cycle-count-terminal.component.html",
  styleUrls: ["./cycle-count-terminal.component.css"]
})
export class CycleCountTerminalComponent extends BaseComponent
  implements OnInit {
  cyclecountplans: CycleCountPlan[] = [];

  locations: Location[] = [];

  cyclecountplan: CycleCountPlan = new CycleCountPlan();

  cyclecountplanId: number;

  cyclecountstatus: number;

  isStarted: boolean = false;

  isSelectedPlanOrLocation:boolean = false;

  isBarcodeRead:boolean=false;

  addCycleCounting:boolean=false;

  cycleCountingContinue:boolean=false;

  errorMessage: string = '';
  
  succesMessage: string = '';

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadCycleCountPlan();
  }

  ngOnInit() {}

  loadCycleCountPlan() {
    this.baseService.cycleCountService.GetCycleCountPlanWithoutCanceledPlan(
      (cyclecountplans: CycleCountPlan[]) => {
        this.cyclecountplans = cyclecountplans;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadLocationByCycleCountPlanId(event: any) {
    this.locations = [];

    this.isStarted = false;
    /* if value is empty return to prevent error */
    if (!event.target.value || event.target.value == "") {
      this.cyclecountplan.CycleCountPlanId = null;
      this.cyclecountplan.Location = new Location();
      return;
    }

    if (event.target.value) {
      this.baseService.cycleCountService.GetLocationByCycleCountPlanId(
        <number>event.target.value,
        (locations: Location[]) => {
          this.locations = locations;
        },
        (error: HttpErrorResponse) => {
          /* show error pop up */
          this.errorMessage = getAnErrorResponse(error.statusText).statusText;
        }
      );

      this.getCycleCountPlanStatusByPlanId(<number>event.target.value);
    }
  }

  getCycleCountPlanStatusByPlanId(planId: number) {
    this.baseService.cycleCountService.GetCycleCountPlanStatusByPlanId(
      planId,
      (cyclecountplan: CycleCountPlan) => {
        this.cyclecountstatus = cyclecountplan.CycleCountStatusId;
        if(this.cyclecountstatus == <number>(CycleCountStatu.CONTINUED))
          this.isStarted = true;
      },
      (error: HttpErrorResponse) => {}
    );
  }

  updateCycleCountPlanStatu(cyclecountplan: CycleCountPlan, startOrExit: boolean) {

    if(startOrExit==true)
    this.cycleCountingContinue=true;
    else
    this.cycleCountingContinue=false;

    if (this.cycleCountingContinue == false && this.cyclecountplan.CycleCountPlanId == null && this.cyclecountplan.LocationId == null) 
    {
      this.baseService.router.navigateByUrl("/dashboard");
      return;
    }
    
    if(this.cyclecountplan.CycleCountPlanId != null && this.cyclecountplan.LocationId != null){
      this.isSelectedPlanOrLocation = false;
    }
    else{
      this.isSelectedPlanOrLocation = true;
      this.isStarted = false;  
      return;
    }

    switch (this.cyclecountstatus) {
      case 1:
        this.cyclecountplan.CycleCountStatusId = <number>(
          CycleCountStatu.CONTINUED);
        break;
      case 5:
      if(startOrExit == true){
        this.cyclecountplan.CycleCountStatusId = <number>(
          CycleCountStatu.FINISHED);
      }
        else
        this.cyclecountplan.CycleCountStatusId = <number>(
          CycleCountStatu.STOPPED);
      break;
      case 4:
        this.cyclecountplan.CycleCountStatusId = <number>(
          CycleCountStatu.CONTINUED);
      break;
    }

    let selectedCycleCountPlan:CycleCountPlan=new CycleCountPlan();
    Object.assign(selectedCycleCountPlan,this.cyclecountplan);

    this.baseService.cycleCountService.UpdateCycleCountStatu(
      selectedCycleCountPlan,
      (cyclecountplan : CycleCountPlan, message) => {
        /* Show pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        this.isStarted = true;

        if (startOrExit == false)
          this.baseService.router.navigateByUrl("/dashboard");        

        this.cyclecountstatus = cyclecountplan.CycleCountStatusId;
        
        this.resetForm();

      },
      (error: HttpErrorResponse) => {
        /* Show error message */
        this.errorMessage = getAnErrorResponse(error.statusText).statusText;
      }
    );
  }

  makeCycleCounting() {

    let cycleplan:CycleCountPlan=new CycleCountPlan();
    
    if(this.cyclecountplan.Barcode == null){     
      this.errorMessage = "Barkod Okunamadı"
      return;
    }

    Object.assign(cycleplan,this.cyclecountplan);

    this.baseService.cycleCountService.MakeCycleCounting(
      cycleplan,
      (cyclecount,message) => {
        this.succesMessage = message;
        this.isBarcodeRead = false;
        this.addCycleCounting = true;
      },
      (error: HttpErrorResponse) => {
        /* Show error message */
        this.errorMessage = getAnErrorResponse(error.statusText).statusText;
      }
    );
  }

  onCountingKeyUp(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      this.makeCycleCounting();
    }
  };

  resetAlert(event){
    this.succesMessage='';
    this.errorMessage ='';
  }

  resetForm(){

    this.isStarted=false;

    this.cyclecountplan=new CycleCountPlan();
  }
}
