import { Component, OnInit, NgModule, Input, SimpleChanges, OnChanges } from "@angular/core";
import { NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { InputTrimDirective } from 'ng2-trim-directive';
import { FixedAssetComponent } from '../fixed-asset.component';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { FixedAssetFile } from 'src/app/models/FixedAssetFile';

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
export class FaEditFileComponent extends BaseComponent implements OnInit, OnChanges {

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["faBarcode"]) {
      this.loadFixedAssetFile();
    }
  }

  @Input() faBarcode: FixedAsset[] = [];
  @Input() faDataTable: TreeGridTable; 
  @Input() faComponent: FixedAssetComponent;

  fixedAsset:FixedAsset = new FixedAsset();
  fixedAssetFiles: FixedAssetFile[] = [];

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
      column: ["Barcode"]
    }
  );

  constructor(baseService: BaseService) {

    super(baseService);
    this.dataTableFile.isPagingActive = false;
    this.dataTableFile.isColumnOffsetActive = false;
    this.dataTableFile.isLoading = false;
  }

  ngOnInit() {

  }

  loadFixedAssetFile(){

    let fixedAssetFile:FixedAssetFile[]=[];
    // this.faBarcode.map(x=>x.FixedAssetId);

    this.faBarcode.forEach(e=>{
      e.FixedAssetFiles.forEach(x=>{
      let file:FixedAssetFile=new FixedAssetFile();
        file.Barcode=e.Barcode;
        file.FixedAssetFileId=x.FixedAssetFileId;
        file.FileName=x.FileName;
        fixedAssetFile.push(file);
      });
    });
    this.dataTableFile.TGT_loadData(fixedAssetFile);
  }

  insertFiles(){
    this.baseService.spinner.show();

    this.baseService.fileUploadService.FileUpload(
      this.faBarcode,
      this.fixedAssetFiles,
      (file: string[], message) => {
        this.baseService.spinner.hide();

        this.baseService.popupService.ShowSuccessPopup(
          "Dosya Yükleme Başarılı!"
        );

        this.dataTableFile.TGT_clearData();
      },
      (error: HttpErrorResponse) => {
        this.baseService.spinner.hide();

        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
