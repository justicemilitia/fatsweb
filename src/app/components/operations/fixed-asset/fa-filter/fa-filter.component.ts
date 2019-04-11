import { Component, OnInit, NgModule } from '@angular/core';
import { BaseComponent } from '../../../base/base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TreeGridTable } from '../../../../extends/TreeGridTable/modules/TreeGridTable';
import { BaseService } from '../../../../services/base.service';
import { Department } from '../../../../models/Department';
import { FixedAssetStatus } from '../../../../models/FixedAssetStatus';
import { Company } from '../../../../models/Company';
import { HttpErrorResponse } from '@angular/common/http';
import { FixedAssetCardCategory } from '../../../../models/FixedAssetCardCategory';
import { User } from '../../../../models/LoginUser';
import { FixedAssetCardBrand } from '../../../../models/FixedAssetCardBrand';
import { FixedAssetCardModel } from '../../../../models/FixedAssetCardModel';
import { FixedAsset } from '../../../../models/FixedAsset';
import { FixedAssetCard } from '../../../../models/FixedAssetCard';
import { FixedAssetCardPropertyValue } from '../../../../models/FixedAssetCardPropertyValue';

@Component({
  selector: 'app-fa-filter',
  templateUrl: './fa-filter.component.html',
  styleUrls: ['./fa-filter.component.css']
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaFilterComponent],
  providers: [FaFilterComponent]
})

export class FaFilterComponent extends BaseComponent implements OnInit {

  departments: Department[] = [];
  companies: Company[] = [];
  locations: Location[] = [];
  statuses: FixedAssetStatus[] = [];
  fixedassetcategories: FixedAssetCardCategory[] = [];
  staffs: User[] = [];
  brands: FixedAssetCardBrand[] = [];
  models: FixedAssetCardModel[] = [];
  fixedAsset: FixedAsset = new FixedAsset();
  fixedAssetCards: FixedAssetCard[] = [];
  fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
  
  dropdownSettingsForCard = {};
  dropdownSettingsForDepartment = {};
  dropdownSettingsForLocation = {};
  dropdownSettingsForCategory = {};
  dropdownSettingsForStatu = {};
  dropdownSettingsForBrand = {};
  dropdownSettingsForModel = {};
  dropdownSettingsForUser = {};

  
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

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadDropdownList();
    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isDeleteable = true;
   }

  ngOnInit() {
    
    this.dropdownSettingsForCard = {
      singleSelection: false,
      idField: "FixedAssetCardId",
      textField: "Name",
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 10,
      allowSearchFilter: true
    };

    this.dropdownSettingsForDepartment = {
      singleSelection: false,
      idField: "DepartmentId",
      textField: "Name",
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
    this.dropdownSettingsForLocation = {
      singleSelection: false,
      idField: "LocationId",
      textField: "Name",
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
    this.dropdownSettingsForCategory = {
      singleSelection: false,
      idField: "FixedAssetCardCategoryId",
      textField: "Name",
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
    this.dropdownSettingsForStatu = {
      singleSelection: false,
      idField: "StatusId",
      textField: "Name",
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
    this.dropdownSettingsForBrand = {
      singleSelection: false,
      idField: "FixedAssetCardBrandId",
      textField: "Name",
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
    this.dropdownSettingsForModel = {
      singleSelection: false,
      idField: "FixedAssetCardModelId",
      textField: "Name",
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
    this.dropdownSettingsForUser = {
      singleSelection: false,
      idField: "UserId",
      textField: "Name",
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  loadDropdownList(){
    //Department
    this.baseService.departmentService.GetDepartments(
      (departments: Department[]) => {
        this.departments = departments;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    //Location
    this.baseService.locationService.GetLocations(
      (locations: Location[]) => {
        this.locations = locations;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    //Status
    this.baseService.fixedAssetStatusService.GetStatus(
      (statuses: FixedAssetStatus[]) => {
        this.statuses = statuses;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    //Card Category
    this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
      (categories: FixedAssetCardCategory[]) => {
        this.fixedassetcategories = categories;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    //Card
    this.baseService.fixedAssetCardService.GetFixedAssetCards(
      (faCards: FixedAssetCard[]) => {
        this.fixedAssetCards = faCards;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    // User
    this.baseService.userService.GetUsers(
      (users: User[]) => {
        this.staffs = users;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    //Brand
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

  // loadModelByBrandId(event: any) {
  //   this.models = [];

  //   if (!event.target.value || event.target.value == "") {
  //     this.fixedAsset.FixedAssetCardModelId = null;
  //     this.fixedAsset.FixedAssetCardModel = new FixedAssetCardModel();
  //     return;
  //   }

  //   if (event.target.value) {
  //     this.baseService.fixedAssetCardModelService.GetFixedAssetsCardModelsByBrandId(
  //       <number>event.target.value,
  //       (models: FixedAssetCardModel[]) => {
  //         this.models = models;
  //       },
  //       (error: HttpErrorResponse) => {
  //         this.baseService.popupService.ShowErrorPopup(error);
  //       }
  //     );
  //   }
  // }

  // loadFaCardByCategoryId(event: any) {
  //   this.fixedAssetCards = [];

  //   if (!event.target.value || event.target.value == "") {
  //     this.fixedAsset.FixedAssetCardId = null;
  //     this.fixedAsset.FixedAssetCard = new FixedAssetCard();
  //     return;
  //   }

  //   if (event.target.value) {
  //     this.baseService.fixedAssetCardService.GetFixedAssetCardByCategoryId(
  //       <number>event.target.value,
  //       (fixedAssetCards: FixedAssetCard[]) => {
  //         this.fixedAssetCards = fixedAssetCards;
  //       },
  //       (error: HttpErrorResponse) => {
  //         this.baseService.popupService.ShowErrorPopup(error);
  //       }
  //     );
  //   }
  // }
}
