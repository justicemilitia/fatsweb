import {
  Component,
  OnInit,
  AfterViewInit,
  DoCheck,
  Directive,
  EventEmitter
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
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpEvent
} from "@angular/common/http";
import { FileUploader } from "ng2-file-upload";
import { NgForm } from "@angular/forms";
import { convertNgbDateToDateString } from "src/app/declarations/extends";

function readBase64(file): Promise<any> {
  var reader = new FileReader();
  var future = new Promise((resolve, reject) => {
    reader.addEventListener(
      "load",
      function() {
        resolve(reader.result);
      },
      false
    );

    reader.addEventListener(
      "error",
      function(event) {
        reject(event);
      },
      false
    );

    reader.readAsDataURL(file);
  });
  return future;
}

const URL = "";
@Component({
  selector: "app-fa-create",
  templateUrl: "./fa-create.component.html",
  styleUrls: ["./fa-create.component.css"]
})
@Directive({ selector: "[ng2FileSelect]" })
@Directive({ selector: "[ng2FileDrop]" })
export class FaCreateComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    $(".select2").trigger("click");
  }

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

  files: any[] = [];

  public imagePath;
  imgURL: any;
  imageFile: any;

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

  constructor(
    protected baseService: BaseService,
    public HttpClient: HttpClient
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
  }

  ngOnInit() {}

  loadDropdown() {
    this.baseService.departmentService.GetDepartments(
      (departments: Department[]) => {
        this.departments = departments;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

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
        this.currencies = ifrscurrencies;
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
  }

  loadBrandList() {
    if (this.brands && this.brands.length == 0) {
      this.models = [];

      this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
        (brands: FixedAssetCardBrand[]) => {
          this.brands = brands;
        },
        (error: HttpErrorResponse) => {}
      );
    }
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

  loadCategoriesList() {
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
    this.propertyValue = event.target.value;
  }

  async insertPropertyValueToArray(propertyId: any) {
    this.faPropertyDetails = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

    this.fixedAssetPropertyDetail.FixedAssetPropertyDetailId =
      (this.faPropertyDetails.length + 1) * -1;
    let fixedasset = this.fixedassetproperty.find(
      x => x.FixedAssetCardPropertyId == Number(propertyId.value)
    );
    this.fixedAssetPropertyDetail.FixedAssetCardProperty = fixedasset;
    if (this.isListSelected == true) {
      this.fixedAssetPropertyDetail.Value = this.propertyValue;
    }
    this.faPropertyDetails.push(this.fixedAssetPropertyDetail);
    this.dataTablePropertyValue.TGT_loadData(this.faPropertyDetails);

    this.fixedAssetPropertyDetail = new FixedAssetPropertyDetails();
    propertyId = null;
  }

  addImageFile(imageFile) {
    if (imageFile.length === 0) return;

    var reader = new FileReader();
    this.imagePath = imageFile;
    reader.readAsDataURL(imageFile[0]);
    reader.onload = _event => (this.imgURL = reader.result.toString());

    this.baseService.fileUploadService.ImageUpload(
      imageFile,
      result => {
        this.imgURL = result;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  getValidBarcode() {
    this.baseService.fixedAssetCreateService.GetValidBarcodeLastNumber(
      barcode => {
        this.barcode = barcode;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  addToFixedAssetList(data: NgForm) {
    if (this.fixedAsset.Quantity == 0) this.fixedAsset.Quantity = 1;
    this.quantity = this.fixedAsset.Quantity;

    this.fixedAssets = <FixedAsset[]>this.dataTable.TGT_copySource();
    for (let i = 0; i < this.quantity; i++) {
      let fixedasset = new FixedAsset();
      fixedasset.Barcode = this.barcode.toString();
      fixedasset.FixedAssetId = (this.fixedAssets.length + 1) * -1;
      let department = this.departments.find(
        x => x.DepartmentId == Number(data.value.DepartmentId)
      );
      let fixedassetcard = this.fixedassetcards.find(
        x => x.FixedAssetCardId == Number(data.value.FixedAssetCardId)
      );
      let location = this.locations.find(
        x => x.LocationId == Number(data.value.LocationId)
      );

      fixedasset.Location = location;
      fixedasset.Department = department;
      fixedasset.FixedAssetCard = fixedassetcard;

      this.fixedAssets.push(fixedasset);
      this.barcode = Number(this.barcode) + 1;
    }

    this.dataTable.TGT_loadData(this.fixedAssets);
  }

  addFixedAsset() {
    this.fixedAssets = <FixedAsset[]>this.dataTable.TGT_copySource();
    let propertyDetail = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

    let insertedFixedAsset = new FixedAsset();
    insertedFixedAsset.FixedAssetPropertyDetails = propertyDetail;
    insertedFixedAsset.CurrencyId =
      this.fixedAsset.CurrencyId == null
        ? null
        : Number(this.fixedAsset.CurrencyId);
    insertedFixedAsset.DepartmentId = Number(this.fixedAsset.DepartmentId);
    insertedFixedAsset.LocationId = Number(this.fixedAsset.LocationId);
    insertedFixedAsset.FixedAssetCardId = Number(
      this.fixedAsset.FixedAssetCardId
    );
    insertedFixedAsset.FixedAssetCardCategoryId = Number(
      this.fixedAsset.FixedAssetCardCategoryId
    );
    insertedFixedAsset.CompanyId =
      this.fixedAsset.CompanyId == null
        ? null
        : Number(this.fixedAsset.CompanyId);
    insertedFixedAsset.DepreciationCalculationTypeID =
      this.fixedAsset.DepreciationCalculationTypeID == null
        ? null
        : Number(this.fixedAsset.DepreciationCalculationTypeID);
    insertedFixedAsset.ExpenseCenterId =
      this.fixedAsset.ExpenseCenterId == null
        ? null
        : Number(this.fixedAsset.ExpenseCenterId);
    insertedFixedAsset.StatusId = Number(this.fixedAsset.StatusId);
    insertedFixedAsset.IFRSCurrecyId =
      this.fixedAsset.IFRSCurrecyId == null
        ? null
        : Number(this.fixedAsset.IFRSCurrecyId);
    insertedFixedAsset.UserId =
      this.fixedAsset.UserId == null ? null : Number(this.fixedAsset.UserId);
    insertedFixedAsset.ActivationDate = convertNgbDateToDateString(
      this.fixedAsset.ActivationDate
    );
    insertedFixedAsset.InvoiceDate = convertNgbDateToDateString(
      this.fixedAsset.InvoiceDate
    );
    insertedFixedAsset.ReceiptDate = convertNgbDateToDateString(
      this.fixedAsset.ReceiptDate
    );
    insertedFixedAsset.GuaranteeEndDate = convertNgbDateToDateString(
      this.fixedAsset.GuaranteeEndDate
    );
    insertedFixedAsset.GuaranteeStartDate = convertNgbDateToDateString(
      this.fixedAsset.GuaranteeStartDate
    );
    insertedFixedAsset.Picture = this.imgURL;

    let barcodes = this.fixedAssets.map(x => x.Barcode);
    insertedFixedAsset.BarcodeIds = <[]>barcodes;

    this.baseService.fixedAssetCreateService.AddFixedAsset(
      insertedFixedAsset,
      (barcodes: string[], message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  // #region FILE UPLOAD
  public uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  fileObject: any;

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  public onFileSelected(event) {
    const file: File = event[0];
    this.files = event.target.files;
    console.log(file);

    readBase64(file).then(function(data) {
      console.log(data);
    });
  }
  //#endregion
}
