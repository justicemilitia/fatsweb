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

@NgModule({
  imports: [],
  declarations: [FaEditFileComponent],
  providers: [FaEditFileComponent]
})
export class FaEditFileComponent extends BaseComponent implements OnInit {

  @Input() faBarcode: FixedAsset = new FixedAsset();  
  @Input() faDataTable: TreeGridTable; 
  @Input() faComponent: FixedAssetComponent;

  fixedAsset:FixedAsset=new FixedAsset();

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
        columnName: ["FixedAssetFiles","FileName"],
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
  constructor(baseService: BaseService) {

    super(baseService);
    this.dataTableFile.isPagingActive = false;
    this.dataTableFile.isColumnOffsetActive = false;
    this.dataTableFile.isDeleteable = true;
    this.dataTableFile.isMultipleSelectedActive = false;
    this.dataTableFile.isLoading = false;
    this.loadFixedAssetFile();
  }

  ngOnInit() {

  }

  loadFixedAssetFile(){
   
   let fa:FixedAsset[] = (<FixedAsset[]>this.faDataTable.TGT_getSelectedItems());
  //  console.log(fa);
  }

}
