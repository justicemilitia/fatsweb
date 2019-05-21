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

@Component({
  selector: "app-cycle-count-plan",
  templateUrl: "./cycle-count-plan.component.html",
  styleUrls: ["./cycle-count-plan.component.css"]
})

export class CycleCountPlanComponent extends BaseComponent implements OnInit {
  cycleCountPlans: CycleCountPlan[] = [];

  cycleCountPlan: CycleCountPlan = new CycleCountPlan();

  isTableExporting: boolean = false;

  isWaitingInsertOrUpdate:boolean=false;

  locations:Location[]=[];

  isLocationDropdownOpen: boolean = false;

  cycleCountResult : CycleCountResults[]=[];

  notFoundFixedAsset: CycleCountResults[]=[];

  differentLocationFixedAsset:CycleCountResults[]=[];

  fixedAssets:FixedAsset[]=[];

  locationButton:boolean=false;

  lostFixedAssetButton:boolean=false;

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
        columnDisplayName: "Sayım No",
        columnName: ["CycleCountPlanNo"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Görev Adı",
        columnName: ["TaskName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon",
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
        columnDisplayName: "Başlama Tarihi",
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
        columnDisplayName: "Bitiş Tarihi",
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
        columnDisplayName: "Açıklama",
        columnName: ["Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Durum",
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
        columnDisplayName: "Barkod",
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Adı",
        columnName: ["Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }, 
      {
        columnDisplayName: "Sayım Tarihi",
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
        columnDisplayName: "Barkod",
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Adı",
        columnName: ["FixedAssetCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Adı",
        columnName: ["LocationName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Departman Adı",
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
    "differenlocation",
    [
      {
        columnDisplayName: "Barkod",
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }, {
        columnDisplayName: "Demirbaş Adı",
        columnName: ["FixedAssetCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },    
      {
        columnDisplayName: "Lokasyon Adı",
        columnName: ["Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },    
      {
        columnDisplayName: "Planlanan Lokasyon Adı",
        columnName: ["PlanLocation"],
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
        columnDisplayName: "Barkod",
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },  
      {
        columnDisplayName: "Lokasyon Adı",
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
        columnDisplayName: "Sayım No",
        columnName: ["CycleCountPlanNo"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Görev Adı",
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

    this.dataTableLocation.isPagingActive = false;
    this.dataTableLocation.isColumnOffsetActive = false;
    this.dataTableLocation.isDeleteable = false;
    this.dataTableLocation.isLoading = false;
    this.dataTableLocation.isScrollActive = false;
    this.dataTableLocation.isSelectAllWithChildrenActive=true;

    this.dataTableDifferenLocationFixedAsset.isPagingActive = false;
    this.dataTableNotFoundFixedAsset.isPagingActive = false;
    this.dataTableCycleCountDetail.isPagingActive = false;
    this.dataTableNotRegisteredFixedAsset.isPagingActive=false;

    this.dataTableCanceledPlan.isPagingActive = false;
    this.dataTableCanceledPlan.isColumnOffsetActive = false;
    this.dataTableCanceledPlan.isColumnOffsetActive = false;
    this.dataTableCanceledPlan.isDeleteable = false;
    this.dataTableCanceledPlan.isTableEditable = true;
    this.dataTableCanceledPlan.isMultipleSelectedActive = false;
    this.dataTableCanceledPlan.isLoading = false;
    this.dataTableCanceledPlan.isFilterActive=false;

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
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadCycleCountResult(_perInPage: number = 25, _currentPage: number = 1,tabIndex:number){
    this.cycleCountResult = [];
    let cycleCountResult: CycleCountResults = new CycleCountResults();
    let selectedIds = (<CycleCountPlan[]>this.dataTable.TGT_getSelectedItems()).map(x=>x.getId());
   
    cycleCountResult.CycleCountPlanId = selectedIds[0];
    cycleCountResult.PerPage = _perInPage;
    cycleCountResult.Page = _currentPage;

    if(selectedIds.length > 1){
      this.baseService.popupService.ShowWarningPopup("Birden fazla sayım planı seçtiniz!");
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
          break;
          case this.cycleCountListEnums.NotFoundFixedAsset:
          this.dataTableNotFoundFixedAsset.TGT_loadData(this.cycleCountResult);
          break;
          case this.cycleCountListEnums.DifferentLocationFixedAsset:
          this.dataTableDifferenLocationFixedAsset.TGT_loadData(this.cycleCountResult);
          break;
          case this.cycleCountListEnums.NotRegisteredFixedAsset:
          this.dataTableNotRegisteredFixedAsset.TGT_loadData(this.cycleCountResult);
          break;
        }
   
        this.TGT_calculatePages();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });

  }

  loadCycleCountResultNotFoundFixedAsset(_perInPage: number = 25, _currentPage: number = 1){
    this.cycleCountResult = [];
    let cycleCountResult: CycleCountResults = new CycleCountResults();
    let selectedIds = (<CycleCountPlan[]>this.dataTable.TGT_getSelectedItems()).map(x=>x.getId());
    
    cycleCountResult.CycleCountPlanId = selectedIds[0];
    cycleCountResult.PerPage = _perInPage;
    cycleCountResult.Page = _currentPage;

    if(selectedIds.length > 1){
      this.baseService.popupService.ShowWarningPopup("Birden fazla sayım planı seçtiniz!");
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
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  toggleDropdown(key:string) {
    switch (key) {
      case "location":
    this.isLocationDropdownOpen = !this.isLocationDropdownOpen;  
    this.loadLocationList();

    break;
      }
  }

  selectedLocation: Location[];

  onSubmit(data: NgForm) {
    if (this.cycleCountPlan.CycleCountPlanId == null) {
      this.addCycleCountPlan(data);
    }
  }

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

  

  loadCanceledCycleCountPlan(){
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

  UpdateFindDifferentLocationsFixedassets(){
    let cycleCount:CycleCountResults=new CycleCountResults();

     let selectedId= (<CycleCountPlan[]>this.dataTable.TGT_getSelectedItems()).map(x=>x.getId());
     let barcodes = (<CycleCountPlan[]>this.dataTableDifferenLocationFixedAsset.TGT_getSelectedItems()).map(x=>x.Barcode);
    selectedId.forEach(e=>{
      cycleCount.CycleCountPlanId = e;
    });
     cycleCount.Barcodes = barcodes;
     //this.baseService.cycleCountService.UpdateFindDifferentLocationsFixedassets(cycleCount,()=>{},()=>{})
  }

  UpdateNotFoundFixedAsset(){

    let result:CycleCountResults=new CycleCountResults();

    let selectedItems = (<CycleCountResults[]>this.dataTableNotFoundFixedAsset.TGT_getSelectedItems()).map(x=>x.Barcode);

    let selectedIds = (<CycleCountPlan[]>this.dataTable.TGT_getSelectedItems()).map(x=>x.getId());
    result.Barcodes = selectedItems;
    result.CycleCountPlanId = selectedIds[0];

    this.baseService.cycleCountService.UpdateNotFoundFixedAsset(result,()=>{},()=>{})

  }

  NotFoundFixedAsset(){
    let selectedItems = this.dataTableNotFoundFixedAsset.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz"
      );
      return;
    }

    $("#btnLostFixedAsset").trigger("click");
    
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

  public doOperation(operationType: number) {
    switch(operationType){
      case this.cycleCountOperationEnums.cancelCycleCount:
      this.loadCanceledCycleCountPlan();
      break;
      case this.cycleCountOperationEnums.lostFixedAsset:
        this.NotFoundFixedAsset();
      break;
      case this.cycleCountOperationEnums.updateLocation:

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
