import {
  Component,
  OnInit,
  AfterViewInit,
  Directive,
  NgModule,
  ViewChild,
  Input
} from "@angular/core";
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
import { Agreement } from "src/app/models/Agreement";
import { FaGeneralInformationComponent } from './fa-general-information/fa-general-information.component';
import { FaPropertyInformationComponent } from './fa-property-information/fa-property-information.component';
import { FaFinancialInformationComponent } from './fa-financial-information/fa-financial-information.component';


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
export class FaCreateComponent extends BaseComponent
  implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    $(".select2").trigger("click");
  }

  isLocationDropdownOpen: boolean = false;
  isDepartmentDropdownOpen: boolean = false;
  isFaCardDropdownOpen: boolean = false;
  isFaCardCategoryDropdownOpen: boolean = false;
  isUniqueProperty: boolean = false;
  visibleDepreciation: boolean = false;
  visibleIfrs: boolean = false;
  visiblePropertyName = false;

  isFinished: boolean = false;
  isWaitingValidBarcode: boolean = false;
  isLinear = false;
  isSelectedProperty: boolean = false;
  visible: boolean = false;
  fixedAssetForm: FormGroup;
  isNewBarcode: boolean;

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
  fixedAssetFiles: FixedAssetFile[] = [];
  fixedAssetFilesDataTable: FixedAssetFile[] = [];
  agreements: Agreement[] = [];

  fixedAsset: FixedAsset = new FixedAsset();
  faGeneralInformation: FixedAsset = new FixedAsset();
  faPropertyInformation: FixedAsset = new FixedAsset();
  fixedAssetProperty: FixedAssetCardProperty = new FixedAssetCardProperty();
  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();
  fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
  fixedAssetFile: FixedAssetFile = new FixedAssetFile();

  propertyValue: string;
  sameProperty: boolean = false;

  BarcodeIsUnique: boolean = true;
  disabledBarcode: boolean = true;
  errorMessage: string = "";
  isListSelected: boolean = false;
  barcode: number;
  firstBarcode: number;
  quantity: number;
  validBarcode = false;
  editable: boolean = true;
  visibleInsertButton: boolean = false;
  isResetForm: boolean = false;
  picture: string;
  isSuccess: boolean = false;
  dataGeneral:NgForm;
  dataFinancial:NgForm;
  dataProperty:NgForm;



  @Input() faComponent: FixedAssetComponent;
  @ViewChild("stepper") stepper: MatStepper;
  @ViewChild(FaGeneralInformationComponent)
  resetGeneral: FaGeneralInformationComponent;
  @ViewChild(FaPropertyInformationComponent)
  resetProperty: FaPropertyInformationComponent;
 

  public imagePath;
  imgURL: any;
  imageFile: any;
  fileBarcode: any;
  insertedFixedAsset = new FixedAsset();

  //#region DataTables

  /*Fixed Asset List */
  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedasset",
    [
      {
        columnDisplayName: this.getLanguageValue('Barcode'),
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        isEditable: true
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Name'),
        columnName: ["FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Department_Name'),
        columnName: ["Department", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Name'),
        columnName: ["Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Price'),
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

  public dataTableFile: TreeGridTable = new TreeGridTable(
    "fixedassetfile",
    [
      {
        columnDisplayName: this.getLanguageValue('File'),
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

  //#endregion

  constructor(
    protected baseService: BaseService,
    public HttpClient: HttpClient
  ) {
    super(baseService);

    //#region DataTable Properties

    this.dataTable.isPagingActive = false;
    this.dataTable.isColumnOffsetActive = false;
    this.dataTable.isDeleteable = true;
    this.dataTable.isTableEditable = true;

    this.dataTableFile.isPagingActive = false;
    this.dataTableFile.isColumnOffsetActive = false;
    this.dataTableFile.isDeleteable = true;
    this.dataTableFile.isMultipleSelectedActive = false;
    this.dataTableFile.isLoading = false;

    //#endregion
  }

  ngOnInit() {}

  previous() {
    this.stepper.previous();
  }

  nextTab() {
    if (this.barcode) this.fixedAsset.Barcode = this.barcode.toString();

    this.stepper.next();
  }

  nextFixedAssetList() {
    this.isFinished = true;
    this.stepper.next();
  }

  //#region Load Dropdown

  async loadDropdown() {
    this.baseService.companyService.GetCompanies(
      (companies: Company[]) => {
        this.companies = companies;
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

    this.baseService.agreementService.GetAgreement(
      (agreements: Agreement[]) => {
        this.agreements = agreements;
      },
      (error: HttpErrorResponse) => {}
    );    
  }


  addFaGeneralInformation(fixedasset: FixedAsset, data:NgForm, selectedCard:FixedAssetCardCategory) {
    this.barcode = Number(fixedasset.Barcode);

    Object.assign(this.faGeneralInformation, fixedasset);

    this.dataGeneral = data;

  }

  addFaPropertyInformation(fixedasset: FixedAsset, data:NgForm) {
    this.dataProperty = data;

    Object.assign(this.faPropertyInformation, fixedasset);
  }

  addToFixedAssetList(data: NgForm) {

    this.dataFinancial = data;

    Object.assign(this.fixedAsset, this.faGeneralInformation);

    this.fixedAsset.FixedAssetPropertyDetails = this.faPropertyInformation.FixedAssetPropertyDetails;
    this.fixedAsset.Picture = this.faPropertyInformation.Picture;

    this.dataTable.TGT_clearData();

    if (this.fixedAsset.Quantity == 0 || this.fixedAsset.Quantity == null)
      this.fixedAsset.Quantity = 1;
    this.quantity = this.fixedAsset.Quantity;

    this.fixedAssets = <FixedAsset[]>this.dataTable.TGT_copySource();

    let expensecenter = this.expensecenters.find(
      x => x.ExpenseCenterId == Number(data.value.ExpenseCenterId)
    );

    this.fixedAsset.IsActive = Boolean(data.value.IsActive);
    this.fixedAsset.ActivationDate = data.value.activationDate;
    this.fixedAsset.ExpenseCenter = expensecenter;
    this.fixedAsset.Price = data.value.Price;
    this.fixedAsset.GuaranteeStartDate = data.value.guaranteeStartDate;
    this.fixedAsset.GuaranteeEndDate = data.value.guaranteeEndDate;
    this.fixedAsset.InvoiceDate = data.value.invoiceDate;
    this.fixedAsset.InvoiceNo = data.value.InvoiceNo;
    this.fixedAsset.ReceiptDate = data.value.receiptDate;

    if (this.isFinished == true) {
      for (let i = 0; i < this.fixedAsset.Quantity; i++) {
        let fixedasset = new FixedAsset();

        fixedasset.Barcode = this.barcode.toString();
        fixedasset.FixedAssetId = (this.fixedAssets.length + 1) * -1;

        Object.assign(fixedasset, this.fixedAsset);

        let prefix: string = this.fixedAsset.Prefix;

        if (prefix != null)
          fixedasset.Barcode = prefix + this.barcode.toString();
        else fixedasset.Barcode = this.barcode.toString();

        this.barcode = Number(this.barcode) + 1;

        if(this.fixedAsset.IsRFID){
          this.isRFID();
          fixedasset.Barcode = this.fixedAsset.Barcode;
        }

        this.fixedAssets.push(fixedasset);

        this.isFinished = false;
      }


      this.dataTable.TGT_loadData(this.fixedAssets);
    }
  }

  isRFID(){
    
      let newBarcode :string;
      let barcodeLength : number = Number(this.fixedAsset.Prefix.length) + Number(this.barcode.toString().length);
      newBarcode = this.barcode.toString();

      if(barcodeLength < 12){
        for(let i=barcodeLength; i<12; i++){
          newBarcode = "0" + newBarcode;
         barcodeLength++;
        }  
        this.fixedAsset.Barcode = this.fixedAsset.Prefix + newBarcode;
      }
      else if(barcodeLength > 12)        
        return;
      
  }

  async toggleValidBarcodes() {
    if (!this.dataTable.dataFilters.willDisplay)
      this.dataTable.dataFilters.willDisplay = true;
    else
      this.dataTable.dataFilters.willDisplay = !this.dataTable.dataFilters
        .willDisplay;
  }

  async doAllVisible() {
    this.dataTable.originalSource.forEach((e: FixedAsset) => {
      e.willDisplay = true;
    });
  }

  async doItemsHidden(items: string[]) {
    this.dataTable.originalSource.forEach((e: FixedAsset) => {
      if (!items.includes(e.Barcode)) e.willDisplay = false;
    });
  }

  async addFixedAsset() {
    this.fixedAssets = <FixedAsset[]>this.dataTable.TGT_copySource();

    this.insertedFixedAsset = this.fixedAssets[0];

    this.insertedFixedAsset.CurrencyId =
      this.fixedAsset.CurrencyId == null
        ? null
        : Number(this.fixedAsset.CurrencyId);
    this.insertedFixedAsset.DepartmentId =
      this.fixedAsset.Department == null
        ? null
        : Number(this.fixedAsset.Department.DepartmentId);
    this.insertedFixedAsset.LocationId = Number(
      this.fixedAsset.Location.LocationId
    );
    this.insertedFixedAsset.FixedAssetCardId = Number(
      this.fixedAsset.FixedAssetCard.FixedAssetCardId
    );
    this.insertedFixedAsset.FixedAssetCardCategoryId = Number(
      this.fixedAsset.FixedAssetCardCategory.FixedAssetCardCategoryId
    );
    this.insertedFixedAsset.CompanyId =
      this.fixedAsset.CompanyId == null
        ? null
        : Number(this.fixedAsset.CompanyId);
    this.insertedFixedAsset.DepreciationCalculationTypeID =
      this.fixedAsset.DepreciationCalculationTypeID == null
        ? null
        : Number(this.fixedAsset.DepreciationCalculationTypeID);
    this.insertedFixedAsset.ExpenseCenterId =
      this.fixedAsset.ExpenseCenterId == null
        ? null
        : Number(this.fixedAsset.ExpenseCenterId);
    this.insertedFixedAsset.StatusId =
      this.fixedAsset.StatusId == null
        ? null
        : Number(this.fixedAsset.StatusId);
    this.insertedFixedAsset.IFRSCurrecyId =
      this.fixedAsset.IFRSCurrecyId == null
        ? null
        : Number(this.fixedAsset.IFRSCurrecyId);
    this.insertedFixedAsset.UserId =
      this.fixedAsset.UserId == null ? null : Number(this.fixedAsset.UserId);
    this.insertedFixedAsset.ActivationDate =
      this.fixedAsset.ActivationDate == null
        ? null
        : convertNgbDateToDateString(this.fixedAsset.ActivationDate);
    this.insertedFixedAsset.InvoiceDate =
      this.fixedAsset.InvoiceDate == null
        ? null
        : convertNgbDateToDateString(this.fixedAsset.InvoiceDate);
    this.insertedFixedAsset.ReceiptDate =
      this.fixedAsset.ReceiptDate == null
        ? null
        : convertNgbDateToDateString(this.fixedAsset.ReceiptDate);
    this.insertedFixedAsset.GuaranteeEndDate =
      this.fixedAsset.GuaranteeEndDate == null
        ? null
        : convertNgbDateToDateString(this.fixedAsset.GuaranteeEndDate);
    this.insertedFixedAsset.GuaranteeStartDate =
      this.fixedAsset.GuaranteeStartDate == null
        ? null
        : convertNgbDateToDateString(this.fixedAsset.GuaranteeStartDate);
    this.insertedFixedAsset.IsActive = this.fixedAsset.IsActive;
    this.insertedFixedAsset.FixedAssetCardBrandId =
      this.fixedAsset.FixedAssetCardBrandId == null
        ? null
        : Number(this.fixedAsset.FixedAssetCardBrandId);
    this.insertedFixedAsset.FixedAssetCardModelId =
      this.fixedAsset.FixedAssetCardModelId == null
        ? null
        : Number(this.fixedAsset.FixedAssetCardModelId);

    this.insertedFixedAsset.Picture = this.picture;

    let barcodes = this.fixedAssets.map(x => x.Barcode);
    this.insertedFixedAsset.BarcodeIds = <[]>barcodes;
    this.fileBarcode = barcodes;
    this.baseService.spinner.show();

    this.baseService.fixedAssetCreateService.AddFixedAsset(
      this.insertedFixedAsset,
      (barcodes: [], status, message) => {
        if (status == true) {
          this.editable = false;
          this.dataTable.isTableEditable = false;
          this.visibleInsertButton = true;
          this.dataTable.TGT_clearData();
          this.baseService.spinner.hide();
          this.baseService.popupService.ShowSuccessPopup(message);
          this.faComponent.loadFixedAsset();
        } else {
          this.validBarcode = true;
          this.doAllVisible();
          this.doItemsHidden(barcodes);
          this.editable = false;
          this.visibleInsertButton = false;
          this.baseService.spinner.hide();
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
    if(this.dataFinancial)
    this.dataFinancial.resetForm();

    if(this.dataGeneral)
    this.dataGeneral.resetForm();

    if(this.dataProperty)
    this.dataProperty.resetForm();

    this.resetGeneral.resetForm();

    this.resetProperty.resetForm();

    this.stepper.reset();

    this.isNewBarcode = true;

    this.dataTable.TGT_clearData();

    this.dataTableFile.TGT_clearData();

    this.visibleInsertButton = false;

    this.validBarcode = false;
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
      let files: FixedAssetFile = new FixedAssetFile();

      files.FileName = event.target.files[i].name;
      files.FixedAssetFileId = (this.fixedAssetFilesDataTable.length + 1) * -1;
      this.fixedAssetFilesDataTable.push(files);

      this.fixedAssetFiles.push(event.target.files[i]);
    }

    this.dataTableFile.TGT_loadData(this.fixedAssetFilesDataTable);

    this.fixedAsset = new FixedAsset();
  }

  insertFiles() {
    let fixedassetfiles: FixedAssetFile[] = [];

    let selectedFiles = this.dataTableFile.TGT_selectAllItems();

    Object.assign(fixedassetfiles, selectedFiles);

    this.fixedAssetFiles = this.fixedAssetFiles.filter(e =>
      fixedassetfiles.some(t => e.name == t.FileName)
    );

    if (this.fixedAssetFiles.length == 0) {
      this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Choose_File'));
      return;
    }

    this.baseService.spinner.show();

    this.baseService.fileUploadService.FileUpload(
      this.fileBarcode,
      this.fixedAssetFiles,
      (file: string[], message) => {
        this.baseService.spinner.hide();

        this.baseService.popupService.ShowSuccessPopup(
           this.getLanguageValue('Addig_file_is_successfull')
        );

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
