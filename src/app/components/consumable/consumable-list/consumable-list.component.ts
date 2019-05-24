import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseComponent } from '../../base/base.component';
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';
import { BaseService } from '../../../services/base.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Consumable } from 'src/app/models/Consumable';
import { FixedAssetPropertyDetails } from 'src/app/models/FixedAssetPropertyDetails';
import { FixedAssetCardPropertyValue } from 'src/app/models/FixedAssetCardPropertyValue';
import { FixedAssetCardProperty } from 'src/app/models/FixedAssetCardProperty';
import { PropertyValueTypes } from 'src/app/declarations/property-value-types.enum';
import { ConsumableCategory } from 'src/app/models/ConsumableCategory';
import { FixedAssetCardBrand } from 'src/app/models/FixedAssetCardBrand';
import { FixedAssetCardModel } from 'src/app/models/FixedAssetCardModel';
import { ConsumableCard } from 'src/app/models/ConsumableCard';

@Component({
  selector: 'app-consumable-list',
  templateUrl: './consumable-list.component.html',
  styleUrls: ['./consumable-list.component.css']
})
export class ConsumableListComponent extends BaseComponent implements OnInit {

  isTableRefreshing:boolean = false;

  isTableExporting:boolean = false;

  isListSelected:boolean=false;

  isWaitingInsertOrUpdate:boolean=false;

  isSelectedProperty:boolean=false;

  visible:boolean=false;

  propertyValue: string;

  consumable:Consumable = new Consumable();

  fixedAssetPropertyDetail:FixedAssetPropertyDetails=new FixedAssetPropertyDetails();

  fixedAssetCardPropertyValue:FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();

  faProperties: FixedAssetCardProperty[] = [];

  fixedassetproperty: FixedAssetCardProperty[] = [];

  faPropertyDetails: FixedAssetPropertyDetails[] = [];

  consumableCategories:ConsumableCategory[]=[];

  consumableCards:ConsumableCard[]=[];
  
  brands: FixedAssetCardBrand[] = [];
  
  models: FixedAssetCardModel[] = [];

  fixedassetpropertyvalues: FixedAssetCardPropertyValue[] = [];
  
  constructor(public baseService: BaseService) { 
    
    super(baseService);
    this.loadFixedAssetProperties();
    this.loadDropdown();

    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isFilterActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isScrollActive = false;
  }

    /* Data Table */
    public dataTable: TreeGridTable = new TreeGridTable(
      "consumablematerial",
      [
        {
          columnDisplayName: "Malzeme Kodu",
          columnName: ["ConsumableCategoryName"],
          isActive: true,
          classes: [],
          placeholder: "",
          type: "text"
        },
        {
          columnDisplayName: "Kategori Adı",
          columnName: ["ConsumableCategoryName"],
          isActive: true,
          classes: [],
          placeholder: "",
          type: "text"
        },
        {
          columnDisplayName: "Kategori Kodu",
          columnName: ["ConsumableCategoryCode"],
          isActive: true,
          classes: [],
          placeholder: "",
          type: "text"
        },
        {
          columnDisplayName: "Lokasyon",
          columnName: ["Location","Name"],
          isActive: true,
          classes: [],
          placeholder: "",
          type: "text"
        },
        {
          columnDisplayName: "Toplam Miktar",
          columnName: ["ConsumableAmount"],
          isActive: true,
          classes: [],
          placeholder: "",
          type: "text"
        },
        
      ],
      {
        isDesc: false,
        column: ["ConsumableCategoryName"]
      }
    );

    public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
      "fixedassetpropertyvalue", [
        {
          columnDisplayName: "Özellik Adı",
          columnName: ["FixedAssetCardProperty", "Name"],
          isActive: true,
          classes: [],
          placeholder: "",
          type: "text"
        },
        {
          columnDisplayName: "Özellik Değeri",
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

  ngOnInit() {
  }

  loadDropdown(){
    this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
      (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
        this.fixedassetproperty = fixedAssetCardProperties;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.consumableCategoryService.GetConsumableCategories(
    (categories:ConsumableCategory[])=>{
      this.consumableCategories = categories;
    },
    (error:HttpErrorResponse)=>{
      this.baseService.popupService.ShowErrorPopup(error);
    });

    if (this.brands && this.brands.length == 0) {
      this.models = [];

      this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
        (brands: FixedAssetCardBrand[]) => {
          this.brands = brands;
        },
        (error: HttpErrorResponse) => {}
      );
    }
  }

  loadConsumableCardByCategoryId(event:any){
    this.consumableCards = [];

    if (!event.target.value || event.target.value == "") {
      this.consumable.ConsumableCardId = null;
      this.consumable.ConsumableCard = new ConsumableCard();
      return;
    }
    if (event.target.value) {

    this.baseService.consumableCardService.GetConsumableCardsByCategoryId(<number>event.target.value,
      (consumableCards:ConsumableCard[]) => {
        this.consumableCards = consumableCards;
      },
      (error:HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
    }
  }

  async loadFixedAssetProperties() {
    this.baseService.fixedAssetService.GetFixedAssetProperties(
      (faProperties: FixedAssetCardProperty[]) => {
        this.faProperties = faProperties;
        this.faProperties.forEach(e => {
          this.dataTable.dataColumns.push({
            columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
            columnDisplayName: e.Name,
            isActive: true,
            type: "text"
          });
        });
        this.dataTable.TGT_bindActiveColumns();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
  
  getPropertyValue(event: any) {
    this.propertyValue = event.target.value;
    this.visible = false;
  }

  async loadValuesByPropertyId(event) {
    this.isSelectedProperty = true;
    this.visible = false;
    let fixedAssetProperty = this.fixedassetproperty.find(
      x => x.FixedAssetCardPropertyId == Number(event.target.value)
    );

    if (fixedAssetProperty.FixedAssetTypeId == PropertyValueTypes.Liste) {
      this.isListSelected = true;
      this.baseService.fixedAssetCardPropertyService.GetFixedAssetPropertyValueByPropertyId(
        <number>event.target.value,
        (propertyValues: FixedAssetCardPropertyValue[]) => {
          this.fixedassetpropertyvalues = propertyValues;
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    } else {
      this.isListSelected = false;
    }
  }

  insertPropertyValueToArray(propertyId: any) {
    this.faPropertyDetails = <FixedAssetPropertyDetails[]>(this.dataTablePropertyValue.TGT_copySource());

    //let propId = Number(propertyId.value);
    //this.isUniqueFixedAssetProperty(propId);

    //if(this.isUniqueProperty != true){

      if (this.isSelectedProperty == true) {
        let fixedasset = this.fixedassetproperty.find(
          x => x.FixedAssetCardPropertyId == Number(propertyId.value)
        );

        this.fixedAssetPropertyDetail.FixedAssetPropertyDetailId =
          (this.faPropertyDetails.length + 1) * -1;

        this.fixedAssetPropertyDetail.FixedAssetCardProperty = fixedasset;

        if (this.isListSelected == true)
          this.fixedAssetPropertyDetail.Value = this.propertyValue;
        this.faPropertyDetails.push(this.fixedAssetPropertyDetail);

        this.dataTablePropertyValue.TGT_loadData(this.faPropertyDetails);

        this.fixedAssetPropertyDetail = new FixedAssetPropertyDetails();
        this.fixedAssetCardPropertyValue=new FixedAssetCardPropertyValue();
        propertyId = null;
        this.visible = false;
        this.isSelectedProperty = false;
      } else {
        this.visible = true;
      }
    //}
  }

}
