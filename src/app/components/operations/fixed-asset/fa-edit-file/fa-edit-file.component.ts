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
import { saveAs } from "file-saver";

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

  filename: string = '';

  
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

      let selectedFiles = this.dataTableNewFile.TGT_copySource();      

        for (var i = 0; i < event.target.files.length; i++) {
        let files: FixedAssetFile = new FixedAssetFile();

        files.Barcode = e.Barcode;
        files.FixedAssetFileId = (this.fixedAssetFilesDataTable.length + 1) * -1;
        files.FileName = event.target.files[i].name;
        
        selectedFiles.push(files);   
        }   
          this.dataTableNewFile.TGT_loadData(selectedFiles);
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

        this.baseService.popupService.ShowSuccessPopup( this.getLanguageValue('Addig_file_is_successfull'));

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
      this.baseService.popupService.ShowWarningPopup(" this.getLanguageValue('Choose_at_least_one_file')")
      return;
    }

    let itemIds: number[] = selectedItems.map(x => x.getId());

    this.baseService.fileUploadService.DeleteFiles(
      itemIds,
      result => {
        this.baseService.popupService.ShowSuccessPopup( this.getLanguageValue('Deletion_is_succesfull'));  

        this.dataTableFile.TGT_removeItemsByIds(itemIds);

        this.faComponent.loadFixedAsset();
      },
      (error:HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  downloadFiles(){
    let selectedItems = <FixedAssetFile[]>this.dataTableFile.TGT_getSelectedItems();
  
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        this.getLanguageValue("Please_choose_at_least_one_record")
      );
      return;
    }    
  
    selectedItems.forEach((e,i) => {
      this.filename = selectedItems[i] == null ? null : (selectedItems[i]).FileName;  
      if(this.filename != ''){
        this.downloadFile(this.filename);      
      }
      this.filename='';
    });
  }

  downloadFile(fileName: string){ 

 
    //file type extension
    let checkFileType =  this.filename.split('.').pop();
    var fileType;
    switch(checkFileType){
      case 'txt':
      fileType = "text/plain";    
      break;
      case 'pdf':
      fileType = "application/pdf";    
      break;
      case 'doc':
      fileType = "application/vnd.ms-word";    
      break;
      case 'docx':
      fileType = "application/vnd.ms-word";    
      break;
      case 'xls':
      fileType = "application/vnd.ms-excel";    
      break;
      case 'xlsx':
      fileType = "application/vnd.ms-excel";    
      break;
      case 'png':
      fileType = "image/png";    
      break;
      case 'jpg':
      fileType = "image/jpeg";    
      break;
      case 'jpeg':
      fileType = "image/jpeg";    
      break;
      case 'gif':
      fileType = "image/gif";    
      break;
      case 'csv':
      fileType = "text/csv";    
      break;
     }
    
    this.baseService.fileUploadService.DownloadFile(fileName, fileType)
    .subscribe(
              success => {
                saveAs(success, fileName); 
              },
              (error: HttpErrorResponse) => {
                /* show error pop up */
                this.baseService.popupService.ShowErrorPopup(error);
              }
          );
  }

  resetForm(){

    this.dataTableFile.TGT_clearData();

    this.dataTableNewFile.TGT_clearData();

    this.fixedAssetFile = [];

    this.fixedAssetFiles = [];

    this.fixedAssetFilesDataTable=[];

    

    this.faComponent.loadFixedAsset();
  }
}
