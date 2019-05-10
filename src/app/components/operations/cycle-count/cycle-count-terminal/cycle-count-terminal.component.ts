import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "src/app/components/base/base.component";
import { BaseService } from "src/app/services/base.service";
import { CycleCountPlan } from 'src/app/models/CycleCountPlan';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: "app-cycle-count-terminal",
  templateUrl: "./cycle-count-terminal.component.html",
  styleUrls: ["./cycle-count-terminal.component.css"]
})
export class CycleCountTerminalComponent extends BaseComponent
  implements OnInit {

    cyclecountplans:CycleCountPlan[]=[];

  constructor(public baseService: BaseService) {

    super(baseService);
    this.loadCycleCountPlan();

  }

  ngOnInit() {}

  loadCycleCountPlan() {
    this.baseService.cycleCountService.GetCycleCountPlan(
      (cyclecountplans:CycleCountPlan[]) => {
        this.cyclecountplans = cyclecountplans;
      }, (error:HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  loadLocationByCycleCountId(){

    // this.baseService.cycleCountService.GetLocationByCycleCountPlanId()
  }
}
