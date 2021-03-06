import {
  Component,
  OnInit,
  Input,
  NgModule,
  AfterViewInit
} from "@angular/core";
import { BaseComponent } from "../../../base/base.component";
import * as $ from "jquery";
import { Department } from "../../../../models/Department";
import { Company } from "../../../../models/Company";
import { FixedAssetStatus } from "../../../../models/FixedAssetStatus";
import { FixedAssetCardBrand } from "../../../../models/FixedAssetCardBrand";
import { FixedAssetCardModel } from "src/app/models/FixedAssetCardModel";
import { User } from "../../../../models/LoginUser";
import { ExpenseCenter } from "../../../../models/ExpenseCenter";
import { BaseService } from "../../../../services/base.service";
import { Firm } from "../../../../models/Firm";
import { HttpErrorResponse } from "@angular/common/http";
import { FixedAsset } from "../../../../models/FixedAsset";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { TreeGridTable } from "../../../../extends/TreeGridTable/modules/TreeGridTable";
import { FirmService } from "../../../../services/firm-service/firm.service";
import { convertNgbDateToDateString } from "../../../../declarations/extends";
import { FixedAssetComponent } from "../fixed-asset.component";
import { FixedAssetCardPropertyValue } from "src/app/models/FixedAssetCardPropertyValue";
import { FixedAssetPropertyDetails } from "src/app/models/FixedAssetPropertyDetails";
import { FixedAssetCardCategory } from "src/app/models/FixedAssetCardCategory";
import { FixedAssetCard } from "src/app/models/FixedAssetCard";
import { Currency } from "src/app/models/Currency";
import { FixedAssetCardProperty } from "src/app/models/FixedAssetCardProperty";
import { PropertyValueTypes } from "src/app/declarations/property-value-types.enum";

