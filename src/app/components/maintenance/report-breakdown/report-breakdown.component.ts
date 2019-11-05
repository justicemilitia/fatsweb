import { Component, OnInit, Input } from '@angular/core';
import { FixedAsset } from '../../../models/FixedAsset';
import { WorkOrderListComponent } from '../work-order-list/work-order-list.component';
import { BaseComponent } from '../../base/base.component';
import { BaseService } from '../../../services/base.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Maintenance } from '../../../models/Maintenance';
import { MaintenanceRequestPicture } from '../../../models/MaintenanceRequestPicture';
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';

@Component({
  selector: 'app-report-breakdown',
  templateUrl: './report-breakdown.component.html',
  styleUrls: ['./report-breakdown.component.css']
})
export class ReportBreakdownComponent extends BaseComponent implements OnInit {

  @Input() reportBreakdown: FixedAsset = new FixedAsset();
  @Input() wolComponent: WorkOrderListComponent;
  
  maintenance: Maintenance = new Maintenance();

  maintenanceNumber: string;
  maintenancePictures: any[]=[];
  fileMessage: string = '';
  isMoreThanFive: boolean=false;
  dtFileLength: number;
  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;
  
  
  public dataTableFile: TreeGridTable = new TreeGridTable(
    "fixedassetfile",
    [
      {
        columnDisplayName: this.getLanguageValue('File'),
        columnName: ["Picture"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Picture"]
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

  onSubmit(data: NgForm) {

    this.dtFileLength =this.dataTableFile.TGT_selectAllItems().length;
    if (data.form.invalid == true && this.dtFileLength<6) return;

      this.popupComponent.ShowModal('#modalShowQuestionPopupForReportBreakdown');
  }

  ReportBreakdown(data: NgForm){

    let cloneItem = new Maintenance();  
    // let maintenanceRequestPicture: MaintenanceRequestPicture[] = [];

    if (this.maintenancePictures.length == 0) {
      this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Choose_File'));
      return;
    } 

    cloneItem.FixedAssetId=this.reportBreakdown.FixedAssetId;
    cloneItem.RequestDescription = data.value.RequestDescription;
    
    if (this.maintenancePictures && this.maintenancePictures.length > 0) {
      cloneItem.MaintenanceRequestPictures = this.maintenancePictures;
    }

    cloneItem.MaintenanceStatusId=2;

    this.isWaitingInsertOrUpdate = true;

    this.baseService.spinner.show();

    this.baseService.workOrderService.ReportBreakdown(
      cloneItem,
      this.maintenancePictures,
      (insertedItem: Maintenance, message) => {

      this.popupComponent.ShowModal('#modalShowMaintenanceNumberPopup');
        
        /* Show success pop up */
        // this.baseService.popupService.ShowSuccessPopup(message);

        this.baseService.spinner.hide();

        this.popupComponent.CloseModal('#modalShowQuestionPopupForReportBreakdown');      


        this.resetForm(data);

        this.isWaitingInsertOrUpdate = false;

        this.wolComponent.loadFixedAsset();

        this.maintenanceNumber = insertedItem.MaintenanceNumber.toString();
        this.popupComponent.ShowModal('#modalShowMaintenanceNumberPopup');
      },
      (error: HttpErrorResponse) => {

        this.popupComponent.ShowModal("#modalShowErrorMessage");

        this.baseService.spinner.hide();
        
        this.isWaitingInsertOrUpdate = false;
      }
    );
  }

  resetForm(data: NgForm) {
    data.resetForm();
    this.dataTableFile.TGT_clearData();    
  }

  closeReportBreakdownPopup(){
    this.popupComponent.CloseModal('#modalShowQuestionPopupForReportBreakdown');          
  }

  closeModalMaintenanceNumberPopup(){
    this.popupComponent.CloseModal('#modalShowMaintenanceNumberPopup');  
    this.wolComponent.ClosePopup(true);        
  }

  clearPictures() {
    this.maintenancePictures = [];
    this.maintenance.MaintenanceRequestPictures = null;
  }

  changeFile(event: any): void {
    let maintenanceRequestPicture: MaintenanceRequestPicture[]=[];    

    this.maintenancePictures = event.target.files;
    if(this.maintenancePictures.length <6){
    this.isMoreThanFive=false;      
    for (var i = 0; i < this.maintenancePictures.length; i++) {
      if (this.maintenancePictures[i].type == 'image/png' || this.maintenancePictures[i].type == 'image/jpg' || this.maintenancePictures[i].type == 'image/jpeg') {
       
        let requestPic: MaintenanceRequestPicture = new MaintenanceRequestPicture;

        requestPic.MaintenanceRequestPictureId = (maintenanceRequestPicture.length + 1) * -1;     
        requestPic.Picture=this.maintenancePictures[i].name;
        maintenanceRequestPicture.push(requestPic);        
        }
      }
    }
    else{
      this.isMoreThanFive=true;
      this.fileMessage = "5'ten fazla resim yükleyemezsiniz.";
    }
      this.dataTableFile.TGT_loadData(maintenanceRequestPicture);            
  }
}
