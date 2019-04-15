import { Component, OnInit, NgModule, Input } from "@angular/core";
import { BaseComponent } from "../../../base/base.component";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { TreeGridTable } from "../../../../extends/TreeGridTable/modules/TreeGridTable";
import { BaseService } from "../../../../services/base.service";
import { Department } from "../../../../models/Department";
import { Location } from "../../../../models/Location";
import { FixedAssetStatus } from "../../../../models/FixedAssetStatus";
import { Company } from "../../../../models/Company";
import { HttpErrorResponse } from "@angular/common/http";
import { FixedAssetCardCategory } from "../../../../models/FixedAssetCardCategory";
import { User } from "../../../../models/User";
import { FixedAssetCardBrand } from "../../../../models/FixedAssetCardBrand";
import { FixedAssetCardModel } from "../../../../models/FixedAssetCardModel";
import { FixedAsset } from "../../../../models/FixedAsset";
import { FixedAssetCard } from "../../../../models/FixedAssetCard";
import { FixedAssetCardPropertyValue } from "../../../../models/FixedAssetCardPropertyValue";
import { FixedAssetCardProperty } from "../../../../models/FixedAssetCardProperty";
import { FixedAssetPropertyDetails } from "../../../../models/FixedAssetPropertyDetails";
import { PropertyValueTypes } from "../../../../declarations/property-value-types.enum";
import { FixedAssetComponent } from "../fixed-asset.component";
import { FixedAssetFilter } from '../../../../models/FixedAssetFilter';

