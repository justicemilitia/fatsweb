import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { BaseService } from 'src/app/services/base.service';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { FixedAssetStatus } from 'src/app/models/FixedAssetStatus';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent extends BaseComponent implements OnInit {
  
  fixedAssetStatus: FixedAssetStatus[] = [];
  fxedAssetStatu: FixedAssetStatus = new FixedAssetStatus();

  public dataTableFixedAssetStatus: TreeGridTable = new TreeGridTable(
    "fixedassetstatus",
    [
      {
        columnDisplayName: "Statü Kodu",
        columnName: ["FixedAssetStatuCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü Adı",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Renk",
        columnName: ["Color"],
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

  constructor(baseService:BaseService) { 
    super(baseService);
    this.dataTableFixedAssetStatus.isMultipleSelectedActive = false;
    this.dataTableFixedAssetStatus.isColumnOffsetActive = false;
    this.dataTableFixedAssetStatus.isPagingActive = false;
  }

  ngOnInit() {

  }

  LoadFixedAssetStatus() {
    this.baseService.fixedAssetStatusService.GetFixedAssetStatus(
      (fixedAssetStatus: FixedAssetStatus[]) => {
        this.fixedAssetStatus = fixedAssetStatus;

        this.dataTableFixedAssetStatus.TGT_loadData(this.fixedAssetStatus);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
