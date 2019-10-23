import { Component, OnInit, Input } from '@angular/core';
import { FixedAsset } from '../../../models/FixedAsset';
import { WorkOrderListComponent } from '../work-order-list/work-order-list.component';
import { BaseComponent } from '../../base/base.component';
import { BaseService } from '../../../services/base.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Maintenance } from '../../../models/Maintenance';
import { MaintenanceRequestPicture } from '../../../models/MaintenanceRequestPicture';

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
  breakdownPictures: MaintenanceRequestPicture[]=[];
  fileMessage: string = '';
  isMoreThanFive: boolean=false;
  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;
  
  constructor(baseService: BaseService) {
    super(baseService);
  }

  ngOnInit() {
  }

  onSubmit(data: NgForm) {

    if (data.form.invalid == true) return;

      this.popupComponent.ShowModal('#modalShowQuestionPopupForReportBreakdown');
  }

  ReportBreakdown(data: NgForm){
   
    let cloneItem = new Maintenance();  
    
    cloneItem.FixedAssetId=this.reportBreakdown.FixedAssetId;

    cloneItem.RequestDescription = data.value.RequestDescription;

    cloneItem.MaintenanceStatusId=2;

    this.isWaitingInsertOrUpdate = true;

    this.baseService.spinner.show();

    this.baseService.workOrderService.ReportBreakdown(
      cloneItem,
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
  }

  closeReportBreakdownPopup(){
    this.popupComponent.CloseModal('#modalShowQuestionPopupForReportBreakdown');          
  }

  closeModalMaintenanceNumberPopup(){
    this.popupComponent.CloseModal('#modalShowMaintenanceNumberPopup');  
    this.wolComponent.ClosePopup(true);        
  }

  clearFiles() {
    this.breakdownPictures = [];

    this.maintenance.BreakdownPictures = null;
  }

  changeFile(event: any): void {
    var selectedFiles = event.target.files;
    if(selectedFiles.length <6){
    for (var i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].type == 'image/png' || selectedFiles[i].type == 'jpg' || selectedFiles[i].type == 'jpeg') {
        let requestPic: MaintenanceRequestPicture = new MaintenanceRequestPicture;
        requestPic.Picture=selectedFiles[i].name;
        requestPic.MaintenanceListId=this.maintenance.MaintenanceListId;
        this.breakdownPictures.push(requestPic);        
        }  
      }    
    }
    else{
      this.isMoreThanFive=true;
      this.fileMessage = "5'ten fazla resim yükleyemezsiniz.";
    }
  }

  // uploadFiles() {  
  //   const frmData = new FormData();  
  //   for (var i = 0; i < this.breakdownPictures.length; i++) {  
  //     frmData.append("fileUpload", this.breakdownPictures[i]);  
  //     if (i == 0) {  
  //       frmData.append("remark", this.remark);  
  //     }  
  //   }  
  //   this.httpService.post('http://localhost:50401/api/FileUpload/UploadFiles', frmData).subscribe(  
  //     data => {  
  //       // SHOW A MESSAGE RECEIVED FROM THE WEB API.  
  //       this.sMsg = data as string;  
  //       console.log(this.sMsg);  
  //     }  
  //   );  
  // }
  clearPictures(){
    this.breakdownPictures = [];

    this.maintenance.BreakdownPictures = null;
  }

}
