import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { ConsumableCard } from 'src/app/models/ConsumableCard';
import { ConsumableProperties } from 'src/app/models/ConsumableProperties';
import { HttpErrorResponse } from '@angular/common/http';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { FixedAssetCardProperty } from 'src/app/models/FixedAssetCardProperty';
import { WorkOrders } from 'src/app/models/WorkOrders';
import { Consumable } from 'src/app/models/Consumable';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { FixedAssetCard } from 'src/app/models/FixedAssetCard';
import { Observable } from 'rxjs';
import { WorkStep } from 'src/app/models/WorkStep';
import { WorkOrderPeriodTypes } from 'src/app/models/WorkOrderPeriodTypes';
import { WorkStepConsumables } from 'src/app/models/WorkStepConsumables';
import { NgForm } from '@angular/forms';
import { FixedAssetPropertyDetails } from 'src/app/models/FixedAssetPropertyDetails';
@Component({
  selector: 'app-periodic-maintenance',
  templateUrl: './periodic-maintenance.component.html',
  styleUrls: ['./periodic-maintenance.component.css']
})
export class PeriodicMaintenanceComponent extends BaseComponent implements OnInit {   
  
  consumableCards:ConsumableCard[]=[];

  faProperties:FixedAssetCardProperty[]=[];
  
  workOrders:WorkOrders[]=[];

  consumables:ConsumableProperties[]=[];

  workOrder: WorkOrders = new WorkOrders();

  workStep: WorkStep=new WorkStep();

  workSteps:WorkStep[]=[];

  consumable: Consumable = new Consumable();

  workOrderCode:string;

  fixedAssetCardId:number;

  fixedAssetCard:FixedAssetCard=new FixedAssetCard();

  consumableCardsWithQuantity:string[]=[];

  consumableCardsWithConsumableObject:ConsumableProperties[]=[];  

  consumableCardUnit:string;

  WorkStepRowId:number=1;

  WorkOrderId:number;

  WorkStepId:number = 0;

  isInsertDescription:boolean=false;

  periods:WorkOrderPeriodTypes[]=[];

   /* Is Waititing for a request */
   isWaitingInsertOrUpdate: boolean = false;

   isWaitingInsertWorkStep: boolean = false;

   isConsumableUse:boolean=false;

   categoryName:string;

   isUpdateOrInsertMaintenance:boolean=false;

   consumableCardId:number;

   insertedPeriodTypeId:number = null;

   requiredConsumable:boolean=false;

   insertConsumableProperties:boolean=false;

   insertWorkStep:boolean=false;

   imageName:string = '';

   newWorkStep:WorkStep=new WorkStep();

   required:boolean=false;

   periodTypeEnum =
   {
       Day:1,
       Week:2,
       Month:3
   }
 
   day:number = 30;
   week:number = 52;
   month:number = 12;
 
   periodArray:WorkOrderPeriodTypes[]=[];

   insertedPeriodTypeValue:number = null;

   imgURL: any;

   FixedAssetCardPicture:string;

   errorMessage:boolean=false;

   disablebtnAddWorkOrder:boolean=false;
   
   visibleWorkOrderButton:boolean=false;

   counter:number=0;

   visibleWorkStepButton:boolean=false;
 
