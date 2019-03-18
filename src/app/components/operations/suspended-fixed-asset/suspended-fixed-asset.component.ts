import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { BaseService } from 'src/app/services/base.service';
import { FixedAsset } from 'src/app/models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-suspended-fixed-asset',
  templateUrl: './suspended-fixed-asset.component.html',
  styleUrls: ['./suspended-fixed-asset.component.css']
})
export class SuspendedFixedAssetComponent extends BaseComponent implements OnInit {

  suspendedList:FixedAsset[]=[];

  suspended:FixedAsset=new FixedAsset();

  barcodes:[]=[];
  public dataTable: TreeGridTable = new TreeGridTable(
    "suspendedfixedasset",
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
        columnDisplayName: "Demirbaş Adı",
        columnName: ["FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },      
      {
        columnDisplayName: "Departman",
        columnName: ["Department","Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },      
      {
        columnDisplayName: "Lokasyon",
        columnName: ["Location","Name"],
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
  
  constructor(protected baseService:BaseService) {
    super(baseService);
    this.loadSuspendedList();
   }

  ngOnInit() {
  }

    loadSuspendedList(){
      this.baseService.suspendedService.GetFixedAssetsSuspendedList(
        (suspended:FixedAsset[])=>{
          this.suspendedList=suspended;
          this.dataTable.TGT_loadData(this.suspendedList);
        },
        (error:HttpErrorResponse)=>{
          this.baseService.popupService.ShowErrorPopup(error);
        });
    }

    undoSuspendedFixedAsset(){
      
      let selectedItems=this.dataTable.TGT_getSelectedItems();

      if (!selectedItems || selectedItems.length == 0) {
        this.baseService.popupService.ShowAlertPopup(
          "Lütfen en az bir demirbaş seçiniz"
        );
        return;
      }

      let itemIds: number[] = selectedItems.map(x => x.getId());



    }




}
