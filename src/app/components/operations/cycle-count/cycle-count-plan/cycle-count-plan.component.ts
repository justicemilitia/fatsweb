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
        columnDisplayName: "Departman Adı",
        columnName: ["Department", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Sayım Tarihi",
        columnName: ["TaskName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
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

  constructor(public baseService: BaseService) {
    super(baseService);
    this.LoadCycleCountPlanList();
    this.loadLocationList();

    this.dataTableLocation.isPagingActive = false;
    this.dataTableLocation.isColumnOffsetActive = false;
    this.dataTableLocation.isDeleteable = false;
    this.dataTableLocation.isLoading = false;
    this.dataTableLocation.isScrollActive = false;
    this.dataTableLocation.isSelectAllWithChildrenActive=true;

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

  async LoadCycleCountPlanList() {
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

  toggleDropdown(key:string) {

    switch (key) {
      case "location":
    this.isLocationDropdownOpen = !this.isLocationDropdownOpen;   
    break;
      }
  }

  onSubmit(data: NgForm) {
    if (this.cycleCountPlan.CycleCountPlanId == null) {
      this.AddCycleCountPlan(data);
    }
  }

  AddCycleCountPlan(data: NgForm) {
    let willInsertItem = new CycleCountPlan();

    Object.assign(willInsertItem, this.cycleCountPlan);

    this.isWaitingInsertOrUpdate = true;

    willInsertItem.LocationIds = <[]>this.dataTableLocation.TGT_getSelectedItems().map(x=>x.getId());
    willInsertItem.StartTime=convertNgbDateToDateString(data.value.startTime);
    willInsertItem.EndTime=convertNgbDateToDateString(data.value.endTime);

    this.baseService.cycleCountService.InsertCycleCountPlan(
      willInsertItem,
      (insertedItem:CycleCountPlan,message) => {

        this.isWaitingInsertOrUpdate = false;

        this.baseService.popupService.ShowSuccessPopup(message);

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

  CancelCycleCountPlan(){

  }
  
  resetForm(data: NgForm, isNewItem: boolean) {
    if (isNewItem == true) {
      this.cycleCountPlan = new CycleCountPlan(); 
    }
    data.reset();
    data.resetForm(this.cycleCountPlan);
  }


  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    if (tabChangeEvent.index == 0) {
    } else if (tabChangeEvent.index == 1) {
    }
  }
}
