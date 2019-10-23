import { Component, OnInit } from '@angular/core';
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { ConsumableCard } from 'src/app/models/ConsumableCard';
import { HttpErrorResponse } from '@angular/common/http';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { FixedAssetCardProperty } from 'src/app/models/FixedAssetCardProperty';
import { WorkOrders } from 'src/app/models/WorkOrders';
import { Consumable } from 'src/app/models/Consumable';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { FixedAssetCard } from 'src/app/models/FixedAssetCard';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-periodic-maintenance',
  templateUrl: './periodic-maintenance.component.html',
  styleUrls: ['./periodic-maintenance.component.css']
})
export class PeriodicMaintenanceComponent extends BaseComponent implements OnInit, Resolve<FixedAssetCard> {

  consumableCards:ConsumableCard[]=[];

  faProperties:FixedAssetCardProperty[]=[];
  
  workOrders:WorkOrders[]=[];

  consumables:Consumable[]=[];

  workOrder: WorkOrders = new WorkOrders();

  consumable: Consumable = new Consumable();

  workOrderCode:string;

  fixedAssetCardId:number;

  fixedAssetCard:FixedAssetCard=new FixedAssetCard();

   /* Is Waititing for a request */
   isWaitingInsertOrUpdate: boolean = false;

   isConsumableUse:boolean=false;

   categoryName:string;

   ngAfterViewInit(): void {
    this.baseService.activeRoute.queryParams.subscribe(params => {
      this.fixedAssetCardId = params.insertedFixedAssetCardId
      this.loadFixedAssetCard(this.fixedAssetCardId);
    });
   }

  public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
    "consumablepropertyvalue",
    [      
    {
      columnDisplayName: '',
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
      columnName: [],
      isActive: true,
      classes: [],
      placeholder: "",
      type: "text"
    },
    {
      columnDisplayName: 'İş Adımı Açıklaması',
      columnName: [],
      isActive: true,
      classes: [],
      placeholder: "",
      type: "text"
    }
    ],
    {
      isDesc: false,   
      column: []   
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadConsumableCardDropdown();
    this.loadFixedAssetProperties();

    this.loadWorkOrderCode();

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
  }

  async loadConsumableCardDropdown(){
    await this.baseService.consumableCardService.GetConsumableCards(
      (consumableCards: ConsumableCard[]) => {
        this.consumableCards = consumableCards;
    
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

    let consumableCardId:number=Number(event.target.value);    
    this.baseService.workOrderService.GetConsumablesByConsumableCardId(consumableCardId,
    (consumables:Consumable[])=>{
      this.consumables = consumables;
      this.dataTablePropertyValue.TGT_loadData(this.consumables);
    },(error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  isConsumableUsed(event:any){
    if(event.target.checked == true)
    this.isConsumableUse = true;     
    else
    this.isConsumableUse = false;
  }
}
