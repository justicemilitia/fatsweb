import { Component, OnInit, NgModule } from "@angular/core";
import { NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Consumable } from "src/app/models/Consumable";
import { FixedAssetPropertyDetails } from "src/app/models/FixedAssetPropertyDetails";
import { FixedAssetCardPropertyValue } from "src/app/models/FixedAssetCardPropertyValue";
import { FixedAssetCardProperty } from "src/app/models/FixedAssetCardProperty";
import { PropertyValueTypes } from "src/app/declarations/property-value-types.enum";
import { ConsumableCategory } from "src/app/models/ConsumableCategory";
import { FixedAssetCardBrand } from "src/app/models/FixedAssetCardBrand";
import { FixedAssetCardModel } from "src/app/models/FixedAssetCardModel";
import { ConsumableCard } from "src/app/models/ConsumableCard";
import { Location } from "src/app/models/Location";
import { Company } from "src/app/models/Company";
import { ConsumableUnit } from 'src/app/models/ConsumableUnit';
import * as $ from "jquery";
import { Department } from 'src/app/models/Department';
import { User } from 'src/app/models/User';

@Component({
  selector: "app-consumable-list",
  templateUrl: "./consumable-list.component.html",
  styleUrls: ["./consumable-list.component.css"]
})
export class ConsumableListComponent extends BaseComponent implements OnInit {
  isTableRefreshing: boolean = false;

  isTableExporting: boolean = false;

  isListSelected: boolean = false;

  isLocationDropdownOpen: boolean = false;

  isDepartmentDropdownOpen:boolean = false;

  isWaitingInsertOrUpdate: boolean = false;

  isSelectedProperty: boolean = false;

  visible: boolean = false;

  visiblePropertyName:boolean = false;

  propertyValue: string;

  consumable: Consumable = new Consumable();

  exitconsumable:Consumable = new Consumable();

  consumableCard: ConsumableCard=new ConsumableCard();

  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();

  fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();

  faProperties: FixedAssetCardProperty[] = [];

  locations: Location[] = [];

  companies: Company[] = [];

  departments: Department[] = [];

  consumables: Consumable[] = [];

  fixedassetproperty: FixedAssetCardProperty[] = [];

  faPropertyDetails: FixedAssetPropertyDetails[] = [];

  consumableCategories: ConsumableCategory[] = [];

  consumableCards: ConsumableCard[] = [];

  brands: FixedAssetCardBrand[] = [];

  models: FixedAssetCardModel[] = [];

  users: User[]=[];

  fixedassetpropertyvalues: FixedAssetCardPropertyValue[] = [];

  consumableOperationEnums = {
    exitConsumableMaterial:1
  }

