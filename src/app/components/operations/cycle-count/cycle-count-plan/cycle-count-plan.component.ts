import { Component, OnInit } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { BaseComponent } from "src/app/components/base/base.component";
import { BaseService } from "src/app/services/base.service";
import { CycleCountPlan } from "src/app/models/CycleCountPlan";
import { HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import {
  convertNgbDateToDateString,
  convertDateToNgbDate,
  getToday
} from "../../../../declarations/extends";
import{Location} from "src/app/models/Location";
import { CycleCountResults } from 'src/app/models/CycleCountResults';
import { Page } from 'src/app/extends/TreeGridTable/models/Page';
import { FixedAsset } from 'src/app/models/FixedAsset';
import { CycleCountStatu } from 'src/app/declarations/cycle-count-statu';
import * as $ from "jquery";

@Component({
  selector: "app-cycle-count-plan",
  templateUrl: "./cycle-count-plan.component.html",
  styleUrls: ["./cycle-count-plan.component.css"]
})

export class CycleCountPlanComponent extends BaseComponent implements OnInit {
  cycleCountPlans: CycleCountPlan[] = [];

  cycleCountPlan: CycleCountPlan = new CycleCountPlan();

  isTableExporting: boolean = false;

  isTableRefreshing: boolean = false;

  isWaitingInsertOrUpdate:boolean=false;

  locations:Location[]=[];

  isLocationDropdownOpen: boolean = false;

  cycleCountResult : CycleCountResults[]=[];

  notFoundFixedAsset: CycleCountResults[]=[];

  differentLocationFixedAsset:CycleCountResults[]=[];

  fixedAssets:FixedAsset[]=[];

  locationButton:boolean=false;

  lostFixedAssetButton:boolean=false;

  currentTab:number = 0;

  currentPage: number = 1;
  perInPage: number = 25;
  totalPage: number = 1;
  pages: Page[] = [];

  cycleCountListEnums = {
    CycleCountResult:1,
    NotFoundFixedAsset:2,
    DifferentLocationFixedAsset:3,
    NotRegisteredFixedAsset:4,
  }

  cycleCountOperationEnums = {
    cancelCycleCount:1,
    lostFixedAsset:2,
    updateLocation:3
  }
  
  public dataTable: TreeGridTable = new TreeGridTable(
    "cyclecount",
    [
      {
        columnDisplayName: this.getLanguageValue('Counting_No'),
        columnName: ["CycleCountPlanNo"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName:this.getLanguageValue('Duty_Name'),
        columnName: ["TaskName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Counting_Location'),
        columnName: ["|CycleCountPlanLocations"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.CycleCountPlanLocations.length> 0 ? value.CycleCountPlanLocations[0].Location.Name : '';
          }
          else {
            return '';
          }
        }

      },
      {
        columnDisplayName: this.getLanguageValue('Start_Date'),
        columnName: ["StartTime"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.StartTime
            ? value.StartTime.substring(0, 10)
                .split("-")
                .reverse()
                .join("-")
            : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('End_Date'),
        columnName: ["EndTime"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.EndTime
            ? value.EndTime.substring(0, 10)
                .split("-")
                .reverse()
                .join("-")
            : "";
        }
      },        
      {
        columnDisplayName: this.getLanguageValue('Description'),
        columnName: ["Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('State'),
        columnName: ["CycleCountStatus", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["CycleCountPlanNo"]
    }
  );

  public dataTableCycleCountDetail: TreeGridTable = new TreeGridTable(
    "cyclecountdetail",
    [
      {
        columnDisplayName: this.getLanguageValue('Barcode'),
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Name'),
        columnName: ["Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }, 
      {
        columnDisplayName: this.getLanguageValue('Counting_Date'),
        columnName: ["CountDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.CountDate
            ? value.CountDate.substring(0, 10)
                .split("-")
                .reverse()
                .join("-")
            : "";
        }
      }  
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );

  public dataTableNotFoundFixedAsset: TreeGridTable = new TreeGridTable(
    "notfoundfixedasset",
    [
      {
        columnDisplayName: this.getLanguageValue('Barcode'),
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Name'),
        columnName: ["FixedAssetCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Name'),
        columnName: ["LocationName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Department_Name'),
        columnName: ["DepartmentName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }  
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );

  public dataTableDifferenLocationFixedAsset: TreeGridTable = new TreeGridTable(
    "differentlocation",
    [
      {
        columnDisplayName: this.getLanguageValue('Barcode'),
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }, {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Name'),
        columnName: ["FixedAssetCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },    
      {
        columnDisplayName: this.getLanguageValue('Counted_Location'),
        columnName: ["PlanLocation", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },    
      {
        columnDisplayName: this.getLanguageValue('Location'),
        columnName: ["FixedAssetLocation","Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );

  public dataTableNotRegisteredFixedAsset: TreeGridTable = new TreeGridTable(
    "notregisteredfixedasset",
    [
      {
        columnDisplayName: this.getLanguageValue('Barcode'),
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },  
      {
        columnDisplayName: this.getLanguageValue('Location_Name'),
        columnName: ["Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      } 
    ],
    {
      isDesc: false,
      column: ["Barcode"]
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

  public dataTableCanceledPlan: TreeGridTable = new TreeGridTable(
    "canceledcylecountplan",
    [
      {
        columnDisplayName:  this.getLanguageValue('Counting_No'),
        columnName: ["CycleCountPlanNo"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Duty_Name'),
        columnName: ["TaskName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["CycleCountPlanNo"]
    }
  );
  

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadCycleCountPlanList();

    //#region DataTable Properties
    this.dataTableLocation.isPagingActive = false;
    this.dataTableLocation.isColumnOffsetActive = false;
    this.dataTableLocation.isDeleteable = false;
    this.dataTableLocation.isLoading = false;
    this.dataTableLocation.isScrollActive = false;
    this.dataTableLocation.isSelectAllWithChildrenActive=true;

    this.dataTableDifferenLocationFixedAsset.isPagingActive = false;
    this.dataTableDifferenLocationFixedAsset.isLoading = false;
    this.dataTableNotFoundFixedAsset.isPagingActive = false;
    this.dataTableNotFoundFixedAsset.isLoading = false;
    this.dataTableCycleCountDetail.isPagingActive = false;
    this.dataTableCycleCountDetail.isLoading = false;
    this.dataTableNotRegisteredFixedAsset.isPagingActive=false;
    this.dataTableNotRegisteredFixedAsset.isLoading = false;

    this.dataTableCanceledPlan.isPagingActive = false;
    this.dataTableCanceledPlan.isColumnOffsetActive = false;
    this.dataTableCanceledPlan.isColumnOffsetActive = false;
    this.dataTableCanceledPlan.isDeleteable = false;
    this.dataTableCanceledPlan.isTableEditable = true;
    this.dataTableCanceledPlan.isMultipleSelectedActive = false;
    this.dataTableCanceledPlan.isLoading = false;
    this.dataTableCanceledPlan.isFilterActive=false;
    //#endregion

    $(document).on("click", e => {
      if (
        $(e.target).closest(".custom-dropdown").length == 0 &&
        $(e.target).closest("#btnLocation").length == 0         
      ) {
        this.isLocationDropdownOpen = false; 
      }
    });
  }

  ngOnInit() {}

  async loadLocationList() {
    /* Load locations to location dropdown */
    await this.baseService.locationService.GetLocations(
      locations => {
        this.locations = locations;
        this.dataTableLocation.TGT_loadData(this.locations)
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadCycleCountPlanList() {
    this.baseService.cycleCountService.GetCycleCountPlan(
      (cyclecountplans: CycleCountPlan[]) => {
        this.cycleCountPlans = cyclecountplans;
        this.dataTable.TGT_loadData(this.cycleCountPlans);
      },
      (error: HttpErrorResponse) => {       
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadCycleCountResult(_perInPage: number = 25, _currentPage: number = 1,tabIndex:number){
    this.cycleCountResult = [];
    let cycleCountResult: CycleCountResults = new CycleCountResults();
    let selectedIds = (<CycleCountPlan[]>this.dataTable.TGT_getSelectedItems()).map(x=>x.getId());

    cycleCountResult.CycleCountPlanId = selectedIds[0];
    cycleCountResult.PerPage = _perInPage;
    cycleCountResult.Page = _currentPage;

    if(selectedIds.length > 1){
      this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('You_have_choosen_more_than_one_counting_plan'));
      return;
    }

    switch(tabIndex){
      case this.cycleCountListEnums.CycleCountResult:
      cycleCountResult.NotFoundDuringTheCounting=false;
      cycleCountResult.ShowDifferentLocationsFixedAssets=false;
      cycleCountResult.UnKnownBarcodeList=false;
      break; 
      case this.cycleCountListEnums.DifferentLocationFixedAsset:
      cycleCountResult.NotFoundDuringTheCounting=false;
      cycleCountResult.ShowDifferentLocationsFixedAssets=true;
      cycleCountResult.UnKnownBarcodeList=false;
      break;
      case this.cycleCountListEnums.NotRegisteredFixedAsset:
      cycleCountResult.NotFoundDuringTheCounting=false;
      cycleCountResult.ShowDifferentLocationsFixedAssets=false;
      cycleCountResult.UnKnownBarcodeList=true;
      break;
    }

    this.baseService.cycleCountService.GetCycleCountResult(cycleCountResult,
      (cycleCountResults:CycleCountResults[],totalPage:number)=>{

        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.dataTableCycleCountDetail.perInPage = _perInPage;
        this.cycleCountResult = cycleCountResults;
        this.totalPage = totalPage ? totalPage : 1;

        switch(tabIndex){
          case this.cycleCountListEnums.CycleCountResult:
          this.dataTableCycleCountDetail.TGT_loadData(this.cycleCountResult);
          this.dataTableCycleCountDetail.isLoading=false;
          break;
          case this.cycleCountListEnums.NotFoundFixedAsset:
          this.dataTableNotFoundFixedAsset.TGT_loadData(this.cycleCountResult);
          this.dataTableNotFoundFixedAsset.isLoading=false;
          break;
          case this.cycleCountListEnums.DifferentLocationFixedAsset:
          this.dataTableDifferenLocationFixedAsset.TGT_loadData(this.cycleCountResult);
          this.dataTableDifferenLocationFixedAsset.isLoading=false;
          break;
          case this.cycleCountListEnums.NotRegisteredFixedAsset:
          this.dataTableNotRegisteredFixedAsset.TGT_loadData(this.cycleCountResult);
          this.dataTableNotRegisteredFixedAsset.isLoading=false;
          break;
        }
   
        this.TGT_calculatePages();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });

  }

  async loadCycleCountResultNotFoundFixedAsset(_perInPage: number = 25, _currentPage: number = 1){
    this.cycleCountResult = [];
    let cycleCountResult: CycleCountResults = new CycleCountResults();
    let selectedIds = (<CycleCountPlan[]>this.dataTable.TGT_getSelectedItems()).map(x=>x.getId());
    
    cycleCountResult.CycleCountPlanId = selectedIds[0];
    cycleCountResult.PerPage = _perInPage;
    cycleCountResult.Page = _currentPage;

    if(selectedIds.length > 1){
      this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('You_have_choosen_more_than_one_counting_plan'));
      return;
    }

    cycleCountResult.NotFoundDuringTheCounting=true;
    cycleCountResult.ShowDifferentLocationsFixedAssets=false;

    this.baseService.cycleCountService.GetCycleCountResultNotFoundFixedAsset(cycleCountResult,
      (fixedAssets:FixedAsset[],totalPage:number)=>{
        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.dataTableCycleCountDetail.perInPage = _perInPage;
        this.fixedAssets = fixedAssets;
        this.totalPage = totalPage ? totalPage : 1;

        this.dataTableNotFoundFixedAsset.TGT_loadData(this.fixedAssets); 
        this.TGT_calculatePages();
        this.dataTableNotFoundFixedAsset.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  onSubmit(data: NgForm) {
    if (this.cycleCountPlan.CycleCountPlanId == null) {
      this.addCycleCountPlan(data);
    }
  }

  selectedLocation: Location[];

  addCycleCountPlan(data: NgForm) {
    let willInsertItem = new CycleCountPlan();

    Object.assign(willInsertItem, this.cycleCountPlan);

    this.isWaitingInsertOrUpdate = true;
    this.selectedLocation=<[]>this.dataTableLocation.TGT_getSelectedItems();
    willInsertItem.LocationIds = <[]>this.dataTableLocation.TGT_getSelectedItems().map(x=>x.getId());
    willInsertItem.StartTime=convertNgbDateToDateString(willInsertItem.StartTime);
    willInsertItem.EndTime=convertNgbDateToDateString(willInsertItem.EndTime);

    this.baseService.cycleCountService.InsertCycleCountPlan(
      willInsertItem,
      (insertedItem:CycleCountPlan,message) => {

        this.baseService.popupService.ShowSuccessPopup(message);

        this.isWaitingInsertOrUpdate = false;

        willInsertItem.CycleCountPlanId=insertedItem.CycleCountPlanId;

        this.cycleCountPlans.push(willInsertItem);

        this.dataTable.TGT_loadData(this.cycleCountPlans);

        this.resetForm(data, true);
      },
      (error:HttpErrorResponse) => {
        this.isWaitingInsertOrUpdate = false;

        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  toggleDropdown(key:string) {
    switch (key) {
      case "location":
    this.isLocationDropdownOpen = !this.isLocationDropdownOpen;  
    this.loadLocationList();
    break;
      }
  }  

  selectedCanceledCycleCountPlan(){
    let selectedItems = (<CycleCountPlan[]>this.dataTable.TGT_getSelectedItems());

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz"
      );
      return;
    }
    else{

    this.dataTableCanceledPlan.TGT_loadData(selectedItems);   

    $("#btnCanceledCycleCountPlan").trigger("click");
    }  
  }

  CancelCycleCountPlan(){
    let cycleCountPlan:CycleCountPlan=new CycleCountPlan();

    let selectedIds = (<CycleCountPlan[]>this.dataTable.TGT_getSelectedItems()).map(x=>x.getId());

 
          cycleCountPlan.CycleCountPlanIds=selectedIds;         

          this.baseService.cycleCountService.CancelCyleCountPlan(cycleCountPlan,
            (_cyclecountplan,message) => {   
            
              this.baseService.popupService.ShowSuccessPopup(message);

              this.dataTable.TGT_updateData(cycleCountPlan);

              this.dataTableCanceledPlan.TGT_clearData();

              $('#closePopup').trigger('click');
            },
            (error: HttpErrorResponse) => {
       
              this.isWaitingInsertOrUpdate = false;
              /* Show error message */
              this.baseService.popupService.ShowErrorPopup(error);
            });     
}

  selectedDifferentLocations(){
    let selectedItems = this.dataTableDifferenLocationFixedAsset.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz"
      );
      return;
    }

    $('#btnUpdateLocations').trigger('click');
  }

  UpdateFindDifferentLocationsFixedassets(){
    let cycleCount:CycleCountResults=new CycleCountResults();

     let selectedId= (<CycleCountPlan[]>this.dataTable.TGT_getSelectedItems()).map(x=>x.getId());
     let barcodes = (<CycleCountPlan[]>this.dataTableDifferenLocationFixedAsset.TGT_getSelectedItems()).map(x=>x.Barcode);

     cycleCount.CycleCountPlanId=selectedId[0];
     cycleCount.Barcodes = barcodes;
     this.baseService.cycleCountService.UpdateFindDifferentLocationsFixedassets(cycleCount,
      (message)=>{
        this.baseService.popupService.ShowSuccessPopup(message);

        $('#refreshTable').trigger('click');

        $("#closeDifferentLocationPopup").trigger('click');
      },
      (error:HttpErrorResponse)=>{
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  selectedNotFoundFixedAsset(){
    let selectedItems = this.dataTableNotFoundFixedAsset.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz"
      );
      return;
    }

    $("#btnLostFixedAsset").trigger("click");
    
  }

  UpdateNotFoundFixedAsset(){

    let result:CycleCountResults=new CycleCountResults();

    let selectedItems = (<CycleCountResults[]>this.dataTableNotFoundFixedAsset.TGT_getSelectedItems()).map(x=>x.Barcode);

    let selectedIds = (<CycleCountPlan[]>this.dataTable.TGT_getSelectedItems()).map(x=>x.getId());
    result.Barcodes = selectedItems;
    result.CycleCountPlanId = selectedIds[0];

    this.baseService.cycleCountService.UpdateNotFoundFixedAsset(result,
      (fixedAssetIds:number[],message)=>{

        this.baseService.popupService.ShowSuccessPopup(message);
        
        $('#refreshTable').trigger('click');


        $("#closeLostFixedAssetPopup").trigger('click');

      },
      (error:HttpErrorResponse)=>{
        this.baseService.popupService.ShowErrorPopup(error);

        $("#closeLostFixedAssetPopup").trigger('click');
      });

  }


  resetForm(data: NgForm, isNewItem: boolean) {
    if (isNewItem == true) {
      this.cycleCountPlan = new CycleCountPlan(); 
    }
    data.reset();
    data.resetForm(this.cycleCountPlan);
    this.dataTableLocation.TGT_clearData();
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.currentTab = tabChangeEvent.index; 
    if (tabChangeEvent.index == 0) {      
      this.lostFixedAssetButton=false;
      this.locationButton=false;
      this.loadCycleCountPlanList();
    } 
    else if (tabChangeEvent.index == 1) {
      this.lostFixedAssetButton=false;
      this.locationButton=false;
      this.loadCycleCountResult(this.perInPage,this.currentPage,1);
    }
    else if(tabChangeEvent.index == 2){
      this.lostFixedAssetButton=true;
      this.locationButton=false;
      this.loadCycleCountResultNotFoundFixedAsset(this.perInPage,this.currentPage);
    }
    else if(tabChangeEvent.index == 3){
      this.lostFixedAssetButton=false;
      this.locationButton=true;
      this.loadCycleCountResult(this.perInPage,this.currentPage,3);
    }
    else if(tabChangeEvent.index == 4){
      this.lostFixedAssetButton=false;
      this.locationButton=false;
      this.loadCycleCountResult(this.perInPage,this.currentPage,4);
    }
  }

  async refreshTable() {

    let currentTabIndex:number = this.currentTab;

    this.isTableRefreshing = true;

    

    switch(currentTabIndex){
      case 0:
        this.dataTable.isLoading = true;
        this.dataTable.TGT_clearData();
        this.loadCycleCountPlanList();        
      break;
      case 1:
        this.dataTableCycleCountDetail.isLoading=true;
        this.dataTableCycleCountDetail.TGT_clearData();
        this.loadCycleCountResult(this.perInPage,this.currentPage,1);
      break;
      case 2:
        this.dataTableNotFoundFixedAsset.isLoading=true;
        this.dataTableNotFoundFixedAsset.TGT_clearData();
        this.loadCycleCountResultNotFoundFixedAsset(this.perInPage,this.currentPage);
      break;
      case 3:
        this.dataTableDifferenLocationFixedAsset.isLoading=true;
        this.dataTableDifferenLocationFixedAsset.TGT_clearData();
        this.loadCycleCountResult(this.perInPage,this.currentPage,3);
      break;
      case 4:
        this.dataTableNotRegisteredFixedAsset.isLoading=true;
        this.dataTableNotRegisteredFixedAsset.TGT_clearData();
        this.loadCycleCountResult(this.perInPage,this.currentPage,4);
      break;
    }    

    this.isTableRefreshing = false;
  }

  public doOperation(operationType: number) {
    switch(operationType){
      case this.cycleCountOperationEnums.cancelCycleCount:
      this.selectedCanceledCycleCountPlan();
      break;
      case this.cycleCountOperationEnums.lostFixedAsset:
        this.selectedNotFoundFixedAsset();
      break;
      case this.cycleCountOperationEnums.updateLocation:
      this.selectedDifferentLocations();
      break;
    }
  }

  async  TGT_calculatePages() {

    let items: Page[] = [];
    let totalPage = this.totalPage;

    /* if user in a diffrent page we will render throw the first page */
    if (this.currentPage > totalPage)
      this.currentPage = 1;
    else if (this.currentPage < 1)
      this.currentPage = 1

    /* We will always put first page in to pagination items */
    items.push({
      value: 1,
      display: '1',
      isDisabled: false,
      isActive: this.currentPage == 1 ? true : false
    });

    /* if the total page is 1 return the items no more need calculation */
    if (totalPage <= 1) {
      this.pages = items;
      return;
    }

    /* we will store the last inserted item */
    let lastInsertedItem = this.currentPage - 3;

    /* if current user far enough page we will show ... (you passed many page) */
    if (lastInsertedItem > 2) {
      items.push({
        value: 0,
        display: '...',
        isDisabled: true,
        isActive: false
      });
    }

    /* We loop all pages to add pagination items */
    for (let ii = this.currentPage - 3; ii < totalPage; ii++) {
      lastInsertedItem = ii;

      /* first pages ii may be minus so we should check ii is bigger 1 */
      if (ii > 1) {
        /* Insert pagination item */
        items.push({
          value: ii,
          display: ii.toString(),
          isDisabled: false,
          isActive: this.currentPage == ii ? true : false
        });
      }

      /* maximum item we will show is 7 */
      if (items.length > 7) {
        ii = totalPage;
        break;
      }
    }

    /* After calculation if we still far from totalpage we insert ... page item */
    if (lastInsertedItem < totalPage - 1 && lastInsertedItem > 0) {
      items.push({
        value: 0,
        display: '...',
        isDisabled: true,
        isActive: false
      });
    }

    /* We always push the last page to the pagination items */
    if (!items.find(x => x.value == totalPage)) {
      items.push({
        value: totalPage,
        display: totalPage.toString(),
        isDisabled: false,
        isActive: this.currentPage == totalPage ? true : false
      });
    }

    /* We set pages to new pagination items. */
    this.pages = items;

  }
}
