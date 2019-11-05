import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-periodic-maintenance',
  templateUrl: './periodic-maintenance.component.html',
  styleUrls: ['./periodic-maintenance.component.css']
})
export class PeriodicMaintenanceComponent extends BaseComponent implements OnInit, Resolve<FixedAssetCard> {

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

  periods:WorkOrderPeriodTypes[]=[];

   /* Is Waititing for a request */
   isWaitingInsertOrUpdate: boolean = false;

   isConsumableUse:boolean=false;

   categoryName:string;

   isUpdateOrInsertMaintenance:boolean=false;

   consumableCardId:number;

   insertedPeriodTypeId:number = null;

   requiredConsumable:boolean=false;

   insertConsumableProperties:boolean=false;

   insertWorkStep:boolean=false;

   periodTypeEnum =
   {
       Day:1,
       Week:2,
       Month:3
   }
 
   day:number = 30;
   week:number = 52;
   month:number = 12;
 
   periodArray:number[]=[];

   insertedPeriodTypeValue:number = null;


   ngAfterViewInit(): void {
    this.baseService.activeRoute.queryParams.subscribe(params => {
      this.fixedAssetCardId = params.insertedFixedAssetCardId == null ? params.updatedFixedAssetCardId : params.insertedFixedAssetCardId,
      this.WorkOrderId = params.updatedWorkOrderId          

     this.loadFixedAssetCard(this.fixedAssetCardId);

    //this.loadFixedAssetCardWithWorkOrder(this.WorkOrderId);

    });
   }

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
      isDesc: false,   
      column: ["Description"]   
    }
  );

  constructor(public baseService: BaseService) {

    super(baseService);

    this.loadConsumableCardDropdown();

    this.loadFixedAssetProperties();

    this.loadWorkOrderCode();

    this.GetWorkOrderPeriodTypes();

    if(this.workOrders.length == 0)
    this.isUpdateOrInsertMaintenance = true;
    else
    this.isUpdateOrInsertMaintenance = false;


    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isTableEditable = false;
    this.dataTablePropertyValue.isMultipleSelectedActive = true;
    this.dataTablePropertyValue.isFilterActive = true;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isScrollActive = true;
    this.dataTablePropertyValue.isDeleteable=false;

    this.dataTableWorkStep.isColumnOffsetActive = false;
    this.dataTableWorkStep.isPagingActive = false;   
    this.dataTableWorkStep.isLoading = false;
    this.dataTableWorkStep.isScrollActive = true;
    this.dataTablePropertyValue.isFilterActive = false;

   }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):FixedAssetCard {

    return undefined; 
  }

  ngOnInit() {
  }

  async loadFixedAssetCard(fixedAssetCardId:number){
    if(this.WorkOrderId == null){
    this.baseService.fixedAssetCardService.GetFixedAssetCardById(
      fixedAssetCardId ,
      (result: FixedAssetCard) => {
        /* then bind it to fixed asset card category model to update */
        setTimeout(() => {

          /* bind result to model */
          Object.assign(this.fixedAssetCard, result);
          
          this.categoryName = result.FixedAssetCardCategory.Name;      

        }, 1000);
      },
      (error: HttpErrorResponse) => {
        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);

      }
    );
  }else{
    this.loadFixedAssetCardWithWorkOrder(this.WorkOrderId);
  }
  }

  async loadFixedAssetCardWithWorkOrder(workOrderId:number){
    let workOrdersId:WorkOrders=new WorkOrders();
    workOrdersId.WorkOrderId = workOrderId;
    this.baseService.workOrderService.GetWorkStepListByWorkOrderId(workOrdersId,
    (workOrder:WorkOrders)=>{

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
        //this.categoryName = fixedAssetCard.FixedAssetCardCategory.Name;
      }

      this.dataTableWorkStep.TGT_loadData(workSteps);

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

      this.
      consumables.forEach(e=>{
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

  isConsumableUsed(event:any){
    if(event.target.checked == true)
    this.isConsumableUse = true;     
    else{
    this.isConsumableUse = false;
    this.requiredConsumable = false;
    }
    
  }

  insertConsumableCardWithProperties(){

    this.insertConsumableProperties=true;

    let consumableWithProperties:ConsumableProperties[] = <ConsumableProperties[]>this.dataTablePropertyValue.TGT_getSelectedItems();

    if(consumableWithProperties.length == 0){
      this.requiredConsumable = true;
      return;
    }else{    
      this.requiredConsumable = false;
      if(this.workStep.Quantity != null || this.workStep.Quantity != undefined)
      this.insertConsumableProperties = true;
      else
      return;
    }

    if(this.workStep.Quantity != null || this.workStep.Quantity != undefined){

    }


    let consumableWithProperty:ConsumableProperties=new ConsumableProperties();

    let properties:string='';

    Object.assign(consumableWithProperty,consumableWithProperties[0]);  
    
    consumableWithProperty.Quantity=this.workStep.Quantity;

   // this.workStep.ConsumableProperties.push(consumableWithProperty);

    for (let i = 0; i < consumableWithProperty.FixedAssetPropertyDetails.length; i++) {
        properties+= consumableWithProperty.FixedAssetPropertyDetails[i].Value + ( consumableWithProperty.FixedAssetPropertyDetails.length - i == 1 ? "" : ",");                                  
    }

    properties = consumableWithProperty.ConsumableCard.ConsumableCardName + ": " + properties + "("+this.workStep.Quantity +" "+this.consumableCardUnit+")"

    this.consumableCardsWithConsumableObject.push(consumableWithProperty);
    
    this.consumableCardsWithQuantity.push(properties);
  }

  insertWorkStepToDataTableWorkStep(data:NgForm){

    let stepRow:number = this.dataTableWorkStep.TGT_copySource().length + 1;
    this.insertWorkStep = true;

    if(data.value.Description != undefined)
    this.workStep.Description = data.value.Description; 
    else
    return;

    this.workStep.WorkStepRowId=stepRow;

    this.WorkStepRowId = stepRow;

    this.workStep.WorkStepId = this.WorkStepRowId;

    let workStepConsumables:WorkStepConsumables[]=[];

    this.consumableCardsWithConsumableObject.forEach(x=>{
      
      let workStepConsumable:WorkStepConsumables=new WorkStepConsumables();

      workStepConsumable.Quantity = x.Quantity;
      workStepConsumable.ConsumableId=x.ConsumableId;   

      workStepConsumables.push(workStepConsumable);
    });

    this.workStep.WorkStepConsumables=workStepConsumables;

    this.workSteps.push(this.workStep);

    this.dataTableWorkStep.TGT_loadData(this.workSteps);
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

    loadPeriodNumberByPeriodType(key:number):number[]{
    let periods:number[]=[];

    for (let i = 1; i <= key; i++) {
      periods.push(i);                          
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

  addWorkOrder(){
    
   let workSteps:WorkStep[]= <WorkStep[]>this.dataTableWorkStep.TGT_copySource();

   this.workOrder.WorkSteps=workSteps;
   this.workOrder.FixedAssetCardId = this.fixedAssetCardId;
   this.workOrder.WorkOrderCode = Number(this.workOrderCode);   

    this.baseService.workOrderService.AddWorkOrder(this.workOrder,(message)=>{
      this.baseService.popupService.ShowSuccessPopup(message);
    },(error:HttpErrorResponse)=>{
     /* show error message */
     this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  async onDoubleClickItem(item: WorkStep) {
    this.baseService.workOrderService.GetWorkStepDetailByWorkStepId(item.WorkStepId,(workStep:WorkStep)=>{
      console.log(workStep);
    },(error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }

}