@Component({
  selector: "app-fa-filter",
  templateUrl: "./fa-filter.component.html",
  styleUrls: ["./fa-filter.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaFilterComponent],
  providers: [FaFilterComponent]
})
export class FaFilterComponent extends BaseComponent implements OnInit {
  @Input() faComponent: FixedAssetComponent;

  departments: Department[] = [];
  companies: Company[] = [];
  locations: Location[] = [];
  statuses: FixedAssetStatus[] = [];
  fixedassetcategories: FixedAssetCardCategory[] = [];
  users: User[] = [];
  brands: FixedAssetCardBrand[] = [];
  models: FixedAssetCardModel[] = [];
  properties: FixedAssetCardProperty[] = [];
  fixedAsset: FixedAssetFilter = new FixedAssetFilter();
  fixedAssetCards: FixedAssetCard[] = [];
  fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
  faPropertyDetails: FixedAssetPropertyDetails[] = [];
  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();
  isListSelected: boolean = false;
  propertyValue: string;
  fixedassetproperty: FixedAssetCardProperty[] = [];
  fixedassetpropertyvalues: FixedAssetCardPropertyValue[] = [];
  fixedAssetFilterList: FixedAsset[]=[];

  //Dropdown Selected Items
  selectedFixedAssetCards: FixedAssetCard[] = [];
  selectedFixedAssetCardCategories: FixedAssetCardCategory[] = [];
  selectedDepartments: Department[] = [];
  selectedBrands: FixedAssetCardBrand[] = [];
  selectedStatus: FixedAssetStatus[] = [];
  selectedLocations: Location[] = [];
  selectedModels: FixedAssetCardModel[] = [];
  selectedUsers: User[] = [];

  //Dropdown Settings
  dropdownSettingsForCard = {};
  dropdownSettingsForDepartment = {};
  dropdownSettingsForLocation = {};
  dropdownSettingsForCategory = {};
  dropdownSettingsForStatus = {};
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
    this.dropdownSettingsForStatus = {
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
      textField: "UserMail",
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  loadDropdownList() {
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
        this.users = users;
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

    //Model
    this.baseService.fixedAssetCardModelService.GetFixedAssetCardModels(
      (models: FixedAssetCardModel[]) => {
        this.models = models;
      },
      (error: HttpErrorResponse) => {}
    );

    //Property
    this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
      (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
        this.fixedassetproperty = fixedAssetCardProperties;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  getPropertyValue(event: any) {
    this.propertyValue = event.target.value;
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

  async FilterFixedAsset(data: NgForm) {
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    this.fixedAsset.Barcodes= [];
    let propertyDetail = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );


    this.fixedAsset.IsSearchRequest=true;
    this.fixedAsset.Page= 1;
    this.fixedAsset.PerPage= 100;

    this.fixedAsset.Barcodes.push(data.value.Barcode);
    // this.fixedAsset.Barcodes = data.value.Barcode;
    this.fixedAsset.FixedAssetCardName = this.selectedFixedAssetCards == null ? null : this.selectedFixedAssetCards.map(x=>x.FixedAssetCardId);
    this.fixedAsset.FixedAssetCardCategoryName = this.selectedFixedAssetCardCategories == null ? null : this.selectedFixedAssetCardCategories.map(x=>x.FixedAssetCardCategoryId);
    this.fixedAsset.Departments = this.selectedDepartments == null ? null : this.selectedDepartments.map(x=>x.DepartmentId);
    this.fixedAsset.Brands = this.selectedBrands == null ? null : this.selectedBrands.map(x=>x.FixedAssetCardBrandId);
    this.fixedAsset.Statuses = this.selectedStatus == null ? null :this.selectedStatus.map(x=>x.FixedAssetStatusId);
    this.fixedAsset.Locations = this.selectedLocations == null ? null : this.selectedLocations.map(x=>x.LocationId);
    this.fixedAsset.Models = this.selectedModels == null ? null : this.selectedModels.map(x=>x.FixedAssetCardModelId);
    this.fixedAsset.Users = this.selectedUsers == null ?null : this.selectedUsers.map(x=>x.UserId);
    
    this.fixedAsset.StartDate = this.fixedAsset.StartDate == null ? null : data.value.startDate;
    this.fixedAsset.EndDate = this.fixedAsset.EndDate == null ? null : data.value.endDate;
    this.fixedAsset.IsGuaranteed = data.value.IsGuaranteed;
    this.fixedAsset.IsCalculatedDepreciation = data.value.IsCalculatedDepreciation;
    this.fixedAsset.IsCalculatedIFRSDepreciation = data.value.IsCalculatedIFRSDepreciation;

    this.fixedAsset.FixedAssetPropertyArray = propertyDetail;

    let cloneItem = new FixedAssetFilter();
    Object.assign(cloneItem, this.fixedAsset);

    await this.baseService.fixedAssetService.FilterFixedAsset(
      cloneItem,
      (fixedAssets: FixedAsset[]) => {
        /* Show success pop up */
        // this.baseService.popupService.ShowSuccessPopup(message);

        this.fixedAssetFilterList=fixedAssets;
        this.faComponent.dataTable.TGT_loadData(this.fixedAssetFilterList);
       this.faComponent.refreshTable();
        // $('#').trigger('click');
        // this.loadFixedAssetFilterList();
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        console.log(error);
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadFixedAssetFilterList() {
    this.baseService.fixedAssetService.GetFixedAsset(
      (fa: FixedAsset[]) => {
        // this.fixedAssetFilterList = fa;
        this.fixedAssetFilterList.forEach(e => {
          e.FixedAssetPropertyDetails.forEach(p => {
            if (p.FixedAssetCardPropertyId) {
              e["PROP_" + p.FixedAssetCardPropertyId.toString()] = p.Value;
            }
          });
        });
        this.faComponent.dataTable.TGT_loadData(this.fixedAssetFilterList);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }


  /* Selected Fixed Asset Cards */
  onSelectFixedAssetCard(item: FixedAssetCard) {
    this.selectedFixedAssetCards.push(item);
  }
  onSelectAllFixedAssetCard(items: any) {
    this.selectedFixedAssetCards.push(items);
  }

  /* Selected Fixed Asset Card Categories */
  onSelectCategory(item: FixedAssetCardCategory) {
    this.selectedFixedAssetCardCategories.push(item);
  }
  onSelectAllCategory(items: any) {
    this.selectedFixedAssetCardCategories.push(items);
  }

  /* Selected Departments */
  onSelectDepartment(item: Department) {
    this.selectedDepartments.push(item);
  }
  onSelectAllDepartment(items: any) {
    this.selectedDepartments.push(items);
  }

  /* Selected Fixed Asset Card Brand */
  onSelectFixedAssetCardBrand(item: FixedAssetCardBrand) {
    this.selectedBrands.push(item);
  }
  onSelectAllFixedAssetCardBrand(items: any) {
    this.selectedBrands.push(items);
  }

  /* Selected Status */
  onSelectStatus(item: FixedAssetStatus) {
    this.selectedStatus.push(item);
  }
  onSelectAllStatus(items: any) {
    this.selectedStatus.push(items);
  }

  /* Selected Location */
  onSelectLocation(item: Location) {
    this.selectedLocations.push(item);
  }
  onSelectAllLocation(items: any) {
    this.selectedLocations.push(items);
  }

  /* Selected Fixed Asset Card Model */
  onSelectFixedAssetCardModel(item: FixedAssetCardModel) {
    this.selectedModels.push(item);
  }
  onSelectAllFixedAssetCardModel(items: any) {
    this.selectedModels.push(items);
  }

  /* Selected Users */
  onSelectUser(item: User) {
    this.selectedUsers.push(item);
  }
  onSelectAllUser(items: any) {
    this.selectedUsers.push(items);
  }
}
