import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WorkOrderListComponent } from '../work-order-list/work-order-list.component';
import { Maintenance } from '../../../models/Maintenance';
import { BaseService } from '../../../services/base.service';
import { BaseComponent } from '../../base/base.component';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkOrders } from '../../../models/WorkOrders';
import { WorkStep } from '../../../models/WorkStep';
import { IMAGE_URL } from '../../../declarations/service-values';

@Component({
  selector: 'app-work-order-detail',
  templateUrl: './work-order-detail.component.html',
  styleUrls: ['./work-order-detail.component.css']
})
export class WorkOrderDetailComponent extends BaseComponent implements OnInit, OnChanges {
  
  @Input() workOrderDetail: Maintenance = new Maintenance();
  @Input() wolComponent: WorkOrderListComponent;
  
  maintenance: Maintenance;
  workSteps: WorkStep[]=[];
  isWorkOrderDone: boolean;
  isWaitingInsertOrUpdate: boolean = false;
  imageUrl: any;
  
  constructor(baseService: BaseService) {
    super(baseService);
    this.GetWorkStepsByFixedAssetId();
  }
  ngOnInit() {
  }
  
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["workOrderDetail"].currentValue != changes["workOrderDetail"].previousValue) {
      this.GetWorkStepsByFixedAssetId();
    }
  }

  GetWorkStepsByFixedAssetId() {
    this.maintenance = new Maintenance;
    
    this.maintenance.FixedAssetId=144795;
    this.maintenance.MaintenanceNumber=30;

    console.log(this.workOrderDetail);
    
    this.baseService.workOrderService.GetWorkStepsByFixedAssetId(
      this.maintenance,
      // this.workOrderDetail.FixedAssetId,
      (maintenance: Maintenance) => {
        this.maintenance = maintenance;
        this.workSteps =maintenance[0].WorkOrder.WorkSteps;
        let path: any;
let kw="UploadFiles/";
        this.workSteps.forEach(e => {
          if(e.Picture){
          path = IMAGE_URL + kw + e.Picture;
          e.Picture = path;
        }
        });
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  IsWorkOrderDone(event){
    if (event.target.checked == true) {
      this.isWorkOrderDone = true;
    } else {
      this.isWorkOrderDone = false;   
    }
  }
  
}
