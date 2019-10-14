import { Component, OnInit, Input } from '@angular/core';
import { WorkOrderListComponent } from '../work-order-list/work-order-list.component';
import { Maintenance } from '../../../models/Maintenance';
import { BaseService } from '../../../services/base.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-work-order-detail',
  templateUrl: './work-order-detail.component.html',
  styleUrls: ['./work-order-detail.component.css']
})
export class WorkOrderDetailComponent extends BaseComponent implements OnInit {

  @Input() workOrderDetail: Maintenance = new Maintenance();
  @Input() wolComponent: WorkOrderListComponent;
  
  isWaitingInsertOrUpdate: boolean = false;
   
  constructor(baseService: BaseService) {
    super(baseService);
  }
  ngOnInit() {
  }

}
