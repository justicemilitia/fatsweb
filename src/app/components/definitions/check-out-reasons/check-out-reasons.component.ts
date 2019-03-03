import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { BaseComponent } from '../../base/base.component';
import { CheckOutReason } from 'src/app/models/CheckOutReason';
import { NgForm } from '@angular/forms';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';

@Component({
  selector: 'app-check-out-reasons',
  templateUrl: './check-out-reasons.component.html',
  styleUrls: ['./check-out-reasons.component.css']
})
export class CheckOutReasonsComponent extends BaseComponent implements OnInit {

  checkOutReasons: CheckOutReason[]=[];
  checkoutreason:CheckOutReason=new CheckOutReason();

  public dataTable: TreeGridTable = new TreeGridTable(
    [
      {
        columnDisplayName: "Şirket Adı",
        columnName: ["Name"],
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
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );
  constructor(protected baseService: BaseService) { super(baseService); }

  ngOnInit() {
  
  }
  LoadCheckOutReasons() {
    this.baseService.checkOutReasonService.GetCheckOutReason(
      (checkOutReasons: CheckOutReason[]) => {
        this.checkOutReasons = checkOutReasons;
        this.dataTable.TGT_loadData(this.checkOutReasons);
        });
      } 



}