@Component({
  selector: "app-fa-change-collective-parameter",
  templateUrl: "./fa-change-collective-parameter.component.html",
  styleUrls: ["./fa-change-collective-parameter.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaChangeCollectiveParameterComponent],
  providers: [FaChangeCollectiveParameterComponent]
})
export class FaChangeCollectiveParameterComponent extends BaseComponent
  implements OnInit {
  @Input() faBarcode: FixedAsset = new FixedAsset();
  @Input() faDataTable: TreeGridTable;
  @Input() faComponent: FixedAssetComponent;

  firmId: number;
  propertyValue: string;
  isListSelected: boolean = false;
  selectFixedAssetCard: boolean = false;
  selectedFirm: boolean = false;
  selectedDepartment: boolean = false;
  visible: boolean = false;
  sameProperty:boolean = false;
  visiblePropertyName:boolean = false;

  imgURL: any;
  imageFile: any;
  fileBarcode: any;
  picture: any;

  firms: Firm[] = [];
  companies: Company[] = [];
  departments: Department[] = [];
  locations: Location[] = [];
  currencies: Currency[] = [];
  brands: FixedAssetCardBrand[] = [];
  models: FixedAssetCardModel[] = [];
  expensecenters: ExpenseCenter[] = [];
  statuses: FixedAssetStatus[] = [];
  fixedassetproperty: FixedAssetCardProperty[] = [];
  fixedassetcategories: FixedAssetCardCategory[] = [];
  faPropertyDetails: FixedAssetPropertyDetails[] = [];
  fixedassetpropertyvalues: FixedAssetCardPropertyValue[] = [];
  fixedassetcards: FixedAssetCard[] = [];

  fixedAsset: FixedAsset = new FixedAsset();
  fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();

  /* Fixed Asset Card Property Value Data Table */
  public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
    "fixedassetcardpropertyvalue",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Property_Name'),
        columnName: ["FixedAssetCardProperty", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Property_Value'),
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
    this.loadDropdownList();
    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isDeleteable = true;
    this.dataTablePropertyValue.isFilterActive = false;
    this.fixedAsset.IsActive = null;
  }

  ngOnInit() {}

  //#region Load Dropdowns
  loadDropdownList() {
    // FirmList
    this.baseService.userService.GetFirms(
      (firms: Firm[]) => {
        this.firms = firms;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    // CompanyList
    this.baseService.companyService.GetCompanies(
      (companies: Company[]) => {
        this.companies = companies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    // LocationList
    this.baseService.locationService.GetLocations(
      (locations: Location[]) => {
        this.locations = locations;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

     // LocationList
     this.baseService.departmentService.GetDepartments(
      (departments: Department[]) => {
        this.departments = departments;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    // ExpenseCenterList
    this.baseService.expenseCenterService.GetExpenseCenters(
      (expCenters: ExpenseCenter[]) => {
        this.expensecenters = expCenters;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    // StatusList
    this.baseService.fixedAssetStatusService.GetStatus(
      (statuses: FixedAssetStatus[]) => {
        this.statuses = statuses;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    // BrandList
    this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
      (brands: FixedAssetCardBrand[]) => {
        this.brands = brands;
      },
      (error: HttpErrorResponse) => {}
    );

    // CurrencyList
    this.baseService.currencyService.GetCurrencies(
      (currencies: Currency[]) => {
        this.currencies = currencies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    //FixedAssetCategoryList
    if (this.fixedassetcategories && this.fixedassetcategories.length == 0) {
      this.fixedassetcards = [];

      this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
        (categories: FixedAssetCardCategory[]) => {
          this.fixedassetcategories = categories;
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }

    //FixedAssetPropertyList
    this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
      (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
        this.fixedassetproperty = fixedAssetCardProperties;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadModelByBrandId(event: any) {
    this.models = [];

    if (!event.target.value || event.target.value == "") {
      this.fixedAsset.FixedAssetCardModelId = null;
      this.fixedAsset.FixedAssetCardModel = new FixedAssetCardModel();
      return;
    }

    if (event.target.value) {
      this.baseService.fixedAssetCardModelService.GetFixedAssetsCardModelsByBrandId(
        <number>event.target.value,
        (models: FixedAssetCardModel[]) => {
          this.models = models;
        },
        (error: HttpErrorResponse) => {
          
        }
      );
    }
  }

  loadFaCardByCategoryId(event: any) {
    this.fixedassetcards = [];
    this.selectFixedAssetCard = true;

    if (!event.target.value || event.target.value == "") {
      this.fixedAsset.FixedAssetCardId = null;
      this.fixedAsset.FixedAssetCard = new FixedAssetCard();
      return;
    }

    if (event.target.value) {
      this.baseService.fixedAssetCardService.GetFixedAssetCardByCategoryId(
        <number>event.target.value,
        (fixedAssetCards: FixedAssetCard[]) => {
          this.fixedassetcards = fixedAssetCards;
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }
  }

  loadDropdownListByFirmId() {
    this.baseService.locationService.GetLocationsByFirmId(
      this.firmId,
      locations => {
        this.locations = locations;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadFixedAssetProperties() {
    this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
      (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
        this.fixedassetproperty = fixedAssetCardProperties;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadValuesByPropertyId(event) {

    this.fixedassetpropertyvalues=[];

    this.fixedAssetPropertyDetail.Value = null;

    this.fixedAssetCardPropertyValue.FixedAssetPropertyValueId=null;

    this.propertyValue=null;

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
  //#endregion

  getFirmId(event) {
    if (event.target.value) {
      this.firmId = Number(event.target.value);
      this.loadDropdownListByFirmId();
      this.selectedFirm = true;
    }
  }

  getPropertyValue(event: any) {

    this.visible = false;

    if(event.target.selectedIndex == 0){
      this.propertyValue = null;
      this.fixedAssetPropertyDetail.Value = null;
    }    
    else{
      this.propertyValue = event.target.value;    
      this.fixedAssetPropertyDetail.Value = event.target.value;
      this.visiblePropertyName=false;
    }  
  }

  async insertPropertyValueToArray(propertyId: any) {
    this.faPropertyDetails = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

    if(this.isListSelected==false) 
    this.propertyValue = this.fixedAssetPropertyDetail.Value;
  
    this.faPropertyDetails.forEach(e=>{
  
      if(e.FixedAssetCardPropertyId == this.fixedAssetPropertyDetail.FixedAssetCardPropertyId && e.Value == this.propertyValue)     
      this.sameProperty = true;
    });  
  
    if(this.sameProperty == true)
    {
      this.sameProperty = false;
      return;
    }

    if(this.fixedAssetPropertyDetail.FixedAssetCardPropertyId != null){

      this.visiblePropertyName=false;

      if(this.fixedAssetPropertyDetail.Value != null || this.fixedAssetCardPropertyValue.FixedAssetPropertyValueId != null){

        this.fixedAssetPropertyDetail.FixedAssetPropertyDetailId = (this.faPropertyDetails.length + 1) * -1;

        let fixedasset = this.fixedassetproperty.find(x => x.FixedAssetCardPropertyId == Number(propertyId.value)
        );

        this.fixedAssetPropertyDetail.FixedAssetCardProperty = fixedasset;

        if (this.isListSelected == true) 
            this.fixedAssetPropertyDetail.Value = this.propertyValue;

        this.faPropertyDetails.push(this.fixedAssetPropertyDetail);

        this.dataTablePropertyValue.TGT_loadData(this.faPropertyDetails);

        this.fixedAssetPropertyDetail = new FixedAssetPropertyDetails();

        propertyId = null;        
      }
      else{
        this.visiblePropertyName = true;  
      }
    }
    else{
      this.visible=true;
      this.visiblePropertyName=true;    
    }
  }

  ChangeCollectiveParameter(data: NgForm) {
    console.log(this.fixedAsset);

    let fixedAssetIds: number[] = [];
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    this.fixedAsset.FixedAssetIds = (<FixedAsset[]>(
      this.faDataTable.TGT_getSelectedItems()
    )).map(x => x.FixedAssetId);

    let propertyDetail = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

    this.fixedAsset.FirmId =
      this.fixedAsset.FirmId == null ? null : Number(data.value.FirmId);
    this.fixedAsset.InsuranceCompanyId =
      this.fixedAsset.InsuranceCompanyId == null
        ? null
        : Number(data.value.InsuranceCompanyId);

    this.fixedAsset.DepartmentId =
      this.fixedAsset.DepartmentId == null
        ? null
        : Number(data.value.DepartmentId);

    this.fixedAsset.LocationId =
      this.fixedAsset.LocationId == null ? null : Number(data.value.LocationId);
    this.fixedAsset.FixedAssetCardBrandId =
      this.fixedAsset.FixedAssetCardBrandId == null
        ? null
        : Number(data.value.FixedAssetCardBrandId);
    this.fixedAsset.FixedAssetCardModelId =
      this.fixedAsset.FixedAssetCardModelId == null
        ? null
        : Number(data.value.FixedAssetCardModelId);
    this.fixedAsset.CompanyId =
      this.fixedAsset.CompanyId == null ? null : Number(data.value.CompanyId);
    this.fixedAsset.ExpenseCenterId =
      this.fixedAsset.ExpenseCenterId == null ? null : Number(data.value.ExpenseCenterId);
    this.fixedAsset.InvoiceDate = this.fixedAsset.InvoiceDate == null ? null : convertNgbDateToDateString(data.value.invoiceDate);
    this.fixedAsset.InvoiceNo = data.value.InvoiceNo;
    this.fixedAsset.GuaranteeStartDate =
      this.fixedAsset.GuaranteeStartDate == null ? null : convertNgbDateToDateString(data.value.guaranteeStartDate);
    this.fixedAsset.GuaranteeEndDate = this.fixedAsset.GuaranteeEndDate == null ? null : convertNgbDateToDateString(data.value.guaranteeEndDate);
    this.fixedAsset.StatusId =
      this.fixedAsset.StatusId == null ? null : Number(data.value.StatusId);
    this.fixedAsset.FixedAssetCardCategoryId =
      this.fixedAsset.FixedAssetCardCategoryId == null
        ? null
        : Number(data.value.FixedAssetCardCategoryId);
    this.fixedAsset.FixedAssetCardId =
      this.fixedAsset.FixedAssetCardId == null
        ? null
        : Number(data.value.FixedAssetCardId);
    this.fixedAsset.SerialNumber =
      this.fixedAsset.SerialNumber == null ? null : data.value.SerialNumber;
    this.fixedAsset.IsActive =
      this.fixedAsset.IsActive == null ? null : Boolean(data.value.IsActive);
    this.fixedAsset.ActivationDate =
      this.fixedAsset.ActivationDate == null
        ? null
        : convertNgbDateToDateString(data.value.activationDate);
    this.fixedAsset.Price = data.value.Price;
    this.fixedAsset.CurrencyId =
      this.fixedAsset.CurrencyId == null ? null : Number(data.value.CurrencyId);
    this.fixedAsset.ReceiptDate =
      this.fixedAsset.ReceiptDate == null
        ? null
        : convertNgbDateToDateString(data.value.receiptDate);
    this.fixedAsset.Picture = data.value.Picture;
    this.fixedAsset.FixedAssetPropertyDetails = propertyDetail;
    this.fixedAsset.Picture = this.picture;

    let cloneItem = new FixedAsset();
    Object.assign(cloneItem, this.fixedAsset);

    this.baseService.spinner.show();

    this.baseService.fixedAssetService.ChangeCollectiveParameter(
      cloneItem,
      (insertedItem: FixedAsset, message) => {
        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        this.baseService.spinner.hide();

        this.faComponent.loadFixedAsset();
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
 
        this.baseService.spinner.hide();

        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.resetForm(data, true);
  }

  selectedFixedAssetCard(event) {
    this.selectFixedAssetCard = false;
  }

  selectDepartment(event) {
    this.selectedDepartment = true;
    if (!event.target.value || event.target.value == "") {
      return;
    }
  }

  isActivate(item: boolean) {
    if (item == true) this.fixedAsset.IsActive = true;
    if (item == false) this.fixedAsset.IsActive = false;
  }

  addImageFile(imageFile) {
    this.baseService.fileUploadService.ImageUpload(
      imageFile,
      result => {
        this.picture = result;
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

  resetForm(data: NgForm, isNewItem: boolean) {
    if (isNewItem == true) {
      this.fixedAsset = new FixedAsset();
      this.dataTablePropertyValue.TGT_clearData();
      this.imgURL = null;
    }
    data.resetForm(this.fixedAsset);
  }
}
