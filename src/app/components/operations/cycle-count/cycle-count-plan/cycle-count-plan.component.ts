import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';

@Component({
  selector: 'app-cycle-count-plan',
  templateUrl: './cycle-count-plan.component.html',
  styleUrls: ['./cycle-count-plan.component.css']
})
export class CycleCountPlanComponent implements OnInit {

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
        type: "text"
      },
      {
        columnDisplayName: "Bitiş Tarihi",
        columnName: ["EndTime"],
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
        columnDisplayName: "Açıklama",
        columnName: ["Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
      },
      {
        columnDisplayName: "Durum",
        columnName: ["CycleCountStatus","Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
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
        type: "text",
      },
      {
        columnDisplayName: "Durum",
        columnName: ["CycleCountStatus","Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
      }
    ],
    {
      isDesc: false,
      column: ["CycleCountPlanNo"]
    }
  );


  constructor() { }

  ngOnInit() {
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    if(tabChangeEvent.index==0){
     
    } 
    else if(tabChangeEvent.index==1){


    }
  }
}
