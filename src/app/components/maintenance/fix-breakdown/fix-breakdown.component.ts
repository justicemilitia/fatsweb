import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FixedAsset } from '../../../models/FixedAsset';
import { WorkOrderListComponent } from '../work-order-list/work-order-list.component';
import { BaseService } from '../../../services/base.service';
import { BaseComponent } from '../../base/base.component';
import { Maintenance } from '../../../models/Maintenance';
import { NgForm } from '@angular/forms';
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';
import { MaintenanceRequestPicture } from '../../../models/MaintenanceRequestPicture';
import { IMAGE_URL } from '../../../declarations/service-values';
import { MaintenanceUser } from '../../../models/MaintenanceUser';
import { HttpErrorResponse } from '@angular/common/http';
import { MaintenanceStatus } from '../../../declarations/maintenance-status.enum';

@Component({
  selector: 'app-fix-breakdown',
  templateUrl: './fix-breakdown.component.html',
  styleUrls: ['./fix-breakdown.component.css']
})
export class FixBreakdownComponent extends BaseComponent implements OnInit {

  @Input() fixBreakdown: Maintenance = new Maintenance();
  @Input() wolComponent: WorkOrderListComponent;
  
  maintenance: Maintenance = new Maintenance();  
  maintinanceUser: MaintenanceUser = new MaintenanceUser();

  maintenanceStatusId: number;
  updatedMaintenanceStatusId: number;

  maintenanceNumber: string;
  maintenancePictures: any[]=[];
  fileMessage: string = '';
  isMoreThanFive: boolean=false;
  dtFileLength: number;
  imageArray: any[]=[];
  requestImageArray: any[]=[];
  maintenanceUsers: string = '';
  isCancelled: boolean= false;
  HourMinute: string = '';
  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;
  isModalOpen: boolean = false;
  url: any;
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

