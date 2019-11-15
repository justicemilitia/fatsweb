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

@Component({
  selector: 'app-fix-breakdown',
  templateUrl: './fix-breakdown.component.html',
  styleUrls: ['./fix-breakdown.component.css']
})
export class FixBreakdownComponent extends BaseComponent implements OnInit {

  @Input() fixBreakdown: Maintenance = new Maintenance();
  @Input() wolComponent: WorkOrderListComponent;
  
  maintenance: Maintenance = new Maintenance();  

  maintenanceNumber: string;
  maintenancePictures: any[]=[];
  fileMessage: string = '';
  isMoreThanFive: boolean=false;
  dtFileLength: number;
  imageArray: any[]=[];
  maintenanceUsers: string = '';
  isCancelled: boolean= true;

  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;

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

    console.log(this.fixBreakdown);
    Object.assign(this.imageArray, this.fixBreakdown.MaintenanceRequestPictures);    
  }
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["fixBreakdown"].currentValue != changes["fixBreakdown"].previousValue) {

      let path="UploadFiles/ThumbImages/thumb_";
      this.imageArray= [];
      this.maintenanceUsers= '';
      for (var i = 0; i < this.fixBreakdown.MaintenanceRequestPictures.length; i++) {
         
          let requestPic: MaintenanceRequestPicture = new MaintenanceRequestPicture;
          requestPic.Picture=IMAGE_URL + path + this.fixBreakdown.MaintenanceRequestPictures[i].Picture;
          this.imageArray.push(requestPic.Picture);        
        }

        this.fixBreakdown.MaintinanceUsers.forEach((e, i) => {
          this.maintenanceUsers += e.User == null ? '' : (e.User.FirstName + ' ' + e.User.LastName) + (i == this.fixBreakdown.MaintinanceUsers.length - 1 ? "" : ", ");
        });
    }
  }

  onSubmit(data: NgForm) {

    this.dtFileLength =this.dataTableFile.TGT_selectAllItems().length;
    if (data.form.invalid == true && this.dtFileLength>5) return;

      this.popupComponent.ShowModal('#modalShowQuestionPopupForFixBreakdown');
  }
  fixBreakdownWithFileUpload(isCancelled: boolean){

  }
  
  clearPictures() {
    this.maintenancePictures = [];
    this.maintenance.MaintenanceRequestPictures = null;
  }

  changeFile(event: any): void {
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

}
