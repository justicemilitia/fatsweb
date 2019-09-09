import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { BaseService } from 'src/app/services/base.service';
import { BaseComponent } from 'src/app/components/base/base.component';
import { FixedAssetCardProperty } from 'src/app/models/FixedAssetCardProperty';
import { HttpErrorResponse } from '@angular/common/http';
import { PropertyValueTypes } from 'src/app/declarations/property-value-types.enum';
import { FixedAssetCardPropertyValue } from 'src/app/models/FixedAssetCardPropertyValue';
import { FixedAssetPropertyDetails } from 'src/app/models/FixedAssetPropertyDetails';
import { FaCreateComponent } from '../fa-create.component';
import { FixedAsset } from 'src/app/models/FixedAsset';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-fa-property-information',
  templateUrl: './fa-property-information.component.html',
  styleUrls: ['./fa-property-information.component.css']
})
export class FaPropertyInformationComponent extends BaseComponent implements OnInit {

   @Input() faCreate:FaCreateComponent; 

   @Output('reset') reset : EventEmitter<any> = new EventEmitter();

  
    fixedassetproperty: FixedAssetCardProperty[] = [];
    fixedassetpropertyvalues: FixedAssetCardPropertyValue[] = [];
    faPropertyDetails: FixedAssetPropertyDetails[] = [];

    fixedAsset:FixedAsset=new FixedAsset();
    fixedAssetProperty: FixedAssetCardProperty = new FixedAssetCardProperty();
    fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();
    fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();

    isSelectedProperty: boolean = false;
    visible: boolean = false;
    isListSelected:boolean=false;
    sameProperty:boolean = false;
    differentProperty:boolean = false;
    visiblePropertyName=false;
    isUniqueProperty:boolean=false;
    result:boolean=false;
    FixedAssetPicture:string;


    propertyValue: string;

    public imagePath;
    imgURL: any;
    imageFile: any;
    fileBarcode: any;

    /* Fixed Asset Card Property Value Data Table */
    public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
      "fixedassetcardpropertyvalue",
      [
        {
          columnDisplayName:  this.getLanguageValue('Fixed_Asset_Card_Property_Name'),
          columnName: ["FixedAssetCardProperty", "Name"],
          isActive: true,
          classes: [],
          placeholder: "",
          type: "text"
        },
        {
          columnDisplayName:  this.getLanguageValue('Fixed_Asset_Card_Property_Value'),
          columnName: ["Value"],
          isActive: true,
          classes: [],
          placeholder: "",
          type: "text"
        }
      ],
      {
        isDesc: false,
        column: ["Value"]
      }
    );
    
  constructor(protected baseService: BaseService) {

    super(baseService);

    this.loadDropdown();

    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isDeleteable = true;
   }

  ngOnInit() {
  }

 async loadDropdown() {
  this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
    (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
      this.fixedassetproperty = fixedAssetCardProperties;
    },
    (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    }
  );
 }

 async loadFixedAssetProperties() {
  this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
    (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
      this.fixedassetproperty = fixedAssetCardProperties;
    },
    (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    }
  );
}

