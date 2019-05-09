import { Component, OnInit } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { BaseComponent } from "src/app/components/base/base.component";
import { BaseService } from "src/app/services/base.service";
import { CycleCountPlan } from 'src/app/models/CycleCountPlan';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: "app-cycle-count-plan",
  templateUrl: "./cycle-count-plan.component.html",
  styleUrls: ["./cycle-count-plan.component.css"]
})
export class CycleCountPlanComponent extends BaseComponent implements OnInit {

  cycleCountPlans:CycleCountPlan[]=[];

  isTableExporting: boolean = false;
  
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
          return value.StartTime ? value.StartTime.substring(0, 10).split("-").reverse().join("-") : "";
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
          return value.EndTime ? value.EndTime.substring(0, 10).split("-").reverse().join("-") : "";
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

  constructor(public baseService: BaseService) {
    super(baseService);
    this.LoadCycleCountPlanList();
  }

  ngOnInit() {}

  LoadCycleCountPlanList() {
    this.baseService.cycleCountService.GetCycleCountPlan(
      (cyclecountplans:CycleCountPlan[]) => {
        this.cycleCountPlans = cyclecountplans;
        this.dataTable.TGT_loadData(this.cycleCountPlans);
      },   
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }


  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    if (tabChangeEvent.index == 0) {
    } else if (tabChangeEvent.index == 1) {
    }
  }
}
