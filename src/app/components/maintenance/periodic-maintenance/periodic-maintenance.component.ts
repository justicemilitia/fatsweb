import { Component, OnInit } from '@angular/core';
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { ConsumableCard } from 'src/app/models/ConsumableCard';
import { HttpErrorResponse } from '@angular/common/http';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { FixedAssetCardProperty } from 'src/app/models/FixedAssetCardProperty';
@Component({
  selector: 'app-periodic-maintenance',
  templateUrl: './periodic-maintenance.component.html',
  styleUrls: ['./periodic-maintenance.component.css']
})
export class PeriodicMaintenanceComponent extends BaseComponent implements OnInit {

  consumableCards:ConsumableCard[]=[];

  faProperties:FixedAssetCardProperty[]=[];

  public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
    "consumablepropertyvalue",
    [      
    {
      columnDisplayName: '',
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

  ngOnInit() {
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
}
