import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { Location } from 'src/app/models/Location';
import { FixedAssetComponent } from '../fixed-asset.component';
import { TreeGridTable } from '../../../../extends/TreeGridTable/modules/TreeGridTable';
import { Department } from '../../../../models/Department';

@Component({
  selector: "app-fa-change-location",
  templateUrl: "./fa-change-location.component.html",
  styleUrls: ["./fa-change-location.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaChangeLocationComponent],
  providers: [FaChangeLocationComponent]
})
export class FaChangeLocationComponent extends BaseComponent implements OnInit {
  @Input() faBarcode: FixedAsset = new FixedAsset();
  @Input() faComponent: FixedAssetComponent;
  
  newLocationId: number = null;

  locations: Location[] = [];
  departments: Department[] = [];

  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;

  isLocationDropdownOpen: boolean = false;  
  isDepartmentDropdownOpen:boolean = false;
  

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

  ngOnInit() { }

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


  async ChangeLocation(data: NgForm) {
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    this.baseService.popupService.ShowQuestionPopupForLocationUpdate(
      (response: boolean) => {
        if (response == true) {
          let cloneItem = new FixedAsset();
          Object.assign(cloneItem, this.faBarcode);

          //cloneItem.LocationId = data.value.locationIds;
          //cloneItem.Location = this.locations.find(x => x.LocationId == cloneItem.LocationId);        
          // cloneItem.DepartmentId = data.value.DepartmentId;

          cloneItem.LocationId = this.selectedLocation.LocationId;
          cloneItem.DepartmentId = this.selectedDepartment == null ? null : this.selectedDepartment.DepartmentId;
          

          this.isWaitingInsertOrUpdate = true;

          this.baseService.fixedAssetService.ChangeLocation(
            cloneItem,
            (insertedItem: FixedAsset, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);
              this.isWaitingInsertOrUpdate = false;
              /* Set inserted Item id to model */
              this.faBarcode.LocationId = cloneItem.LocationId;
              this.faBarcode.Location = cloneItem.Location;
              this.faBarcode.Department = cloneItem.Department;
              this.faBarcode.DepartmentId = cloneItem.DepartmentId;
              data.resetForm();
              this.faComponent.loadFixedAsset();
            },
            (error: HttpErrorResponse) => {
              /* Show alert message */
              this.isWaitingInsertOrUpdate = false;
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
        }
      }
    );
  }

  resetForm(data: NgForm) {
    data.resetForm();
    this.newLocationId = null;
  }

  async loadDropdownList() {
    /* Load locations to location dropdown */
    await this.baseService.locationService.GetLocations(
      locations => {
        this.locations = locations;
        this.dataTableLocation.TGT_loadData(this.locations);        
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

}
