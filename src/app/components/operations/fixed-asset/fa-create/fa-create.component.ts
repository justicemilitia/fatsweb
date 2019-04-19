import {Component, OnInit, AfterViewInit, Directive, NgModule, ViewChild, Input } from "@angular/core";
import { BaseService } from "src/app/services/base.service";
import { BaseComponent } from "src/app/components/base/base.component";
import { Department } from "src/app/models/Department";
import { HttpErrorResponse } from "@angular/common/http";
import { Company } from "src/app/models/Company";
import { Location } from "src/app/models/Location";
import { FixedAssetStatus } from "src/app/models/FixedAssetStatus";
import { FixedAssetCardBrand } from "src/app/models/FixedAssetCardBrand";
import { FixedAssetCardModel } from "src/app/models/FixedAssetCardModel";
import { FixedAssetCardCategory } from "src/app/models/FixedAssetCardCategory";
import { FixedAssetCard } from "src/app/models/FixedAssetCard";
import { User } from "src/app/models/User";
import { FixedAsset } from "src/app/models/FixedAsset";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { ExpenseCenter } from "src/app/models/ExpenseCenter";
import { FixedAssetCardProperty } from "src/app/models/FixedAssetCardProperty";
import { FixedAssetPropertyDetails } from "src/app/models/FixedAssetPropertyDetails";
import { PropertyValueTypes } from "src/app/declarations/property-value-types.enum";
import { FixedAssetCardPropertyValue } from "src/app/models/FixedAssetCardPropertyValue";
import { Currency } from "src/app/models/Currency";
import * as $ from "jquery";
import { FixedAssetFile } from "src/app/models/FixedAssetFile";
import { Depreciation } from "src/app/models/Depreciation";

import { HttpClient } from "@angular/common/http";
import { FileUploader } from "ng2-file-upload";
import { NgForm, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { convertNgbDateToDateString } from "src/app/declarations/extends";
import { MatStepper } from "@angular/material";
import { FixedAssetComponent } from "../fixed-asset.component";

const URL = "";

@Component({
  selector: "app-fa-create",
  templateUrl: "./fa-create.component.html",
  styleUrls: ["./fa-create.component.css"]
})

@Directive({ selector: "[ng2FileSelect]" })
@Directive({ selector: "[ng2FileDrop]" })

@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaCreateComponent],
  providers: [FaCreateComponent]
})

