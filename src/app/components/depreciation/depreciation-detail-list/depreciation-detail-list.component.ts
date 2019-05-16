import { Component, OnInit } from '@angular/core';
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';
import { BaseService } from '../../../services/base.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-depreciation-detail-list',
  templateUrl: './depreciation-detail-list.component.html',
  styleUrls: ['./depreciation-detail-list.component.css']
})
export class DepreciationDetailListComponent extends BaseComponent implements OnInit {

  public dataTable: TreeGridTable = new TreeGridTable(
    "exitfixedasset",
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
        columnName: ["FixedAssetCard", "Name"],
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

  constructor(protected baseService: BaseService) { 

    super(baseService);
    this.loadDepreciationDetailList();
  }

  ngOnInit() {
  }
  loadDepreciationDetailList(){
    
  }
}
