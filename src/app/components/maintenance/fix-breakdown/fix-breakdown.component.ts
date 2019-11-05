import { Component, OnInit, Input } from '@angular/core';
import { FixedAsset } from '../../../models/FixedAsset';
import { WorkOrderListComponent } from '../work-order-list/work-order-list.component';
import { BaseService } from '../../../services/base.service';
import { BaseComponent } from '../../base/base.component';
import { Maintenance } from '../../../models/Maintenance';
import { NgForm } from '@angular/forms';
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';
import { MaintenanceRequestPicture } from '../../../models/MaintenanceRequestPicture';
import { NumberSymbol } from '@angular/common';

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
    // this.url="https://static8.depositphotos.com/1394326/866/i/950/depositphotos_8665977-stock-photo-bleeding-rose.jpg";
    
    // this.imageArray.push(this.url);
    // this.imageArray.push(this.url);
    // this.imageArray.push(this.url);
  }
  ngOnInit() {
  }

  onSubmit(data: NgForm) {

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