    console.log(this.maintinanceUser);
    Object.assign(this.imageArray, this.fixBreakdown.MaintenanceRequestPictures);    
  }
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["fixBreakdown"].currentValue != changes["fixBreakdown"].previousValue) {
    
      this.GetUserStatusByMaintenanceId(this.fixBreakdown.MaintenanceListId);
      this.GetMaintenanceRequestPicturesByMaintenanceId(this.fixBreakdown.MaintenanceListId);
      
      let path="UploadFiles/ThumbImages/thumb_";
      this.imageArray= [];
      this.maintenanceUsers= '';
      for (var i = 0; i < this.fixBreakdown.MaintenanceRequestPictures.length; i++) {
         
          let requestPic: MaintenanceRequestPicture = new MaintenanceRequestPicture;
          requestPic.Picture=IMAGE_URL + path + this.fixBreakdown.MaintenanceRequestPictures[i].Picture;
          this.imageArray.push(requestPic.Picture);        
        }

        let userIds: number[]=[];
        this.fixBreakdown.MaintinanceUsers.forEach((e, i) => {
          if(!userIds.includes(e.UserId)) 
          {     
            userIds.push(e.User.UserId);                
            this.maintenanceUsers += e.User == null ? '' : (e.User.FirstName + ' ' + e.User.LastName) + (i == this.fixBreakdown.MaintinanceUsers.length - 1 ? "" : ", ");
          }
        });
        this.maintenanceUsers = this.maintenanceUsers.slice(this.maintenanceUsers.length-2, this.maintenanceUsers.length) == ', ' ? this.maintenanceUsers.slice(0, - 2) : this.maintenanceUsers;

        let hour: number = Math.floor((this.fixBreakdown.MaintenanceTotalTime/60));
        let minute: number = Math.floor((this.fixBreakdown.MaintenanceTotalTime %60));
        this.HourMinute = hour + ' saat ' + minute + ' dakika';

        this.maintinanceUser.Hour = hour == 0 ? null : hour;
        this.maintinanceUser.Minute = minute  == 0 ? null : minute;

        Object.assign(this.maintenance, this.fixBreakdown);
    }
  }

  onSubmit(data: NgForm) {
  
    if(this.updatedMaintenanceStatusId==6){
      if (data.form.invalid == true) return;
      else
      this.popupComponent.ShowModal('#modalShowQuestionPopupForCancelBreakdown');      
    }
    
    else{ 
        this.dtFileLength =this.dataTableFile.TGT_selectAllItems().length;
          if (data.form.invalid == true || this.dtFileLength>5 || this.maintinanceUser.Hour == null || this.maintinanceUser.Minute == null) return;
          else
          {
            // this.wolComponent.ClosePopup(true);      
            this.popupComponent.ShowModal('#modalShowQuestionPopupForFixBreakdown');
          }
        }
  }

  //ARIZA GİDERME
  FixBreakdownWithFileUpload(data: NgForm){

    let cloneItem = new Maintenance();  
    // let maintenanceRequestPicture: MaintenanceRequestPicture[] = [];

    // if (this.maintenancePictures.length == 0) {
    //   this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Choose_File'));
    //   return;
    // } 
    
    cloneItem.Hour = data.value.Hour;
    cloneItem.Minute = data.value.Minute;

    cloneItem.CompletionDescription = data.value.CompletionDescription;
    
    if (this.maintenancePictures && this.maintenancePictures.length > 0) {
      cloneItem.MaintenanceRequestPictures = this.maintenancePictures;
    }
    cloneItem.MaintenanceListId=this.fixBreakdown.MaintenanceListId;
    cloneItem.MaintenanceStatusId = this.updatedMaintenanceStatusId;

    this.isWaitingInsertOrUpdate = true;

    this.baseService.spinner.show();

    this.baseService.workOrderService.FixBreakdownWithFileUpload(
      cloneItem,
      this.maintenancePictures,
      (insertedItem: Maintenance, message) => {

        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        this.baseService.spinner.hide();

        
        this.maintenanceStatusId = insertedItem.MaintenanceStatusId;
        insertedItem.CompletionDescription='';
        insertedItem.MaintenanceTotalTime=null;
        insertedItem.MaintenanceRequestPictures=[];

        // Object.assign(this.fixBreakdown, insertedItem);

        this.isWaitingInsertOrUpdate = false;

        this.wolComponent.loadWorkOrderList(1,25,1);

        this.wolComponent.ClosePopup(true);

        if(this.updatedMaintenanceStatusId==2)
          this.closeQuitBreakdownPopup();
        else
          this.closeFixBreakdownPopup();        

      },
      (error: HttpErrorResponse) => {

        this.popupComponent.ShowModal("#modalShowErrorMessage");

        this.baseService.spinner.hide();
        
        this.isWaitingInsertOrUpdate = false;
      }
    );
  }
  

  //ARIZA İPTALİ 
  cancelBreakdown(data: NgForm){
    
    if (data.form.invalid == true) return;
    
    let cloneItem = new Maintenance();
    
    cloneItem.CompletionDescription = data.value.CompletionDescription;
    cloneItem.MaintenanceStatusId = this.fixBreakdown.MaintenanceStatusId;
    cloneItem.MaintenanceListId = this.fixBreakdown.MaintenanceListId;

    this.isWaitingInsertOrUpdate = true;

    this.baseService.spinner.show();

    this.baseService.workOrderService.CancelBreakdown(
      cloneItem,
      (insertedItem: Maintenance, message) => {
        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        // this.resetForm(data);
        
        this.baseService.spinner.hide();

        this.isWaitingInsertOrUpdate = false;

        this.wolComponent.loadWorkOrderList(1,25,1);
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        // this.baseService.popupService.ShowErrorPopup(error);

        this.popupComponent.ShowModal("#modalShowErrorMessage");

        this.baseService.spinner.hide();
        
        this.isWaitingInsertOrUpdate = false;
      }
    );
    this.closeCancelBreakdownPopup();
  }

 
  GetUserStatusByMaintenanceId(maintenanceListId: number){

      this.baseService.workOrderService.GetUserStatusByMaintenanceId(
        maintenanceListId,
        (maintenanceUser: MaintenanceUser) => {
            this.maintenanceStatusId = maintenanceUser.MaintinanceStatuId;
          },
        (error: HttpErrorResponse) => {
          this.maintenanceStatusId = 1          
        }
      );
  }

  GetMaintenanceRequestPicturesByMaintenanceId(maintenanceListId: number){

    this.baseService.workOrderService.GetMaintenanceRequestPicturesByMaintenanceId(
      maintenanceListId,
      (maintenanceRequestPictures: MaintenanceRequestPicture[]) => {

        let path="UploadFiles/ThumbImages/thumb_";
        this.requestImageArray= [];
        for (var i = 0; i < maintenanceRequestPictures.length; i++) {
           
            let requestPic: MaintenanceRequestPicture = new MaintenanceRequestPicture;
            requestPic.Picture=IMAGE_URL + path + this.fixBreakdown.MaintenanceRequestPictures[i].Picture;
            this.requestImageArray.push(requestPic.Picture);        
          }
      },
      (error: HttpErrorResponse) => {
        // this.baseService.popupService.ShowErrorPopup(error);
      }
    );
}


  clearPictures() {
    this.maintenancePictures = [];
    this.maintenance.MaintenanceRequestPictures = null;
  }

  changeFile(event: any): void {

    this.isMoreThanFive=false;
    let maintenanceRequestPicture: MaintenanceRequestPicture[]=[];    

    this.maintenancePictures = event.target.files;
    if(this.maintenancePictures.length <6){
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

  closeFixBreakdownPopup(){
    this.popupComponent.CloseModal('#modalShowQuestionPopupForFixBreakdown');
  }

  closeQuitBreakdownPopup(){
    this.popupComponent.CloseModal('#modalShowQuestionPopupForQuitBreakdown');
  }

  closeCancelBreakdownPopup(){
    this.popupComponent.CloseModal('#modalShowQuestionPopupForCancelBreakdown');
  }

  checkUserMaintenanceStatus(maintenanceStatusId: number){
    this.updatedMaintenanceStatusId=maintenanceStatusId;
    
    if(maintenanceStatusId == 2){
       this.popupComponent.ShowModal('#modalShowQuestionPopupForQuitBreakdown');
    }
  }

  resetForm(data: NgForm) {
    data.resetForm();
    this.maintenancePictures = [];
    // this.fixBreakdown = new Maintenance();
  }
}
