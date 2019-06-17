import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { Firm } from "../../../../models/Firm";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { UserFirm } from "src/app/models/UserFirm";
import { Department } from "src/app/models/Department";
import { Location } from "src/app/models/Location";
import { User } from "src/app/models/User";
import { FixedAssetComponent } from "../fixed-asset.component";
import { TransactionLog } from "../../../../models/TransactionLog";

@Component({
  selector: "app-fa-change-firm",
  templateUrl: "./fa-change-firm.component.html",
  styleUrls: ["./fa-change-firm.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaChangeFirmComponent],
  providers: [FaChangeFirmComponent]
})
export class FaChangeFirmComponent extends BaseComponent implements OnInit {
  @Input() faBarcode: FixedAsset = new FixedAsset();
  @Input() faTable: TreeGridTable = null;
  @Input() faComponent: FixedAssetComponent;

  newFirmId: number;

  /* List Of Firms */
  firms: Firm[] = [];

  userFirms: Firm[] = [];

  firmId: number;

  locationId: number;

  fixedAsset: FixedAsset = new FixedAsset();

  departments: Department[] = [];

  users: User[] = [];

  locations: Location[] = [];

  isLocationDropdownOpen: boolean = false;
  isDepartmentDropdownOpen:boolean = false;

  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;


  public dataTableLocation: TreeGridTable = new TreeGridTable(
    "location",
    [
      {
        columnDisplayName: "Lokasyon",
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
        columnDisplayName: "Departman",
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

  constructor(baseService: BaseService) {
    super(baseService);
    this.loadDropdownList();

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

    $(document).on("click", e => {
      if (
        $(e.target).closest(".custom-dropdown").length == 0 &&
        $(e.target).closest("#btnLocation").length == 0 && $(e.target).closest("#btnDepartment").length == 0 
      ) {
        this.isLocationDropdownOpen = false;
        this.isDepartmentDropdownOpen = false;
      }
    });
  }

  ngOnInit() {}

  toggleDropdown(key:string) {

    switch (key) {
      case "location":
    this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
    this.isDepartmentDropdownOpen=false;
    break;

    case "department":
    this.isDepartmentDropdownOpen=!this.isDepartmentDropdownOpen;
    this.isLocationDropdownOpen = false;
    this.loadDepartmentByLocationId();

    break;
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

  async ChangeFirm(data: NgForm) {
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    await this.baseService.popupService.ShowQuestionPopupForFirmUpdate(
      (response: boolean) => {
        if (response == true) {
          let cloneItem = new FixedAsset();
          Object.assign(cloneItem, this.faBarcode);

          cloneItem.FirmId = Number(data.value == null ? null : data.value.FirmId);
          cloneItem.LocationId = Number(this.selectedLocation == null ? null : this.selectedLocation.LocationId);
          cloneItem.DepartmentId = Number(this.selectedDepartment == null ? null :this.selectedDepartment.DepartmentId);
          cloneItem.UserId = Number(data.value == null ? null : data.value.UserId);

          this.isWaitingInsertOrUpdate = true;

          this.baseService.fixedAssetService.ChangeFirm(
            cloneItem,
            (insertedItem: FixedAsset, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              this.isWaitingInsertOrUpdate = false;

              /* Set inserted Item id to model */
              this.faBarcode.FirmId = cloneItem.FirmId;
             
              this.resetForm(data, true);
              this.resetDropdown('location');
              this.resetDropdown('department');

              this.faTable.TGT_removeItem(this.faBarcode);
              this.faComponent.loadFixedAsset();
            },
            (error: HttpErrorResponse) => {
              /* Show alert message */
              this.baseService.popupService.ShowErrorPopup(error);

              this.isWaitingInsertOrUpdate = false;
            }
          );
        }
      }
    );
  }

  // resetForm(cloneItem: FixedAsset, isNewItem: boolean) {
  //   if (isNewItem == true) {
  //     cloneItem = new FixedAsset();
  //   }
  // }

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.fixedAsset);
    if (isNewItem == true) {
      this.fixedAsset = new FixedAsset();
    }
  }


  resetDropdown(key:string){
    switch(key){
      case "location":
      this.selectedLocation = null;
      this.dataTableDepartment.TGT_clearData();
      break;
      case "department":
      this.selectedDepartment = null;      
      break;
    }
  }

  async loadDropdownList() {
    /* Load firms to firm dropdown */
    await this.baseService.userService.GetFirms(
      firms => {
        this.firms = firms;
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.firmService.GetUserFirmList(
      (firms: Firm[]) => {
        this.userFirms = firms;
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

    this.baseService.userService.GetUserByFirmId(
      this.firmId,
      users => {
        this.users = users;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadDepartmentByLocationId() {
    this.departments = [];
      if( this.selectedLocation != null){
      this.baseService.departmentService.GetDepartmentsByLocationId(

        this.selectedLocation.LocationId,
        (departments: Department[]) => {
          this.departments = departments;
          this.dataTableDepartment.TGT_loadData(this.departments);
        },
        (error: HttpErrorResponse) => {}
      );
    }
  }

  getFirmId(event) {
    if (event.target.value) {
      this.firmId = Number(event.target.value);
      this.loadDropdownListByFirmId();
    }
  }

  getLocationId(event) {
    if (event.target.value) {
      this.locationId = Number(event.target.value);
      this.loadDepartmentByLocationId();
    }
  }
}
