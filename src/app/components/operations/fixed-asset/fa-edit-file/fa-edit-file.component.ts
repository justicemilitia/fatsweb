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
  fixedAssets:FixedAsset[]=[];
  fixedAssetFiles: FixedAssetFile[] = [];
  fileList:FileList[]=[];
  fixedAssetFilesDataTable: FixedAssetFile[] = [];
  fixedAssetFile: FixedAssetFile[] = [];
  InsertOrDelete:boolean=false;
  barcodes:any;

  
  public dataTableFile: TreeGridTable = new TreeGridTable(
    "fixedassetfile",
    [
      {
        columnDisplayName: this.getLanguageValue('Barcode'),
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName:  this.getLanguageValue('File_Name'),
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

  public dataTableNewFile: TreeGridTable = new TreeGridTable(
    "fixedassetnewfile",
    [
      {
        columnDisplayName: this.getLanguageValue('Barcode'),
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('File_Name'),
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

    this.dataTableNewFile.isPagingActive = false;
    this.dataTableNewFile.isColumnOffsetActive = false;
    this.dataTableNewFile.isLoading = false;
    this.dataTableNewFile.isDeleteable = true;
    this.dataTableNewFile.isMultipleSelectedActive=false;
  }

  ngOnInit() {}

  loadFixedAssetFile() {
    
    this.fixedAssetFile=[];

    this.dataTableNewFile.TGT_clearData();

    this.faBarcode.forEach(e => {
      this.fixedAssets.push(e);
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

    this.faBarcode.forEach(e => { 

        for (var i = 0; i < event.target.files.length; i++) {
        let files: FixedAssetFile = new FixedAssetFile();

        files.Barcode = e.Barcode;
        files.FixedAssetFileId = (this.fixedAssetFilesDataTable.length + 1) * -1;
        files.FileName = event.target.files[i].name;
        
        this.fixedAssetFilesDataTable.push(files);
        }   
           
        this.dataTableNewFile.TGT_loadData(this.fixedAssetFilesDataTable);

    });

    for (var i = 0; i < event.target.files.length; i++) {
    this.fixedAssetFiles.push(event.target.files[i]);
    }    
  }

  insertFiles() {
    
    let selectedFiles = this.dataTableNewFile.TGT_selectAllItems();

    let fixedassetfiles:FixedAssetFile[]=[];

    Object.assign(fixedassetfiles,selectedFiles);

   this.fixedAssetFiles = this.fixedAssetFiles.filter(e => fixedassetfiles.some(t=>e.name == t.FileName));

   if (this.fixedAssetFiles.length == 0) {
    this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Choose_File'));
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

        this.dataTableNewFile.TGT_clearData();
        
        this.faComponent.loadFixedAsset();
        
      },
      (error: HttpErrorResponse) => {
        this.baseService.spinner.hide();

        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.loadFixedAssetFile();

    this.fixedAssetFilesDataTable = [];
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

    this.dataTableNewFile.TGT_clearData();

    this.fixedAssetFile = [];

    this.fixedAssetFiles = [];

    this.faComponent.loadFixedAsset();
  }
}