   ngAfterViewInit(): void {
    this.baseService.activeRoute.queryParams.subscribe(params => {
      this.fixedAssetCardId = params.insertedFixedAssetCardId == null ? params.updatedFixedAssetCardId : params.insertedFixedAssetCardId,
      this.WorkOrderId = params.updatedWorkOrderId  
    });
   }

//#region DataTables
  public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
    "consumablepropertyvalue",
    [      
    {
      columnDisplayName: this.getLanguageValue('Fixed_Asset_Category_Name'),
      columnName: ["ConsumableCard","ConsumableCategory","ConsumableCategoryName"],
      isActive: true,
      classes: [],
      placeholder: "",
      type: "text"
    }
    ],
    {
      isDesc: false,   
      column: ["ConsumableCard","ConsumableCategory","ConsumableCategoryName"]   
    }
  );

  
  public dataTableWorkStep: TreeGridTable = new TreeGridTable(
    "workstep",
    [      
    {
      columnDisplayName: 'İş Adımları',
      columnName: ["WorkStepRowId"],
      isActive: true,
      classes: [],
      placeholder: "",
      type: "text"
    },
    {
      columnDisplayName: 'İş Adımı Açıklaması',
      columnName: ["Description"],
      isActive: true,
      classes: [],
      placeholder: "",
      type: "text"
    }
    ],
    {
      isDesc: true,   
      column: ["WorkStepRowId"]   
    }
  );
  //#endregion
  
  constructor(public baseService: BaseService) {

    super(baseService);   
    
    this.loadFixedAssetCard(Number(this.baseService.workOrderService.GetFixedAssetInfo()));

    if(this.baseService.workOrderService.GetWorkOrderInfo() == null )
      this.loadWorkOrderCode();

    this.loadConsumableCardDropdown();

    this.loadFixedAssetProperties();

    this.GetWorkOrderPeriodTypes();

    if(this.dataTableWorkStep.TGT_copySource().length != 0){
      this.disablebtnAddWorkOrder=false;
      this.WorkStepRowId = this.dataTableWorkStep.TGT_copySource().length + 1;
    }

    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isTableEditable = false;
    this.dataTablePropertyValue.isMultipleSelectedActive = true;
    this.dataTablePropertyValue.isFilterActive = true;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isScrollActive = true;
    this.dataTablePropertyValue.isDeleteable=false;
    this.dataTablePropertyValue.isFilterActive = false;

    this.dataTableWorkStep.isColumnOffsetActive = false;
    this.dataTableWorkStep.isPagingActive = false;   
    this.dataTableWorkStep.isLoading = false;
    this.dataTableWorkStep.isScrollActive = true;
    this.dataTableWorkStep.isMultipleSelectedActive = false;

   }

   ngOnInit() {
  }

   onSubmit(data:NgForm){
    if(this.baseService.workOrderService.GetWorkOrderInfo() == null)
      this.addWorkOrder(data);
    else
      this.updateWorkOrder(data);
  }

  //#region Load Data
  async loadFixedAssetCard(fixedAssetCardId:number){
    if(this.baseService.workOrderService.GetWorkOrderInfo() == null){

    this.visibleWorkOrderButton = true;

    this.isUpdateOrInsertMaintenance = true;

    this.baseService.fixedAssetCardService.GetFixedAssetCardById(
      fixedAssetCardId ,
      (result: FixedAssetCard) => {

        this.baseService.spinner.show();
        /* then bind it to fixed asset card category model to update */
        setTimeout(() => {
         
          /* bind result to model */
          Object.assign(this.fixedAssetCard, result);
          
          this.categoryName = result.FixedAssetCardCategory.Name;      

        }, 1000);

        this.baseService.spinner.hide();
      },
      (error: HttpErrorResponse) => {
        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);

        this.baseService.spinner.hide();
      }
    );
  }else{
    this.visibleWorkOrderButton = false;

    this.loadFixedAssetCardWithWorkOrder(Number(this.baseService.workOrderService.GetFixedAssetInfo()));
  }
  }

  async loadWorkOrderByWorkOrderId(workOrderId:number){
    let workOrdersId:WorkOrders=new WorkOrders();

    workOrdersId.WorkOrderId = workOrderId;

    this.baseService.spinner.show();

    this.baseService.workOrderService.GetWorkStepListByWorkOrderId(workOrdersId,
    (workOrder:WorkOrders)=>{

      this.workOrderCode=String(workOrder.WorkOrderCode);

      let workSteps:WorkStep[]=[];

      workOrder.WorkSteps.forEach(e=>{
        let workStep:WorkStep=new WorkStep();
        Object.assign(workStep,e);
        workSteps.push(workStep);
      });   

      if(workOrder.FixedAssetCardPeriods[0] != null){
        let fixedAssetCard:FixedAssetCard=new FixedAssetCard();
        Object.assign(fixedAssetCard,workOrder.FixedAssetCardPeriods[0].FixedAssetCard);
        this.fixedAssetCard.FixedAssetCardCode = fixedAssetCard.FixedAssetCardCode;
        this.fixedAssetCard.Name = fixedAssetCard.Name;
        this.categoryName = fixedAssetCard.FixedAssetCardCategory.Name;
        this.workOrder.PeriodTypeId = workOrder.FixedAssetCardPeriods[0].PeriodTypeId;
        this.workOrder.Frequency = workOrder.FixedAssetCardPeriods[0].Frequency;
      }

      this.dataTableWorkStep.TGT_loadData(workSteps);

      this.WorkStepRowId = this.dataTableWorkStep.TGT_copySource().length + 1;

      this.baseService.spinner.hide();

    },(error:HttpErrorResponse)=>{
      this.baseService.spinner.hide();

      this.baseService.popupService.ShowErrorPopup(error);
    });
  }

 async loadFixedAssetCardWithWorkOrder(fixedAssetCardId:number){
  
    this.baseService.workOrderService.GetWorkStepListByFixedAssetCardId(fixedAssetCardId,
    (workOrder:WorkOrders[])=>{

      this.workOrders = workOrder;

      if(workOrder.length > 1)
        this.isUpdateOrInsertMaintenance = false;
      else
        this.isUpdateOrInsertMaintenance = true;
      
      Object.assign(this.workOrder,workOrder[0]);

      this.workOrderCode = this.workOrder.WorkOrderCode.toString();
      
      this.workOrder.Frequency = this.workOrder.FixedAssetCardPeriods[0].Frequency;

      this.workOrder.PeriodTypeId = this.workOrder.FixedAssetCardPeriods[0].PeriodTypeId;

      switch(this.workOrder.PeriodTypeId){
        case this.periodTypeEnum.Day:
        this.periodArray = this.loadPeriodNumberByPeriodType(this.day);     
        break;
        case this.periodTypeEnum.Week:
        this.periodArray = this.loadPeriodNumberByPeriodType(this.week);
        break;
        case this.periodTypeEnum.Month:
        this.periodArray = this.loadPeriodNumberByPeriodType(this.month);
        break;
        }      

      let workSteps:WorkStep[]=[];

      this.workOrder.WorkSteps.forEach(e=>{
        let workStep:WorkStep=new WorkStep();
        Object.assign(workStep,e);
        workSteps.push(workStep);
      });   

      if(this.workOrder.FixedAssetCardPeriods[0] != null){
        let fixedAssetCard:FixedAssetCard=new FixedAssetCard();
        Object.assign(fixedAssetCard,this.workOrder.FixedAssetCardPeriods[0].FixedAssetCard);
        this.fixedAssetCard.FixedAssetCardCode = fixedAssetCard.FixedAssetCardCode;
        this.fixedAssetCard.Name = fixedAssetCard.Name;
        this.categoryName = fixedAssetCard.FixedAssetCardCategory.Name;
      }

      this.dataTableWorkStep.TGT_loadData(workSteps);

      this.WorkStepRowId = this.dataTableWorkStep.TGT_copySource().length + 1;

    },(error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  getWorkOrderByWorkOrderId(event:any){
    let workOrderId:number = Number(event.target.value);

    if(workOrderId != -1)
      this.loadWorkOrderByWorkOrderId(workOrderId);
    else{
    this.workOrders.filter(x=>x.WorkOrderId == -1).forEach(t=>{
      this.workOrderCode = t.WorkOrderCode.toString();
    });
    }  
  }

  AddNewWorkOrder(data:NgForm){

    this.resetWorkStep();

    data.resetForm();

    this.workSteps=[];

    this.dataTableWorkStep.TGT_clearData();

    this.workOrder = new WorkOrders();   

    this.baseService.workOrderService.GetValidWorkOrderNumber((workOrderCode) => {
 
      this.visibleWorkOrderButton = true;

      this.visibleWorkStepButton =  false;
  
      this.WorkStepRowId=1;
  
      this.baseService.workOrderService.removeWorkOrderInfo();

      this.workOrderCode = workOrderCode;
  
      this.isUpdateOrInsertMaintenance = false;

      console.log(this.workOrders);
    },(error:HttpErrorResponse) => {

      this.baseService.popupService.ShowErrorPopup(error);

    });
  }
 
  onDelete(){
    this.popupComponent.ShowModal('#modalShowDeletePopupForWorkStep');
  }

  deleteWorkStep(){

    this.popupComponent.CloseModal('#modalShowDeletePopupForWorkStep');

    this.consumableCardUnit = ' ';

    let workSteps:WorkStep[]= <WorkStep[]>this.dataTableWorkStep.TGT_copySource();

    workSteps = workSteps.filter(x=>x.WorkStepId != this.WorkStepId);

    let stepRow:number=1;

    workSteps.forEach(t=>{
      t.WorkStepRowId = stepRow;
      stepRow++;
    });
    
    this.dataTableWorkStep.isLoading=true;

    this.dataTableWorkStep.TGT_loadData(workSteps);

    this.dataTableWorkStep.isLoading=false;

    this.WorkStepRowId = this.dataTableWorkStep.TGT_copySource().length + 1;

    this.resetWorkStep();
  }

  deleteWorkOrder(workOrderId:number){

    let workOrderIds:number[]=[];
    workOrderIds.push(workOrderId);

    this.baseService.workOrderService.DeleteWorkOrder(workOrderIds,(message)=>{
      this.baseService.popupService.ShowSuccessPopup(message);

      if(this.workOrders.length == 1){
        this.baseService.router.navigateByUrl("/fixedassetcard");
      }


    },(error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  async loadConsumableCardDropdown(){
    await this.baseService.consumableCardService.GetConsumableCards(
      (consumableCards: ConsumableCard[]) => {
        this.consumableCards = consumableCards;

        consumableCards.forEach(e=>{
        
        });
    
        if(consumableCards.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadFixedAssetProperties() {
    this.baseService.fixedAssetService.GetFixedAssetProperties(
      (faProperties: FixedAssetCardProperty[]) => {

        this.faProperties = faProperties;

        this.faProperties.forEach(e => {
          this.dataTablePropertyValue.dataColumns.push({
            columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
            columnDisplayName: e.Name,
            isActive: true,
            type: "text"
          });
        });

        this.dataTablePropertyValue.TGT_bindActiveColumns();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadWorkOrderByFixedAssetCardId(fixedAssetCardId:number){
    this.baseService.workOrderService.GetWorkOrderByFixedAssetCardId(fixedAssetCardId,
      (workOrders:WorkOrders[])=>{
        this.workOrders = workOrders;
      }, (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });      
  }

  async loadWorkOrderCode(){
    this.baseService.workOrderService.GetValidWorkOrderNumber((workOrderCode) => {
      this.workOrderCode = workOrderCode;
    },(error:HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });
   }

  loadConsumablesByConsumableCardId(event:any){

    this.consumableCardId = Number(event.target.value);   

    this.baseService.workOrderService.GetConsumablesByConsumableCardId(this.consumableCardId,
    (consumables:ConsumableProperties[])=>{
      
      this.consumables = consumables;

      this.consumableCardUnit=this.consumables[0].ConsumableCard.ConsumableUnit.ConsumableUnitName;
      //this.consumableCardUnit= // Apiden gelen alana göre birimleri çek

      this.consumables.forEach(e=>{
        e.FixedAssetPropertyDetails.forEach( p => {
          e["PROP_" + p.FixedAssetCardPropertyId.toString()]=p.Value;
        });
      });
      
      this.dataTablePropertyValue.TGT_loadData(consumables);

    },(error:HttpErrorResponse)=>{
      if(event.target.selectedIndex != 0)
      this.baseService.popupService.ShowErrorPopup(error);
      else
      this.dataTablePropertyValue.TGT_clearData();
    });
  }
  //#endregion

  updateWorkOrder(data:NgForm){
      /* Check model state */
  if (data.form.invalid == true) return;

  this.baseService.spinner.show();
    
  let workSteps:WorkStep[]= <WorkStep[]>this.dataTableWorkStep.TGT_copySource();
   
  this.workOrder.WorkSteps=workSteps;

  this.workOrder.FixedAssetCardId = this.fixedAssetCardId;
  
  this.workOrder.WorkOrderCode = Number(this.workOrderCode);   

  this.workOrder.WorkOrderId=this.WorkOrderId;

  this.baseService.workOrderService.UpdateWorkOrder(this.workOrder,(result,message:string)=>{

    this.baseService.popupService.ShowSuccessPopup(message);

    this.loadWorkOrderByWorkOrderId(this.workOrder.WorkOrderId);

    data.resetForm();

    this.baseService.spinner.hide();
  },
  (error:HttpErrorResponse)=>{
    this.baseService.popupService.ShowErrorPopup(error);

    this.baseService.spinner.hide();
  })
  }

  isConsumableUsed(event:any){
    if(event.target.checked == true)
    this.isConsumableUse = true;     
    else{
    this.isConsumableUse = false;
    this.requiredConsumable = false;
    this.consumableCardsWithConsumableObject=[];
    this.workStep.Quantity=null;
    this.consumableCardUnit=' ';
    this.dataTablePropertyValue.TGT_clearData();    
    }    
  }

  insertConsumableCardWithProperties(){

    this.insertConsumableProperties=true;

    this.isInsertDescription=true;

    let consumableWithProperties:ConsumableProperties[] = <ConsumableProperties[]>this.dataTablePropertyValue.TGT_getSelectedItems();

    let consumableWithProperty:ConsumableProperties=new ConsumableProperties();
    
    if(consumableWithProperties.length == 1){
      this.requiredConsumable = false;
      if((this.workStep.Quantity != null || this.workStep.Quantity != undefined) && this.workStep.Quantity != 0)
        this.insertConsumableProperties = true;
      else
      return;   
    }  
    else{    
      this.requiredConsumable = true;
      return;
    }

    this.errorMessage = false;

    Object.assign(consumableWithProperty,consumableWithProperties[0]);      

    consumableWithProperties.forEach(e=>{
      consumableWithProperty.Consumable.ConsumableCard = e.ConsumableCard;
      consumableWithProperty.ConsumableCard = e.ConsumableCard;
    });


    if(this.consumableCardsWithConsumableObject.length > 0){
    let count:number=0;

    this.consumableCardsWithConsumableObject.forEach(x=>{
     
      if(x.ConsumableId == consumableWithProperty.ConsumableId){
        this.consumableCardsWithConsumableObject = this.consumableCardsWithConsumableObject.filter(t=>t.ConsumableId != x.ConsumableId);

        this.workStep.Quantity = x.Quantity + this.workStep.Quantity;

        
        this.addPropertyArray(consumableWithProperty);
        count++;
        return;
      }

    });
    if(count == 0)
    this.addPropertyArray(consumableWithProperty);

  }else
    this.addPropertyArray(consumableWithProperty);
  

  //RESET
    this.workStep.Quantity = null;

    this.insertConsumableProperties=false;
  }

  addPropertyArray(consumableWithProperty:ConsumableProperties){

  let properties:string='';  

  for (let i = 0; i < consumableWithProperty.FixedAssetPropertyDetails.length; i++) {
    properties+= consumableWithProperty.FixedAssetPropertyDetails[i].Value + ( consumableWithProperty.FixedAssetPropertyDetails.length - i == 1 ? "" : ",");                                  
  }

  properties = consumableWithProperty.ConsumableCard.ConsumableCardName + ": " + properties + "("+this.workStep.Quantity +" "+this.consumableCardUnit+")"

  consumableWithProperty.properties = properties;

  consumableWithProperty.Quantity=this.workStep.Quantity;

  this.consumableCardsWithConsumableObject.push(consumableWithProperty);
  }

  insertWorkStepToDataTableWorkStep(data:NgForm){   
    let stepRow:number;

    this.isWaitingInsertWorkStep = true;    
    
    this.isInsertDescription=true;

    let dataTableWorkStep:WorkStep[]=<WorkStep[]>this.dataTableWorkStep.TGT_copySource();

    if(this.isConsumableUse == true &&      
    this.consumableCardsWithConsumableObject.length == 0){
      this.errorMessage = true;
      this.isWaitingInsertWorkStep = false; 
      return;
    }
    else
    this.errorMessage=false;

    if(data.value.Description != undefined && this.workStep.Description != "")
    this.workStep.Description= data.value.Description;     
    else{
      this.isWaitingInsertWorkStep = false;
      this.workStep = new WorkStep();
      this.isWaitingInsertWorkStep = false; 
      return;
    }
    

    this.createWorkStepObject(data);
   
    stepRow=this.WorkStepRowId; 

    this.newWorkStep.WorkStepRowId=stepRow;

    this.newWorkStep.WorkStepId = (this.dataTableWorkStep.TGT_copySource().length + 1) * -1;
    
    this.newWorkStep.Picture = this.FixedAssetCardPicture;

    this.newWorkStep.imageName=this.imageName;

    Object.assign(this.workSteps,dataTableWorkStep);

    this.workSteps.push(this.newWorkStep);
  
    setTimeout(()=>{
      this.isWaitingInsertWorkStep=false;         

      this.dataTableWorkStep.TGT_loadData(this.workSteps);

      this.WorkStepRowId = stepRow + 1;

      this.disablebtnAddWorkOrder=true;

      this.isInsertDescription=false;

      this.WorkStepId++;

      this.resetWorkStep();
    },1000);
  }

  updateWorkStepToDataTableWorkStep(data:NgForm){

    this.visibleWorkStepButton=false;

    this.isWaitingInsertWorkStep = true;    

    this.isInsertDescription=true;

    let dataTableWorkStep:WorkStep[]=<WorkStep[]>this.dataTableWorkStep.TGT_copySource();


      if(this.isConsumableUse == true &&  this.consumableCardsWithConsumableObject.length == 0){
          this.errorMessage = true;
          this.isWaitingInsertWorkStep = false; 
          this.visibleWorkStepButton = true;
          return;
        }
        else
        this.errorMessage=false;
    
        if(data.value.Description != undefined && this.workStep.Description != "")
        this.workStep.Description= data.value.Description;     
        else{
          this.isWaitingInsertWorkStep = false;
          this.visibleWorkStepButton = true;
          this.workStep = new WorkStep();
          return;
        }

    let updateWorkStep:WorkStep[] = <WorkStep[]>this.dataTableWorkStep.TGT_copySource();

    updateWorkStep = updateWorkStep.filter(x=>x.WorkStepId!= this.workStep.WorkStepId);
    

    this.createWorkStepObject(data);

    this.newWorkStep.WorkStepId = this.workStep.WorkStepId;

    this.newWorkStep.imageName = this.imageName ;

    updateWorkStep.push(this.newWorkStep);    
    
    setTimeout(()=>{
      this.WorkStepId++;

      this.isWaitingInsertWorkStep=false;         

      this.dataTableWorkStep.TGT_loadData(updateWorkStep);
      
      this.WorkStepRowId = this.dataTableWorkStep.TGT_copySource().length + 1;

      this.disablebtnAddWorkOrder=true;

      this.isInsertDescription=false;

      this.visibleWorkStepButton=false;

      this.resetWorkStep();
    },1000);
  }

  createWorkStepObject(data:NgForm){

    this.newWorkStep = new WorkStep();
    

    let workStepConsumables:WorkStepConsumables[]=[];    
    
    Object.assign(this.newWorkStep,this.workStep);

    this.newWorkStep.WorkStepRowId = this.WorkStepRowId;

    this.newWorkStep.Picture = this.FixedAssetCardPicture;

    this.consumableCardsWithConsumableObject.forEach(x=>{
      
      let workStepConsumable:WorkStepConsumables=new WorkStepConsumables();

      workStepConsumable.Quantity = x.Quantity;

      workStepConsumable.ConsumableId=x.ConsumableId;    

      Object.assign(workStepConsumable.Consumable.ConsumableCard,x.Consumable.ConsumableCard);

      workStepConsumable.Consumable.ConsumableCard.FixedAssetPropertyDetails = x.Consumable.ConsumableCard.FixedAssetPropertyDetails;   
    
      workStepConsumables.push(workStepConsumable);
    });

   // this.newWorkStep.WorkStepId = (this.WorkStepId + 1) *-1;

    this.newWorkStep.WorkStepConsumables=workStepConsumables;
  }

  resetWorkStep(){

    this.insertedPeriodTypeId=null;

    this.insertedPeriodTypeValue=null;
    
    this.insertWorkStep = false;

    this.workSteps=[];

    this.workStep = new WorkStep();

    this.dataTablePropertyValue.TGT_clearData();

    this.insertConsumableProperties=false;

    this.consumableCardsWithConsumableObject=[];

    this.isConsumableUse = false;

    this.imageName='';

    this.consumableCardUnit = ' ';
  }

  GetWorkOrderPeriodTypes(){
    this.baseService.workOrderService.GetWorkOrderPeriodTypes((periods:WorkOrderPeriodTypes[])=>{

      Object.assign(this.periods,periods);

    },(error:HttpErrorResponse)=>{

      /* show error message */
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  selectPeriod(event:any){
    if(event.target.selectedIndex==0)
      {
        this.periodArray=[];
        this.insertedPeriodTypeId=null;
        return;
      }

      let period:number=Number(event.target.value);
      this.insertedPeriodTypeId=period;
      switch(period){
      case this.periodTypeEnum.Day:
      this.periodArray = this.loadPeriodNumberByPeriodType(this.day);     
      break;
      case this.periodTypeEnum.Week:
      this.periodArray = this.loadPeriodNumberByPeriodType(this.week);
      break;
      case this.periodTypeEnum.Month:
      this.periodArray = this.loadPeriodNumberByPeriodType(this.month);
      break;
      }
  }

  loadPeriodNumberByPeriodType(key:number):WorkOrderPeriodTypes[]{
    let periods:WorkOrderPeriodTypes[]=[];

    for (let i = 1; i <= key; i++) {
      let period:WorkOrderPeriodTypes = new WorkOrderPeriodTypes();
      period.FrequencyId = i;
      period.Frequency = i;
      periods.push(period);                          
    }

    return periods;
  }

  selectPeriodValue(event:any){
    if(event.target.selectedIndex==0){
      this.insertedPeriodTypeValue = null;    
    }else{
      this.insertedPeriodTypeValue = Number(event.target.value);
    }
  }

  addWorkOrder(data:NgForm){

  /* Check model state */
  if (data.form.invalid == true) return;

  this.baseService.spinner.show();
     
   let workSteps:WorkStep[]= <WorkStep[]>this.dataTableWorkStep.TGT_copySource();
    
   this.workOrder.WorkSteps=workSteps;

   this.workOrder.FixedAssetCardId = this.fixedAssetCardId;
   
   this.workOrder.WorkOrderCode = Number(this.workOrderCode);      

    this.baseService.workOrderService.AddWorkOrder(this.workOrder,(workOrder:WorkOrders,message)=>{

      this.baseService.popupService.ShowSuccessPopup(message);

      this.visibleWorkOrderButton=false;

      this.workOrders.push(workOrder);

      data.resetForm();

      this.baseService.spinner.hide();
    },(error:HttpErrorResponse)=>{
     /* show error message */
     this.baseService.spinner.hide();

     this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  async onDoubleClickItem(item: WorkStep) {  

    this.errorMessage = false;

    this.consumableCardsWithConsumableObject=[];

    if(item.WorkStepId < 0){   
    
      this.WorkStepId = item.WorkStepId;

      this.getWorkStepItem(item);

      this.IsUsedConsumable(item);

    }else{

      this.WorkStepId = item.WorkStepId;

      this.baseService.workOrderService.GetWorkStepDetailByWorkStepId(item.WorkStepId,(workStep:WorkStep)=>{      

        this.getWorkStepItem(workStep);
        
      },(error:HttpErrorResponse)=>{
        this.baseService.popupService.ShowErrorPopup(error);
      });
    }
  }

  IsUsedConsumable(item:WorkStep){
   if(item.IsConsumableUsed == true)   
    this.isConsumableUse = true;
   else{
    this.isConsumableUse = false;
    this.errorMessage=false;
    this.consumableCardsWithConsumableObject = [];
   }
  }

  async getWorkStepItem(item:WorkStep){

    this.visibleWorkStepButton=true;

    Object.assign(this.workStep,item);

    this.WorkStepRowId= item.WorkStepRowId;

    this.isConsumableUse=item.IsConsumableUsed;

    if(item.WorkStepId<0)
    this.imageName = item.imageName;
    else
    this.imageName =item.Picture;

    item.WorkStepConsumables.forEach(e=>{

      let properties:string='';      
  
      for (let i = 0; i < e.Consumable.ConsumableCard.FixedAssetPropertyDetails.length; i++) {
          properties+= e.Consumable.ConsumableCard.FixedAssetPropertyDetails[i].Value + ( e.Consumable.ConsumableCard.FixedAssetPropertyDetails.length - i == 1 ? "" : ",");                                  
      }
        
      properties = e.Consumable.ConsumableCard.ConsumableCardName + ": " + properties + "("+ e.Quantity +" "+ e.Consumable.ConsumableCard.ConsumableUnit.ConsumableUnitName +")";
  
      let consumableWithProperty:ConsumableProperties=new ConsumableProperties();

      Object.assign(consumableWithProperty,e);

      consumableWithProperty.properties=properties;

      this.consumableCardsWithConsumableObject.push(consumableWithProperty);
    });
  }
  
  deleteConsumable(data:ConsumableProperties){ 
    this.consumableCardsWithConsumableObject = this.consumableCardsWithConsumableObject.filter(e=>e.ConsumableId != data.ConsumableId);

    if(this.consumableCardsWithConsumableObject.length == 0){
      this.workStep.IsConsumableUsed = false;
    }
  }

  forgetUpdateData(){
    this.workStep = new WorkStep();

    this.consumableCardsWithConsumableObject=[];

    this.WorkStepRowId = this.dataTableWorkStep.TGT_copySource().length + 1;

    this.visibleWorkStepButton=false;

  }

  async addImageFile(imageFile) {

    this.baseService.fileUploadService.ImageUpload(
      imageFile,
      result => {
        this.FixedAssetCardPicture = result;
        this.imageName=imageFile[0].name;      
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  
    var reader = new FileReader();
    reader.readAsDataURL(imageFile[0]);
    reader.onload = _event => (this.imgURL = reader.result.toString());
  }

  clearFiles(){
    this.FixedAssetCardPicture = null;
    this.imageName='';
  }

}
