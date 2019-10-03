import { Component, OnInit } from '@angular/core';
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
@Component({
  selector: 'app-periodic-maintenance',
  templateUrl: './periodic-maintenance.component.html',
  styleUrls: ['./periodic-maintenance.component.css']
})
export class PeriodicMaintenanceComponent extends BaseComponent implements OnInit {

  constructor(public baseService: BaseService) {
    super(baseService);
   }

  ngOnInit() {
  }

}
