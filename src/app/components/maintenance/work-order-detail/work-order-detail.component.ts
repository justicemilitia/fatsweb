import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { WorkOrderListComponent } from '../work-order-list/work-order-list.component';
import { Maintenance } from '../../../models/Maintenance';
import { BaseService } from '../../../services/base.service';
import { BaseComponent } from '../../base/base.component';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkOrders } from '../../../models/WorkOrders';
import { WorkStep } from '../../../models/WorkStep';
import { IMAGE_URL } from '../../../declarations/service-values';
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';
import { WorkStepConsumables } from 'src/app/models/WorkStepConsumables';
import { ConsumableProperties } from 'src/app/models/ConsumableProperties';
import { NgForm } from '@angular/forms';

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

  workStep:WorkStep = new WorkStep();

  processData:Maintenance=new Maintenance();

  workStepConsumable:ConsumableProperties = new ConsumableProperties();

  workStepConsumablesWithProperties:ConsumableProperties[]=[];

  barcode:string;
  fixedAssetCard:string;
  maintenanceNumber:string;

  consumables:ConsumableProperties=new ConsumableProperties();


  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedassetpropertyvalue", [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Property_Name'),
        columnName: ["FixedAssetCardProperty", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Property_Value'),
        columnName: ["Value"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["FixedAssetCardProperty", "Name"]
    }
  )

  constructor(baseService: BaseService) {
    super(baseService);
    this.GetWorkStepsByFixedAssetId();
  }

  ngOnInit() {
  }
  
  onSubmit(data:NgForm){

    this.PeriodicMaintenanceProcess(data,this.workSteps);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["workOrderDetail"].currentValue != changes["workOrderDetail"].previousValue) {
    
      this.GetWorkStepsByFixedAssetId();   

    }
  } 

  GetWorkStepsByFixedAssetId() {
    this.maintenance = new Maintenance;
    
    this.maintenance.FixedAssetId=this.workOrderDetail.FixedAssetId;

    this.maintenance.MaintenanceNumber=this.workOrderDetail.MaintenanceNumber;
    
    this.baseService.workOrderService.GetWorkStepsByFixedAssetId(
      this.maintenance,   
      (maintenance: Maintenance) => {

        Object.assign( this.maintenance, maintenance);      
       
        this.barcode = this.maintenance.FixedAsset == null ? "" : this.maintenance.FixedAsset.Barcode;
        this.fixedAssetCard = this.maintenance.FixedAssetCard == null ? "" : this.maintenance.FixedAssetCard.Name;
        this.maintenanceNumber = this.maintenance.MaintenanceNumber.toString();
        this.workSteps =maintenance.WorkOrder.WorkSteps;
        let consumables:WorkStepConsumables[]=[];
        let path: any;
        let thumb="ThumbImages/thumb_";
        this.workSteps.forEach(e => {
          if(e.Picture){
          path = IMAGE_URL + thumb + e.Picture;
          e.Picture = path;
        }
          
        let workStepConsumables:WorkStepConsumables[] = e.WorkStepConsumables;

        workStepConsumables.forEach(t=>{
            let properties:string = '';

            this.workStepConsumablesWithProperties=[];

            if(t.Consumable.ConsumableCard.FixedAssetPropertyDetails.length == 0)
              return;            
             
            for(let i = 0; i<t.Consumable.ConsumableCard.FixedAssetPropertyDetails.length; i++){

              properties += t.Consumable.ConsumableCard.FixedAssetPropertyDetails[i].Value + (t.Consumable.ConsumableCard.FixedAssetPropertyDetails.length - i == 1 ? "" : ",");
            
            }

            properties = t.Consumable.ConsumableCard.ConsumableCardName + ": " + properties + "(" + t.Quantity +" "+  ")";

            let consumableWithProperty:ConsumableProperties = new ConsumableProperties();
            
            Object.assign(consumableWithProperty,e);

            consumableWithProperty.ConsumableId = t.ConsumableId;


            consumableWithProperty.properties = properties;

            this.workStepConsumablesWithProperties.push(consumableWithProperty);

          });

          e.WorkStepConsumablesWithProperty = this.workStepConsumablesWithProperties;

        });

        Object.assign(this.processData,maintenance);

        this.processData.WorkOrder.WorkSteps =  this.workSteps;

        console.log(this.processData);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  PeriodicMaintenanceProcess(data:NgForm,workSteps:WorkStep[]){

    let maintenance:Maintenance=new Maintenance();
    
    maintenance.MaintenanceListId = this.processData.MaintenanceListId;

    maintenance.WorkOrderId = this.processData.WorkOrder.WorkOrderId;

    maintenance.WorkSteps = this.processData.WorkOrder.WorkSteps; 

    maintenance.WorkSteps.forEach((e,i)=>{

      let workStep:WorkStep=new WorkStep();
      
      workStep.WorkStepId = e.WorkStepId;

      workStep.IsCompleted = e.IsCompleted;

      for(let j = 0; j<e.WorkStepConsumablesWithProperty.length;j++){

        let quantity:number = Number(data.value["Quantity_"+ i +"_"+j]);

        let consumables:WorkStepConsumables = new WorkStepConsumables();

        consumables.ConsumableId = e.WorkStepConsumablesWithProperty[j].ConsumableId;

        consumables.Quantity = quantity;     
   
        workStep.WorkStepConsumables.push(consumables); 
      }  

      maintenance.WorkStepsForMaintinancesProcess.push(workStep);
    });

    this.baseService.workOrderService.PeriodicMaintenanceProcess(maintenance,()=>{
      
    },(error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  IsWorkOrderDone(event){
    if (event.target.checked == true) {
      this.isWorkOrderDone = true;
    } else {
      this.isWorkOrderDone = false;   
    }
  }

  ShowImage(path: any){
    this.imageUrl=path.replace("ThumbImages/thumb_", "UploadFiles/");
    this.popupComponent.ShowModal('#modalShowImagePopup');
  }
  
  closeModalShowImagePopup(){
    this.popupComponent.CloseModal('#modalShowImagePopup');   
    this.workOrderDetail= new Maintenance(); 
  }
}
