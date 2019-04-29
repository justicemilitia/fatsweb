import {
  Component,
  OnInit,
  NgModule,
  Input,
  SimpleChanges,
  OnChanges
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { InputTrimDirective } from "ng2-trim-directive";
import { FixedAssetComponent } from "../fixed-asset.component";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { FixedAssetFile } from "src/app/models/FixedAssetFile";

@Component({
  selector: "app-fa-edit-file",
  templateUrl: "./fa-edit-file.component.html",
  styleUrls: ["./fa-edit-file.component.css"]
})
@NgModule({
  imports: [],
  declarations: [FaEditFileComponent],
  providers: [FaEditFileComponent]
})
export class FaEditFileComponent extends BaseComponent
  implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["faBarcode"]) {
      this.loadFixedAssetFile();
    }
  }

  @Input() faBarcode: FixedAsset[] = [];
  @Input() faDataTable: TreeGridTable;
  @Input() faComponent: FixedAssetComponent;

  fixedAsset: FixedAsset = new FixedAsset();
  fixedAssetFiles: FixedAssetFile[] = [];
  fixedAssetFilesDataTable: FixedAssetFile[] = [];
  fixedAssetFile: FixedAssetFile[] = [];
  InsertOrDelete:boolean=false;
  barcodes:any;

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

  ngOnInit() {}

  loadFixedAssetFile() {
    
    this.fixedAssetFile=[];

    this.dataTableFile.TGT_clearData();

    this.faBarcode.forEach(e => {
      e.FixedAssetFiles.forEach(x => {
        let file: FixedAssetFile = new FixedAssetFile();
        file.Barcode = e.Barcode;
        file.FixedAssetFileId = x.FixedAssetFileId;
        file.FileName = x.FileName;
        this.fixedAssetFile.push(file);
      });
    });
    this.dataTableFile.TGT_loadData(this.fixedAssetFile);
  }

  public onFileSelected(event) {

    this.fixedAssetFilesDataTable=[];

    this.faBarcode.forEach(e => { 

        for (var i = 0; i < event.target.files.length; i++) {
        let files: FixedAssetFile = new FixedAssetFile();

        files.Barcode = e.Barcode;
        files.FixedAssetFileId = (this.fixedAssetFilesDataTable.length + 1) * -1;
        files.FileName = event.target.files[i].name;
        this.fixedAssetFilesDataTable.push(files);
        }   
           
        this.dataTableFile.TGT_loadData(this.fixedAssetFilesDataTable);

    });

    for (var i = 0; i < event.target.files.length; i++) {
    this.fixedAssetFiles.push(event.target.files[i]);
    }
  }

  insertFiles() {

    if(this.fixedAssetFiles.length == 0){
      this.baseService.popupService.ShowWarningPopup("Lütfen dosya ekleyiniz!")
      return;
    }

    this.baseService.spinner.show();

    this.barcodes = this.faBarcode.map(x=>x.Barcode);

    this.baseService.fileUploadService.FileUpload(
      this.barcodes,
      this.fixedAssetFiles,
      (file: string[], message) => {
        this.baseService.spinner.hide();

        this.baseService.popupService.ShowSuccessPopup("Dosya Yükleme Başarılı!");

        this.dataTableFile.TGT_clearData();
        
        this.faComponent.loadFixedAsset();
      },
      (error: HttpErrorResponse) => {
        this.baseService.spinner.hide();

        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  deleteFiles() {

    let selectedItems = this.dataTableFile.TGT_getSelectedItems();
    if(selectedItems.length==0){
      this.baseService.popupService.ShowWarningPopup("Lütfen bir dosya seçiniz!")
      return;
    }

    let itemIds: number[] = selectedItems.map(x => x.getId());

    this.baseService.fileUploadService.DeleteFiles(
      itemIds,
      result => {
        this.baseService.popupService.ShowSuccessPopup("Silme işlemi başarılı");  

        this.dataTableFile.TGT_removeItemsByIds(itemIds);

        this.faComponent.loadFixedAsset();
      },
      (error:HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  resetForm(){

    this.dataTableFile.TGT_clearData();

    this.fixedAssetFile = [];

    this.fixedAssetFiles = [];

    this.faComponent.loadFixedAsset();
  }
}
