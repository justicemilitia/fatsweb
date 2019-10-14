import { Component, OnInit, Input } from '@angular/core';
import { FixedAsset } from '../../../models/FixedAsset';
import { WorkOrderListComponent } from '../work-order-list/work-order-list.component';
import { BaseService } from '../../../services/base.service';
import { BaseComponent } from '../../base/base.component';
import { Maintenance } from '../../../models/Maintenance';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-fix-breakdown',
  templateUrl: './fix-breakdown.component.html',
  styleUrls: ['./fix-breakdown.component.css']
})
export class FixBreakdownComponent extends BaseComponent implements OnInit {

  @Input() fixBreakdown: Maintenance = new Maintenance();
  @Input() wolComponent: WorkOrderListComponent;
  
  maintenance: Maintenance = new Maintenance();  

  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;

  constructor(baseService: BaseService) {
    super(baseService);
  }
  ngOnInit() {
  }

  onSubmit(data: NgForm) {

  }

}
