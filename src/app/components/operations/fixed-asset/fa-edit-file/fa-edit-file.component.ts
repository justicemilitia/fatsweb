import { Component, OnInit, NgModule, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { InputTrimDirective } from 'ng2-trim-directive';
import { FixedAssetComponent } from '../fixed-asset.component';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';

@Component({
  selector: 'app-fa-edit-file',
  templateUrl: './fa-edit-file.component.html',
  styleUrls: ['./fa-edit-file.component.css']
})
export class FaEditFileComponent extends BaseComponent implements OnInit {

  public dataTableFile: TreeGridTable = new TreeGridTable(
    "fixedassetfile",
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
        columnDisplayName: "Dosya adı",
        columnName: ["FileName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["FileName"]
    }
  );
  constructor(baseService: BaseService) {

    super(baseService);
    this.dataTableFile.isPagingActive = false;
    this.dataTableFile.isColumnOffsetActive = false;
    this.dataTableFile.isDeleteable = true;
    this.dataTableFile.isMultipleSelectedActive = false;
    this.dataTableFile.isLoading = false;

  }

  ngOnInit() {
    
  }

}
