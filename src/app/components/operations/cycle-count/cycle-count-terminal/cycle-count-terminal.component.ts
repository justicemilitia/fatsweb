import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "src/app/components/base/base.component";
import { BaseService } from "src/app/services/base.service";
import { CycleCountPlan } from "src/app/models/CycleCountPlan";
import { HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { CycleCountStatu } from "src/app/declarations/cycle-count-statu";
import { CycleCountStatus } from "src/app/models/CycleCountStatus";

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
          this.baseService.popupService.ShowErrorPopup(error);
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
      },
      (error: HttpErrorResponse) => {}
    );
  }

  updateCycleCountPlanStatu(cyclecountplan: CycleCountPlan, startOrExit: boolean) {

    if(this.cyclecountplan.CycleCountPlanIds == null && this.cyclecountplan.CycleCountPlanLocationId == null){
      this.isSelectedPlanOrLocation = true;
      this.isStarted = false;
      return;
    }
    else
      this.isSelectedPlanOrLocation = false;
    

    switch (this.cyclecountstatus) {
      case 1:
        this.cyclecountplan.CycleCountStatusId = <number>(
          CycleCountStatu.CONTINUED
        );
        break;
      case 5:
        this.cyclecountplan.CycleCountStatusId = <number>(
          CycleCountStatu.FINISHED
        );
        break;
      case 4:
        this.cyclecountplan.CycleCountStatusId = <number>(
          CycleCountStatu.CONTINUED
        );
    }

    if (startOrExit == false && this.cyclecountplan.CycleCountPlanIds == null && this.cyclecountplan.CycleCountPlanLocationId == null) 
    {
      this.baseService.router.navigateByUrl("/dashboard");
      return;
    }
    
    let Ids:number[] = [];
    Object.assign(Ids,this.cyclecountplan.CycleCountPlanIds);
    this.cyclecountplan.CycleCountPlanIds=Ids;

    this.baseService.cycleCountService.UpdateCycleCountStatu(
      this.cyclecountplan,
      (cyclecountplan, message) => {
        /* Show pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        this.isStarted = true;

        if (startOrExit == false)
          this.baseService.router.navigateByUrl("/dashboard");
      },
      (error: HttpErrorResponse) => {
        /* Show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  makeCycleCounting() {

    let cycleplan:CycleCountPlan=new CycleCountPlan();

    Object.assign(cycleplan,this.cyclecountplan);

    this.baseService.cycleCountService.MakeCycleCounting(
      cycleplan,
      (cyclecount,message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
      },
      (error: HttpErrorResponse) => {
        /* Show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