export class FaCreateComponent extends BaseComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    $(".select2").trigger("click");
  }

  isFinished:boolean=false;
  isWaitingValidBarcode: boolean = false;
  isLinear = false;
  isSelectedProperty:boolean=false;
  visible:boolean = false;
  fixedAssetForm: FormGroup;
  departments: Department[] = [];
  companies: Company[] = [];
  locations: Location[] = [];
  statuses: FixedAssetStatus[] = [];
  brands: FixedAssetCardBrand[] = [];
  models: FixedAssetCardModel[] = [];
  fixedassetcategories: FixedAssetCardCategory[] = [];
  fixedassetcards: FixedAssetCard[] = [];
  staffs: User[] = [];
  expensecenters: ExpenseCenter[] = [];
  fixedassetproperty: FixedAssetCardProperty[] = [];
  fixedassetpropertyvalues: FixedAssetCardPropertyValue[] = [];
  ifrscurrencies: Currency[] = [];
  currencies: Currency[] = [];
  faPropertyDetails: FixedAssetPropertyDetails[] = [];
  depreciationTypes: Depreciation[] = [];
  fixedAssets: FixedAsset[] = [];
  propertydetail: FixedAssetPropertyDetails[] = [];
  fixedAssetFiles:FixedAssetFile[]=[];
  fixedAssetFilesDataTable: FixedAssetFile[] = [];


  fixedAsset: FixedAsset = new FixedAsset();
  fixedAssetProperty: FixedAssetCardProperty = new FixedAssetCardProperty();
  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();
  fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
  fixedAssetFile: FixedAssetFile = new FixedAssetFile();

  propertyValue: string;
  BarcodeIsUnique: boolean = true;
  disabledBarcode: boolean = true;
  errorMessage: string = "";
  isListSelected: boolean = false;
  barcode: number;
  quantity: number;
  validBarcode = false;
  editable: boolean = true;
  visibleInsertButton: boolean = false;
  isResetForm: boolean = false;
  picture:any;

  @Input() faComponent: FixedAssetComponent;
  @ViewChild("stepper") stepper: MatStepper;

  public imagePath;
  imgURL: any;
  imageFile: any;
  fileBarcode: any;
  insertedFixedAsset = new FixedAsset();

  /*Fixed Asset List */
  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedasset",
    [
      {
        columnDisplayName: "Barkod",
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        isEditable: true
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
        columnDisplayName: "Departman Adı",
        columnName: ["Department", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Adı",
        columnName: ["Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Fiyat",
        columnName: ["Price"],
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

  /* Fixed Asset Card Property Value Data Table */
  public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
    "fixedassetcardpropertyvalue",
    [
      {
        columnDisplayName: "Özellik Adı",
        columnName: ["FixedAssetCardProperty", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Özellik Değeri",
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

  public dataTableFile: TreeGridTable = new TreeGridTable(
    "fixedassetfile",
    [
      {
        columnDisplayName: "Dosya adı",
        columnName: ["FileName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["FileName"]
    }
  );

  constructor(
    protected baseService: BaseService,
    public HttpClient: HttpClient // private _formBuilder: FormBuilder
  ) {
    super(baseService);
    this.loadDropdown();
    this.getValidBarcode();
    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isDeleteable = true;
    this.dataTable.isPagingActive = false;
    this.dataTable.isColumnOffsetActive = false;
    this.dataTable.isDeleteable = true;
    this.dataTable.isTableEditable = true;
    this.dataTableFile.isPagingActive = false;
    this.dataTableFile.isColumnOffsetActive = false;
    this.dataTableFile.isDeleteable = true;
    this.dataTableFile.isMultipleSelectedActive = false;
    this.dataTableFile.isLoading = false;
  }

  ngOnInit() {}

  next() {
    if (this.fixedAsset.FixedAssetCardId != null && this.fixedAsset.FixedAssetCardCategoryId != null 
      && this.fixedAsset.LocationId != null && this.fixedAsset.StatusId != null && this.fixedAsset.Barcode != null) {
      this.stepper.next();
    } else return;
  }

  nextDataTable(){
    if (this.fixedAsset.ActivationDate != null) {
      this.isFinished=true;
      this.stepper.next();
    } else return;
  }

//#region Load Dropdown

  loadDropdown() {

    this.baseService.companyService.GetCompanies(
      (companies: Company[]) => {
        this.companies = companies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.locationService.GetLocations(
      (locations: Location[]) => {
        this.locations = locations;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.fixedAssetStatusService.GetStatus(
      (statuses: FixedAssetStatus[]) => {
        this.statuses = statuses;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.userService.GetUsers(
      (users: User[]) => {
        this.staffs = users;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.expenseCenterService.GetExpenseCenters(
      (expCenters: ExpenseCenter[]) => {
        this.expensecenters = expCenters;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.currencyService.GetCurrencies(
      (currencies: Currency[]) => {
        this.currencies = currencies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.currencyService.GetCurrencies(
      (ifrscurrencies: Currency[]) => {
        this.ifrscurrencies = ifrscurrencies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.depreciationService.GetDepreciationCalculationTypes(
      (depreciationTypes: Depreciation[]) => {
        this.depreciationTypes = depreciationTypes;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

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

    if (this.brands && this.brands.length == 0) {
      this.models = [];

      this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
        (brands: FixedAssetCardBrand[]) => {
          this.brands = brands;
        },
        (error: HttpErrorResponse) => {}
      );
    }

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
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }
  }

  loadFaCardByCategoryId(event: any) {
    this.fixedassetcards = [];

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

    this.isSelectedProperty=true;
    this.visible=false;
    let fixedAssetProperty = this.fixedassetproperty.find(
      x => x.FixedAssetCardPropertyId == Number(event.target.value)
    );

    if (fixedAssetProperty.FixedAssetTypeId == PropertyValueTypes.Liste) {

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

  loadDepartmentByLocationId(event: any) {
    this.departments = [];

    if (!event.target.value || event.target.value == "") {
      this.fixedAsset.DepartmentId = null;
      this.fixedAsset.Department = new Department();
      return;
    }

    if (event.target.value) {
      this.baseService.departmentService.GetDepartmentsByLocationId(
        <number>event.target.value,
        (departments: Department[]) => {
          this.departments = departments;
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }
  }

  //#endregion

//#region Barcode control
  isBarcodeUnique(barcode: string) {
    if (barcode == "") return;

    this.baseService.fixedAssetCreateService.isBarcodeUnique(
      barcode,
      result => {
        this.BarcodeIsUnique = false;
        this.errorMessage = "";
      },
      (error: HttpErrorResponse) => {
        this.BarcodeIsUnique = true;
        this.errorMessage = error.statusText;
      }
    );
  }

  isBarcodeManual(event) {
    if (event.target.checked == true) {
      this.disabledBarcode = false;
      this.barcode = null;
    } else {
      this.disabledBarcode = true;
      this.getValidBarcode();
    }
  }

  getValidBarcode() {
    this.isWaitingValidBarcode = true;

    this.baseService.fixedAssetCreateService.GetValidBarcodeLastNumber(
      barcode => {
        this.isWaitingValidBarcode = false;
        this.barcode = barcode;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

//#endregion
 
  getPropertyValue(event: any) {
      this.propertyValue = event.target.value;
      this.visible=false;
  }

  insertPropertyValueToArray(propertyId: any) {


    this.faPropertyDetails = <FixedAssetPropertyDetails[]>(this.dataTablePropertyValue.TGT_copySource());

    if(this.isSelectedProperty==true){
  
    let fixedasset = this.fixedassetproperty.find(x => x.FixedAssetCardPropertyId == Number(propertyId.value));

    this.fixedAssetPropertyDetail.FixedAssetPropertyDetailId = (this.faPropertyDetails.length + 1) * -1;      
    this.fixedAssetPropertyDetail.FixedAssetCardProperty = fixedasset;
    
    if (this.isListSelected == true)
      this.fixedAssetPropertyDetail.Value = this.propertyValue;    
    this.faPropertyDetails.push(this.fixedAssetPropertyDetail);
    
    this.dataTablePropertyValue.TGT_loadData(this.faPropertyDetails);

    this.fixedAssetPropertyDetail = new FixedAssetPropertyDetails();
    propertyId = null;    
    this.visible=false;
    this.isSelectedProperty=false;
    }
    else{
      this.visible=true;
    }
  }

  addImageFile(imageFile) {
    this.baseService.fileUploadService.ImageUpload(
      imageFile,
      (result) => {      
       this.picture=result; 
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    ); 

    var reader = new FileReader();    
    reader.readAsDataURL(imageFile[0]);
    reader.onload = _event => (this.imgURL = reader.result.toString());
  }
 
  clearFiles(){
    this.imgURL = null;
  }

  addToFixedAssetList(data: NgForm) {

    if (this.isResetForm == true) {
      data.resetForm(this.fixedAsset);
    }

    this.dataTable.TGT_clearData();

    if (this.fixedAsset.Quantity == 0 || this.fixedAsset.Quantity == null)
      this.fixedAsset.Quantity = 1;
    this.quantity = this.fixedAsset.Quantity;

    if (this.disabledBarcode == false) this.barcode = data.value.Barcode;

    this.fixedAssets = <FixedAsset[]>this.dataTable.TGT_copySource();

    let department = this.departments.find(x => x.DepartmentId == Number(data.value.DepartmentId));
    let fixedassetcard = this.fixedassetcards.find(x => x.FixedAssetCardId == Number(data.value.FixedAssetCardId));
    let fixedassetcategory = this.fixedassetcategories.find(x => x.FixedAssetCardCategoryId == Number(data.value.FixedAssetCardCategoryId));
    let location = this.locations.find(x => x.LocationId == Number(data.value.LocationId));
    let expensecenter = this.expensecenters.find(x => x.ExpenseCenterId == Number(data.value.ExpenseCenterId));
    
    this.fixedAsset.IsActive = Boolean(data.value.IsActive);
    this.fixedAsset.ActivationDate = data.value.activationDate;
    this.fixedAsset.ExpenseCenter = expensecenter;
    this.fixedAsset.SerialNumber = data.value.SerialNumber;
    this.fixedAsset.FixedAssetCardCategory = fixedassetcategory;
    this.fixedAsset.Location = location;
    this.fixedAsset.Department = department;
    this.fixedAsset.FixedAssetCard = fixedassetcard;
    this.fixedAsset.Price = data.value.Price;
    this.fixedAsset.GuaranteeStartDate = data.value.guaranteeStartDate;
    this.fixedAsset.GuaranteeEndDate = data.value.guaranteeEndDate;
    this.fixedAsset.InvoiceDate = data.value.invoiceDate;
    this.fixedAsset.InvoiceNo = data.value.InvoiceNo;
    this.fixedAsset.ReceiptDate = data.value.receiptDate;

    if(this.isFinished == true){
      for (let i = 0; i < this.quantity; i++) {

        let fixedasset = new FixedAsset();
        fixedasset.Barcode = this.barcode.toString();
    
        fixedasset.FixedAssetId = (this.fixedAssets.length + 1) * -1;
    
        if(this.fixedAsset.Prefix != null)
          this.fixedAsset.Barcode = this.fixedAsset.Prefix + this.barcode.toString();
        else
          this.fixedAsset.Barcode = this.barcode.toString();

          this.barcode = (Number(this.barcode) + 1);

        Object.assign(fixedasset,this.fixedAsset);
        this.fixedAssets.push(fixedasset);

        this.isFinished=false;
      }

    this.dataTable.TGT_loadData(this.fixedAssets);
    }
  }

  toggleValidBarcodes() {
    if (!this.dataTable.dataFilters.willDisplay)
      this.dataTable.dataFilters.willDisplay = true;
    else
      this.dataTable.dataFilters.willDisplay = !this.dataTable.dataFilters
        .willDisplay;
  }

  doAllVisible() {
    this.dataTable.originalSource.forEach((e: FixedAsset) => {
      e.willDisplay = true;
    });
  }

  doItemsHidden(items: string[]) {
    this.dataTable.originalSource.forEach((e: FixedAsset) => {
      if (!items.includes(e.Barcode)) e.willDisplay = false;
    });
  }

  addFixedAsset() {

    this.fixedAssets = <FixedAsset[]>this.dataTable.TGT_copySource();

    this.insertedFixedAsset = this.fixedAssets[0];

    let propertyDetail = <FixedAssetPropertyDetails[]>(this.dataTablePropertyValue.TGT_copySource());

    this.insertedFixedAsset.FixedAssetPropertyDetails = propertyDetail;
    this.insertedFixedAsset.CurrencyId = this.fixedAsset.CurrencyId == null ? null : Number(this.fixedAsset.CurrencyId);
    this.insertedFixedAsset.DepartmentId = this.fixedAsset.DepartmentId == null ? null : Number(this.fixedAsset.DepartmentId);
    this.insertedFixedAsset.LocationId = Number(this.fixedAsset.LocationId);
    this.insertedFixedAsset.FixedAssetCardId = Number(this.fixedAsset.FixedAssetCardId);
    this.insertedFixedAsset.FixedAssetCardCategoryId = Number(this.fixedAsset.FixedAssetCardCategoryId);
    this.insertedFixedAsset.CompanyId = this.fixedAsset.CompanyId == null ? null : Number(this.fixedAsset.CompanyId);
    this.insertedFixedAsset.DepreciationCalculationTypeID = this.fixedAsset.DepreciationCalculationTypeID == null ? null : Number(this.fixedAsset.DepreciationCalculationTypeID);
    this.insertedFixedAsset.ExpenseCenterId = this.fixedAsset.ExpenseCenterId == null ? null : Number(this.fixedAsset.ExpenseCenterId);
    this.insertedFixedAsset.StatusId = this.fixedAsset.StatusId == null ? null : Number(this.fixedAsset.StatusId);
    this.insertedFixedAsset.IFRSCurrecyId = this.fixedAsset.IFRSCurrecyId == null ? null : Number(this.fixedAsset.IFRSCurrecyId);
    this.insertedFixedAsset.UserId = this.fixedAsset.UserId == null ? null : Number(this.fixedAsset.UserId);
    this.insertedFixedAsset.ActivationDate = this.fixedAsset.ActivationDate == null ? null : convertNgbDateToDateString(this.fixedAsset.ActivationDate);
    this.insertedFixedAsset.InvoiceDate = this.fixedAsset.InvoiceDate == null ? null : convertNgbDateToDateString(this.fixedAsset.InvoiceDate);
    this.insertedFixedAsset.ReceiptDate = this.fixedAsset.ReceiptDate == null ? null : convertNgbDateToDateString(this.fixedAsset.ReceiptDate);
    this.insertedFixedAsset.GuaranteeEndDate = this.fixedAsset.GuaranteeEndDate == null ? null : convertNgbDateToDateString(this.fixedAsset.GuaranteeEndDate);
    this.insertedFixedAsset.GuaranteeStartDate = this.fixedAsset.GuaranteeStartDate == null ? null : convertNgbDateToDateString(this.fixedAsset.GuaranteeStartDate);
    this.insertedFixedAsset.IsActive = this.fixedAsset.IsActive;
    this.insertedFixedAsset.FixedAssetCardBrandId = this.fixedAsset.FixedAssetCardBrandId == null ? null : Number(this.fixedAsset.FixedAssetCardBrandId);
    this.insertedFixedAsset.FixedAssetCardModelId = this.fixedAsset.FixedAssetCardModelId == null ? null : Number(this.fixedAsset.FixedAssetCardModelId);

    this.insertedFixedAsset.Picture = this.imgURL;

    let barcodes = this.fixedAssets.map(x => x.Barcode);
    this.insertedFixedAsset.BarcodeIds = <[]>barcodes;
    this.fileBarcode = barcodes;

    this.baseService.fixedAssetCreateService.AddFixedAsset(
      this.insertedFixedAsset,
      (barcodes: [], status, message) => {
        if (status == true) {
          this.editable = false;
          this.dataTable.isTableEditable = false;
          this.visibleInsertButton = true;
          this.dataTable.TGT_clearData();
          this.baseService.popupService.ShowSuccessPopup(message);
          //this.faComponent.loadFixedAsset();
        } else {
          this.validBarcode = true;
          this.doAllVisible();
          this.doItemsHidden(barcodes);
          this.editable = false;
          this.visibleInsertButton = true;
          this.baseService.popupService.ShowErrorPopup(message);
        }
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  resetForm(data: NgForm) {

    this.editable = true;

    this.fixedAsset = new FixedAsset();

    this.stepper.reset();

    data.resetForm(this.fixedAsset);
    
    this.isResetForm = true;

    this.dataTable.TGT_clearData();
    this.dataTableFile.TGT_clearData();
  }

  // #region FILE UPLOAD
  
  public uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  public hasAnotherDropZoneOver: boolean = false;

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }



  public onFileSelected(event) {

    for (var i = 0; i < event.target.files.length; i++) {

      let files:FixedAssetFile=new FixedAssetFile();
      files.FileName=event.target.files[i].name;
      files.FixedAssetFileId=(this.fixedAssetFilesDataTable.length + 1) * -1;
      this.fixedAssetFiles.push(event.target.files[i]);
      this.fixedAssetFilesDataTable.push(files);      
    }

    this.dataTableFile.TGT_loadData(this.fixedAssetFilesDataTable);  

    this.fixedAsset = new FixedAsset();
  }

  insertFiles() { 

    this.baseService.spinner.show();

    this.baseService.fileUploadService.FileUpload(
      this.fileBarcode,
      this.fixedAssetFiles,
      (file: string[], message) => {
        this.baseService.spinner.hide();

        this.baseService.popupService.ShowSuccessPopup("Dosya Yükleme Başarılı!");

        this.dataTableFile.TGT_clearData();
      },
      (error: HttpErrorResponse) => {
        this.baseService.spinner.hide();

        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
  

  //#endregion
}