async loadValuesByPropertyId(event) {
  this.fixedAssetPropertyDetail.Value=null;

  this.isSelectedProperty = true;

  this.visible = false;

  this.isUniqueProperty = false;

  let fixedAssetProperty = this.fixedassetproperty.find(
    x => x.FixedAssetCardPropertyId == Number(event.target.value)
  );

  if (fixedAssetProperty.FixedAssetTypeId == PropertyValueTypes.Liste) {
    this.isListSelected = true;
    this.baseService.fixedAssetCardPropertyService.GetFixedAssetPropertyValueByPropertyId(
      <number>event.target.value,
      (propertyValues: FixedAssetCardPropertyValue[]) => {
        this.fixedassetpropertyvalues = propertyValues;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  } else {
    this.isListSelected = false;
  }

}

getPropertyValue(event: any) {

  this.visible = false;

  this.fixedAssetPropertyDetail.Value = event.target.value;;
}

insertPropertyValueToArray(propertyId: any) {


  if(this.fixedAssetPropertyDetail.FixedAssetCardPropertyId == null)
    this.fixedassetpropertyvalues = [];

  this.faPropertyDetails = <FixedAssetPropertyDetails[]>(this.dataTablePropertyValue.TGT_copySource());

  if(this.isListSelected==false) 
  this.propertyValue = this.fixedAssetPropertyDetail.Value;

  if(this.sameProperty == true)
  {
  this.sameProperty = false;
  return;
  }

  this.faPropertyDetails.forEach(e=>{

    if(e.FixedAssetCardPropertyId == this.fixedAssetPropertyDetail.FixedAssetCardPropertyId && e.Value == this.propertyValue)     
    this.sameProperty = true;
    else
    this.sameProperty = false;
  });

  if(this.fixedAssetPropertyDetail.FixedAssetCardPropertyId != null){
    this.visiblePropertyName=false;

    if(this.fixedAssetPropertyDetail.Value != null || this.fixedAssetCardPropertyValue.FixedAssetPropertyValueId != null){
      

      if(!this.isUniqueProperty){

        let fixedasset = this.fixedassetproperty.find(
          x => x.FixedAssetCardPropertyId == Number(propertyId.value)
        );
  
        this.fixedAssetPropertyDetail.FixedAssetPropertyDetailId =
          (this.faPropertyDetails.length + 1) * -1;
  
        this.fixedAssetPropertyDetail.FixedAssetCardProperty = fixedasset;
  
        if (this.isListSelected == true)
          this.fixedAssetPropertyDetail.Value = this.propertyValue;
  
        this.faPropertyDetails.push(this.fixedAssetPropertyDetail);
  
        this.dataTablePropertyValue.TGT_loadData(this.faPropertyDetails);
  
        this.fixedAssetPropertyDetail = new FixedAssetPropertyDetails();
  
        this.fixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
  
        propertyId = null;
        
        this.visible = false;
  
        this.isSelectedProperty = false;
      }
      else return;
    }
    else{
      this.visiblePropertyName=true;  
    }
  }else{
    this.visible=true;
  
    this.visiblePropertyName=true;    
  }
}

insertPropertyValueToArrayUniqueControl(propertyId: any){
  this.baseService.fixedAssetCreateService.CheckFixedAssetPropertyUnique(this.fixedAssetPropertyDetail,
    (result:boolean)=>{    
      if(result){  
      this.isUniqueProperty=false;    
      this.insertPropertyValueToArray(propertyId);  
    }
    else
      this.isUniqueProperty=true;
    },(error:HttpErrorResponse) => {  
      this.baseService.popupService.ShowErrorPopup(error);
      this.isUniqueProperty=true;
    });
}

onSubmit(data:NgForm){

  let propertyDetail = <FixedAssetPropertyDetails[]>(this.dataTablePropertyValue.TGT_copySource());

  this.fixedAsset.FixedAssetPropertyDetails = propertyDetail;

  this.fixedAsset.Picture = this.FixedAssetPicture;

  this.faCreate.addFaPropertyInformation(this.fixedAsset, data);

}

nextTab(){
 this.faCreate.nextTab();
}

previousTab(){
 this.faCreate.previous();
}

async addImageFile(imageFile) {

  this.baseService.fileUploadService.ImageUpload(
    imageFile,
    result => {
      this.FixedAssetPicture = result;
      //console.log(this.picture);
      console.log(this.FixedAssetPicture);
    },
    (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    }
  );

  var reader = new FileReader();
  reader.readAsDataURL(imageFile[0]);
  reader.onload = _event => (this.imgURL = reader.result.toString());
}

clearFiles() {
  this.imgURL = null;
}

resetForm(){
 this.reset.emit();

  this.fixedAsset = new FixedAsset();

  this.dataTablePropertyValue.TGT_clearData();

  this.imgURL = null;

  this.sameProperty=false;
}

}
