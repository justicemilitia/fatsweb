import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from "src/app/components/base/base.component";
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { Department } from 'src/app/models/Department';
import { FixedAssetCardCategory } from 'src/app/models/FixedAssetCardCategory';
import { FixedAssetCard } from 'src/app/models/FixedAssetCard';
import { Location } from "src/app/models/Location";
import { Company } from 'src/app/models/Company';
import { FixedAssetStatus } from 'src/app/models/FixedAssetStatus';
import { FixedAssetCardBrand } from 'src/app/models/FixedAssetCardBrand';
import { FixedAssetCardModel } from 'src/app/models/FixedAssetCardModel';
import { User } from 'src/app/models/User';
import { FixedAsset } from 'src/app/models/FixedAsset';
import { FaCreateComponent } from '../fa-create.component';
import { NgForm } from '@angular/forms';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-fa-general-information',
  templateUrl: './fa-general-information.component.html',
  styleUrls: ['./fa-general-information.component.css']
})
export class FaGeneralInformationComponent extends BaseComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    $(".select2").trigger("click");
  }

  @Input() faCreate: FaCreateComponent;
  @Input() barcode: number;
  @Input() firstBarcode: number;

  @Output('reset') reset: EventEmitter<any> = new EventEmitter();

  fixedAsset: FixedAsset = new FixedAsset();

  searchUser: string = '';
  isLocationDropdownOpen: boolean = false;
  isDepartmentDropdownOpen: boolean = false;
  isFaCardDropdownOpen: boolean = false;
  isFaCardCategoryDropdownOpen: boolean = false;
  isBrandOpen: boolean = false;

  isWaitingValidBarcode: boolean = false;

  BarcodeIsUnique: boolean = true;
  disabledBarcode: boolean = true;
  errorMessage: string = "";

  isNewBarcode: boolean;
  departments: Department[] = [];
  companies: Company[] = [];
  locations: Location[] = [];
  statuses: FixedAssetStatus[] = [];
  brands: FixedAssetCardBrand[] = [];
  models: FixedAssetCardModel[] = [];
  fixedassetcategories: FixedAssetCardCategory[] = [];
  fixedassetcards: FixedAssetCard[] = [];

  isResetForm: boolean = false;
  isRFIDBarcode: boolean = false;
  prefix: string = "";

  public dataTableLocation: TreeGridTable = new TreeGridTable(
    "location",
    [
      {
        columnDisplayName: this.getLanguageValue('Location'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  public dataTableDepartment: TreeGridTable = new TreeGridTable(
    "department",
    [
      {
        columnDisplayName: this.getLanguageValue('Department'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  public dataTableFixedAssetCategory: TreeGridTable = new TreeGridTable(
    "fixedassetcategory",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Category_Name'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  public dataTableBrand: TreeGridTable = new TreeGridTable(
    "fixedassetcategory",
    [
      {
        columnDisplayName: this.getLanguageValue('Brand'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  public dataTableFixedAssetCard: TreeGridTable = new TreeGridTable(
    "fixedassetcard",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  @ViewChild("stepper") stepper: MatStepper;

  constructor(protected baseService: BaseService, public HttpClient: HttpClient) {

    super(baseService);

    this.loadDropdown();

    this.getValidBarcode();

    //#region DataTable Properties

    this.dataTableLocation.isPagingActive = false;
    this.dataTableLocation.isColumnOffsetActive = false;
    this.dataTableLocation.isDeleteable = false;
    this.dataTableLocation.isMultipleSelectedActive = false;
    this.dataTableLocation.isLoading = false;
    this.dataTableLocation.isHeaderVisible = false;
    this.dataTableLocation.isScrollActive = false;

    this.dataTableDepartment.isPagingActive = false;
    this.dataTableDepartment.isColumnOffsetActive = false;
    this.dataTableDepartment.isDeleteable = false;
    this.dataTableDepartment.isMultipleSelectedActive = false;
    this.dataTableDepartment.isLoading = false;
    this.dataTableDepartment.isHeaderVisible = false;
    this.dataTableDepartment.isScrollActive = false;

    this.dataTableFixedAssetCategory.isPagingActive = false;
    this.dataTableFixedAssetCategory.isColumnOffsetActive = false;
    this.dataTableFixedAssetCategory.isDeleteable = false;
    this.dataTableFixedAssetCategory.isMultipleSelectedActive = false;
    this.dataTableFixedAssetCategory.isLoading = false;
    this.dataTableFixedAssetCategory.isHeaderVisible = false;
    this.dataTableFixedAssetCategory.isScrollActive = false;

    this.dataTableFixedAssetCard.isPagingActive = false;
    this.dataTableFixedAssetCard.isColumnOffsetActive = false;
    this.dataTableFixedAssetCard.isDeleteable = false;
    this.dataTableFixedAssetCard.isMultipleSelectedActive = false;
    this.dataTableFixedAssetCard.isLoading = false;
    this.dataTableFixedAssetCard.isHeaderVisible = false;
    this.dataTableFixedAssetCard.isScrollActive = false;

    this.dataTableBrand.isPagingActive = false;
    this.dataTableBrand.isColumnOffsetActive = false;
    this.dataTableBrand.isDeleteable = false;
    this.dataTableBrand.isMultipleSelectedActive = false;
    this.dataTableBrand.isLoading = false;
    this.dataTableBrand.isHeaderVisible = false;
    this.dataTableBrand.isScrollActive = false;
    //#endregion    

    $(document).on("click", e => {
      if (
        $(e.target).closest(".custom-dropdown").length == 0 &&
        $(e.target).closest("#btnLocation").length == 0 && $(e.target).closest("#btnDepartment").length == 0
        && $(e.target).closest("#btnFaCategory").length == 0 && $(e.target).closest("#btnFaCard").length == 0
        && $(e.target).closest("#btnBrand").length == 0
      ) {
        this.isLocationDropdownOpen = false;
        this.isDepartmentDropdownOpen = false;
        this.isFaCardCategoryDropdownOpen = false;
        this.isFaCardDropdownOpen = false;
        this.isBrandOpen = false;
      }
    });
  }

  ngOnInit() {
  }

  onSubmit(data: NgForm) {

    this.fixedAsset.FixedAssetCardCategory = this.selectedCategory;

    this.fixedAsset.Location = this.selectedLocation;

    this.fixedAsset.Department = this.selectedDepartment;

    this.fixedAsset.FixedAssetCard = this.selectedCard;

    this.fixedAsset.FixedAssetCardBrand = this.selectedBrand;

    console.log(this.barcode);

    this.faCreate.addFaGeneralInformation(this.fixedAsset, data, this.selectedCategory);

  }

  resetForm() {

    this.reset.emit();

    this.fixedAsset = new FixedAsset();

    this.fixedAsset.Prefix = null;

    this.fixedAsset.FixedAssetCardModelId = null;

    this.fixedAsset.FixedAssetCardBrandId = null;

    this.fixedAsset.SerialNumber = null;

    this.fixedAsset.InsuranceCompanyId = null;

    this.fixedAsset.UserId = null;

    this.fixedAsset.Quantity = 1;

    this.fixedAsset.Description = null;

    this.selectedCard = null;

    this.selectedCategory = null;

    this.selectedDepartment = null;

    this.selectedLocation = null;

    this.isResetForm = true;

    this.selectedBrand=null;

    this.getValidBarcode();
  }

  isBarcodeUnique(barcode: string) {
    if (barcode == "") return;

    //this.firstBarcode = Number(this.fixedAsset.Barcode);

    this.baseService.fixedAssetCreateService.isBarcodeUnique(
      barcode,
      result => {
        this.BarcodeIsUnique = false;
        this.errorMessage = "";
        //this.barcode = Number(barcode);
      },
      (error: HttpErrorResponse) => {
        this.BarcodeIsUnique = true;
        this.errorMessage = error.statusText;
      }
    );

    if (this.isRFIDBarcode) {

      let barcodeLength: number = Number(this.prefix.length) + Number(this.barcode.toString().length);

      if (barcodeLength > 12) {

        return;
      }

    }
  }

  getValidBarcode() {
    this.isWaitingValidBarcode = true;

    this.baseService.fixedAssetCreateService.GetValidBarcodeLastNumber(
      barcode => {
        this.isWaitingValidBarcode = false;

        this.barcode = barcode;

        this.fixedAsset.Barcode = barcode;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  isRFID(event: any) {
    if (event.target.checked == true) {
      this.isRFIDBarcode = true;
      this.fixedAsset.Prefix = "";
      this.barcode = null;
    }
    else {
      this.isRFIDBarcode = false;
      this.getValidBarcode();
    }
  }


  selectedLocation: Location;
  onClickLocation(item) {
    this.selectedLocation = item;
  }

  selectedDepartment: Department;
  onClickDepartment(item) {
    this.selectedDepartment = item;
  }

  selectedCategory: FixedAssetCardCategory;
  onClickFaCategory(item) {
    this.selectedCategory = item;

    this.selectedCard = null;
  }

  selectedCard: FixedAssetCard;
  onClickFaCard(item) {
    this.selectedCard = item;
  }

  selectedBrand: FixedAssetCardBrand;
  onclickBrand(item) {
    
    this.selectedBrand = item;
  }

  toggleDropdown(key: string) {

    switch (key) {
      case "location":
        this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
        this.isDepartmentDropdownOpen = false;
        this.isFaCardDropdownOpen = false;
        this.isFaCardCategoryDropdownOpen = false;
        this.isBrandOpen = false;
        break;

      case "department":
        this.isDepartmentDropdownOpen = !this.isDepartmentDropdownOpen;
        this.isFaCardDropdownOpen = false;
        this.isFaCardCategoryDropdownOpen = false;
        this.isLocationDropdownOpen = false;
        this.isBrandOpen = false;
        break;

      case "card":
        this.isFaCardDropdownOpen = !this.isFaCardDropdownOpen;
        this.isLocationDropdownOpen = false;
        this.isDepartmentDropdownOpen = false;
        this.isFaCardCategoryDropdownOpen = false;
        this.isBrandOpen = false;
        this.loadFaCardByCategoryId();

        break;

      case "category":
        this.isFaCardCategoryDropdownOpen = !this.isFaCardCategoryDropdownOpen;
        this.isLocationDropdownOpen = false;
        this.isDepartmentDropdownOpen = false;
        this.isFaCardDropdownOpen = false;
        this.isBrandOpen = false;
        break;

      case "brand":
        this.isBrandOpen = !this.isBrandOpen;
        this.isLocationDropdownOpen = false;
        this.isDepartmentDropdownOpen = false;
        this.isFaCardDropdownOpen = false;
        this.isFaCardCategoryDropdownOpen = false;       
        break;
    }
  }

  resetDropdown(key: string) {
    switch (key) {
      case "category":
        this.selectedCategory = null;
        this.selectedCard = null;
        break;
      case "card":
        this.selectedCard = null;
        this.dataTableFixedAssetCard.TGT_clearData();
        break;
      case "location":
        this.selectedLocation = null;
        this.selectedDepartment = null;
        this.dataTableDepartment.TGT_clearData();
        break;
      case "department":
        this.selectedDepartment = null;
        break;
      case "brand":
        this.selectedDepartment = null;
        break;
    }
  }

  async loadDropdown() {
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
        this.dataTableLocation.TGT_loadData(this.locations);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );


    this.baseService.departmentService.GetDepartments(
      (departments: Department[]) => {
        this.departments = departments;
        this.dataTableDepartment.TGT_loadData(this.departments);
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

    if (this.fixedassetcategories && this.fixedassetcategories.length == 0) {
      this.fixedassetcards = [];

      this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
        (categories: FixedAssetCardCategory[]) => {
          this.fixedassetcategories = categories;
          this.dataTableFixedAssetCategory.TGT_loadData(this.fixedassetcategories);
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
          this.dataTableBrand.TGT_loadData(this.brands);

        },
        (error: HttpErrorResponse) => { }
      );
    }
  }

  // async loadDepartmentByLocationId() {
  //   this.departments = [];

  //     if( this.selectedLocation != null){
  //     this.baseService.departmentService.GetDepartmentsByLocationId(

  //       this.selectedLocation.LocationId,
  //       (departments: Department[]) => {
  //         this.departments = departments;
  //         this.dataTableDepartment.TGT_loadData(this.departments);
  //       },
  //       (error: HttpErrorResponse) => {}
  //     );
  //   }
  // }

  async loadModelByBrandId(event: any) {
    this.models = [];

    if (event == null || event.FixedAssetCardBrandId  == null) {
      this.fixedAsset.FixedAssetCardModelId = null;
      this.fixedAsset.FixedAssetCardModel = new FixedAssetCardModel();
      return;
    }
   
      this.baseService.fixedAssetCardModelService.GetFixedAssetsCardModelsByBrandId(
        <number>event.FixedAssetCardBrandId,
        (models: FixedAssetCardModel[]) => {
          this.models = models;
        },
        (error: HttpErrorResponse) => {

        }
      );
    
  }

  async loadFaCardByCategoryId() {
    this.fixedassetcards = [];

    this.baseService.fixedAssetCardService.GetFixedAssetCardByCategoryId(
      this.selectedCategory.FixedAssetCardCategoryId,
      (fixedAssetCards: FixedAssetCard[]) => {
        this.fixedassetcards = fixedAssetCards;
        this.dataTableFixedAssetCard.TGT_loadData(this.fixedassetcards);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  nextTab() {
    if (
      this.selectedCard != null &&
      this.selectedCategory != null &&
      this.selectedLocation != null &&
      this.fixedAsset.StatusId != null &&
      this.fixedAsset.Barcode != ""
    ) {
      this.faCreate.nextTab();
    } else return;
  }

  receiveStaffId(userId) {
    this.fixedAsset.UserId = userId;
  }

}