  /* Data Table */
  public dataTable: TreeGridTable = new TreeGridTable(
    "consumablematerial",
    [
      {
        columnDisplayName: "Malzeme Kodu",
        columnName: ["ConsumableCard","ConsumableCardCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Kategori Adı",
        columnName: ["ConsumableCard","ConsumableCategory","ConsumableCategoryName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Adı",
        columnName: ["ConsumableCard","ConsumableCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon",
        columnName: ["ConsumableLocation", "Name"],
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
      }
    ],
    {
      isDesc: false,
      column: ["ConsumableCard","ConsumableCardName"]
    }
  );

  public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
    "fixedassetpropertyvalue",
    [
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
  );

  public dataTableLocation: TreeGridTable = new TreeGridTable(
    "location",
    [
      {
        columnDisplayName: "Lokasyon",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  public dataTableDepartment: TreeGridTable = new TreeGridTable(
    "department",
    [
      {
        columnDisplayName: "Departman",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetProperties();
    this.loadDropdown();
    this.loadConsumableList();

    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isFilterActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isScrollActive = false;
    this.dataTablePropertyValue.isDeleteable=true;

    this.dataTableLocation.isPagingActive = false;
    this.dataTableLocation.isColumnOffsetActive = false;
    this.dataTableLocation.isDeleteable = false;
    this.dataTableLocation.isMultipleSelectedActive = false;
    this.dataTableLocation.isLoading = false;
    this.dataTableLocation.isHeaderVisible = false;
    this.dataTableLocation.isScrollActive = false;

    this.dataTableDepartment.isPagingActive = false;
    this.dataTableDepartment.isColumnOffsetActive = false;
    this.dataTableDepartment.isDeleteable = false;
    this.dataTableDepartment.isMultipleSelectedActive = false;
    this.dataTableDepartment.isLoading = false;
    this.dataTableDepartment.isHeaderVisible = false;
    this.dataTableDepartment.isScrollActive = false;

    $(document).on("click", e => {
      if (
        $(e.target).closest(".custom-dropdown").length == 0 &&
        $(e.target).closest("#btnLocation").length == 0 && $(e.target).closest("#btnDepartment").length == 0
      ) {
        this.isLocationDropdownOpen = false;
        this.isDepartmentDropdownOpen = false;
      }
    });
  }

  ngOnInit() {}

  onSubmit(data: NgForm) {
    /* Check model state is valid */
    if (data.form.invalid == true) return;

    this.addConsumableMaterial(data);
  }

  selectedLocation: Location;
  onClickLocation(item) {
    this.selectedLocation = item;
  }

  selectedDepartment: Department;
  onClickDepartment(item) {
    this.selectedDepartment = item;
  }

  async loadDropdown() {
    this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
      (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
        this.fixedassetproperty = fixedAssetCardProperties;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.companyService.GetCompanies(
      (companies: Company[]) => {
        this.companies = companies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.consumableCategoryService.GetConsumableCategories(
      (categories: ConsumableCategory[]) => {
        this.consumableCategories = categories;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.locationService.GetLocations(
      (locations: Location[]) => {
        this.locations = locations;
        this.dataTableLocation.TGT_loadData(this.locations);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    if (this.brands && this.brands.length == 0) {
      this.models = [];

      this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
        (brands: FixedAssetCardBrand[]) => {
          this.brands = brands;
        },
        (error: HttpErrorResponse) => {}
      );
    }

    this.baseService.departmentService.GetDepartments(
      (departments:Department[]) => {
      this.departments = departments;
      this.dataTableDepartment.TGT_loadData(this.departments);
      },
      (error: HttpErrorResponse)=>{

      });
    

  }

  async loadUserByDepartmentId(selectedId:number){
    this.users=[];

    if (!selectedId || selectedId == 0) {
      this.consumable.ReceivedUserId = null;

      return;
    }

    if (selectedId) {
      this.baseService.userService.GetUserByDepartmentId(
        selectedId,
        (users: User[]) => {
          this.users = users;
        },
        (error: HttpErrorResponse) => { }
      );
    }
  }

  async loadConsumableCardByCategoryId(event: any) {
    this.consumableCards = [];
    this.consumableCard.ConsumableUnit = null;    

    if (!event.target.value || event.target.value == "") {
      this.consumable.ConsumableCardId = null;
      this.consumable.ConsumableCard = new ConsumableCard();
      return;
    }
    if (event.target.value) {
      this.baseService.consumableCardService.GetConsumableCardsByCategoryId(
        <number>event.target.value,
        (consumableCards: ConsumableCard[]) => {
          this.consumableCards = consumableCards;
        },
        (error: HttpErrorResponse) => {
         
        }
      );
    }
  }

  async loadConsumableUnitByCardId(event:any){

    if (!event.target.value || event.target.value == "") {
      this.consumable.ConsumableUnits.ConsumableUnitId = null;
      this.consumable.ConsumableUnits = new ConsumableUnit();
      return;
    }
    this.baseService.consumableService.GetConsumableCardUnitByCardId(<number>event.target.value,
      (consumablecard:ConsumableCard) => {
        this.consumableCard = consumablecard; 
      },
      (error:HttpErrorResponse)=>{
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  async loadModelByBrandId(event: any) {
    this.models = [];

    if (!event.target.value || event.target.value == "") {
      this.consumable.ConsumableModelId = null;
      this.consumable.FixedAssetCardModel = new FixedAssetCardModel();
      return;
    }

    if (event.target.value) {
      this.baseService.fixedAssetCardModelService.GetFixedAssetsCardModelsByBrandId(
        <number>event.target.value,
        (models: FixedAssetCardModel[]) => {
          this.models = models;
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
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

  async loadConsumableList() {
    /* Load all consumables to datatable */
    this.baseService.consumableService.GetConsumableList(
      (consumables: Consumable[]) => {
        this.consumables = consumables;
        this.dataTable.TGT_loadData(this.consumables);
        consumables.forEach(e=>{
          e.FixedAssetPropertyDetails.forEach(p=>{
            if(p.FixedAssetCardPropertyId){
              e["PROP_" + p.FixedAssetCardPropertyId.toString()] = p.Value;
            }
          });
        });  
        if (this.consumables.length == 0) {
          this.baseService.popupService.ShowWarningPopup("Record_not_found");
        }
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  selectedConsumableMaterial(){

    let selectedItems = <Consumable[]>this.dataTable.TGT_getSelectedItems()

      if(!selectedItems || selectedItems.length == 0){
        this.baseService.popupService.ShowAlertPopup(
          "Lütfen en az bir sarf malzeme seçiniz!"
        );
        return;
      }

      if (selectedItems.length > 1) {
        this.baseService.popupService.ShowAlertPopup(
          "Birden fazla sarf malzeme seçtiniz!"
        );

        return;
      }

      if(selectedItems[0].ConsumableParentId == null){
        this.baseService.popupService.ShowAlertPopup("Lütfen malzeme kartının altında bulunan bir sarf malzeme seçiniz!");
        return;
      }


      let selectedId:number = selectedItems[0].ConsumableId;

      this.getConsumableMaterialById(selectedId);
  }

  getConsumableMaterialById(consumableId:number){

    $("#btnExitConsumable").trigger("click");

    this.baseService.consumableService.GetConsumableMaterialById(consumableId,
      (consumable:Consumable[])=>{

        Object.assign(this.consumable, consumable[0]);

        let property:FixedAssetPropertyDetails[] =  consumable[0].FixedAssetPropertyDetails;

      },
      (error:HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
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
    this.faPropertyDetails = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

      if(this.fixedAssetPropertyDetail.FixedAssetCardPropertyId != null){

        this.visiblePropertyName=false;

        if(this.fixedAssetPropertyDetail.Value != null || this.fixedAssetCardPropertyValue.FixedAssetPropertyValueId !=null){
        
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
            this.fixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
            propertyId = null;
            this.visible = false;
            this.isSelectedProperty = false;

        }else{
          this.visiblePropertyName=true;    
        } 
      }else{
          this.visible=true;
          this.visiblePropertyName=true;    
      }
  }

  addConsumableMaterial(data: NgForm) {
    /* Check model state is valid */
    if (data.form.invalid == true) return;

    let insertedItem: Consumable = new Consumable();
    let propertyDetail = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );
    insertedItem.ConsumableLocationId=this.selectedLocation.LocationId;

    Object.assign(insertedItem, this.consumable);
    insertedItem.FixedAssetPropertyDetails = propertyDetail;

    this.baseService.consumableService.InsertConsumableMaterial(
      insertedItem,
      (consumableItem:Consumable,message) => {
        this.isWaitingInsertOrUpdate = false;

        this.baseService.popupService.ShowSuccessPopup(message);

        insertedItem.ConsumableId = consumableItem.ConsumableId;

        $('refreshTable').trigger('click');
      
        //Apiyi düzelttir! Yanlış nesne dönüyor.

        // this.consumables.push(insertedItem);

        // this.dataTable.TGT_loadData(this.consumables);

        this.resetForm(data, true);
      },
      (error:HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  exitConsumableMaterial(data:NgForm){
    /* Check model state is valid */
    if (data.form.invalid == true) return;

    let exitItem: Consumable = new Consumable();

    let propertyDetail = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

    this.exitconsumable.ConsumableId = this.consumable.ConsumableId;

    Object.assign(exitItem, this.consumable);
    exitItem.FixedAssetPropertyDetails = propertyDetail;

    this.baseService.consumableService.ExitConsumableMaterial(
      exitItem,
      (consumableItem:Consumable,message) => {
        this.isWaitingInsertOrUpdate = false;

        this.baseService.popupService.ShowSuccessPopup(message);

        exitItem.ConsumableId = consumableItem.ConsumableId;

        $('refreshTable').trigger('click');

        this.resetForm(data, true);
      },
      (error:HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  toggleDropdown(key: string) {
    switch (key) {
      case "location":
        this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
        break;
        case "department":
        this.isDepartmentDropdownOpen=!this.isDepartmentDropdownOpen; 
        this.loadUserByDepartmentId(this.selectedDepartment.DepartmentId);
    
        break;
    }
  }

  public doOperation(operationType: number) {
    switch(operationType){
      case this.consumableOperationEnums.exitConsumableMaterial:
      this.selectedConsumableMaterial();
      break;
    }
  }

  resetForm(data: NgForm, isNewItem: boolean) {
    if (isNewItem == true) {
      this.consumable = new Consumable();   
    }
    data.reset();
    data.resetForm(this.consumable);
  }

  
  resetDropdown(key:string){
    switch(key){
      case "location":
      this.selectedLocation = null;
      break;
      case "department":
      this.selectedDepartment = null;      
      break;
    }
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadConsumableList();

    this.isTableRefreshing = false;
  }

}
