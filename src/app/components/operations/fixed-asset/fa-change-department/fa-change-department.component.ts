import {
  Component,
  OnInit,
  NgModule,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { Department } from "../../../../models/Department";
import { FixedAssetComponent } from "../fixed-asset.component";
import { TreeGridTable } from '../../../../extends/TreeGridTable/modules/TreeGridTable';

@Component({
  selector: "app-fa-change-department",
  templateUrl: "./fa-change-department.component.html",
  styleUrls: ["./fa-change-department.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaChangeDepartmentComponent],
  providers: [FaChangeDepartmentComponent]
})
export class FaChangeDepartmentComponent extends BaseComponent
  implements OnInit, OnChanges {

  @Input() faBarcode: FixedAsset = new FixedAsset();
  @Input() faComponent: FixedAssetComponent;

  newDepartmentId: number = null;

  /* List Of Departments */
  departments: Department[] = [];

  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;

  isDepartmentDropdownOpen:boolean = false;

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
    this.loadDepartmentByLocationId();

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
        $(e.target).closest("#btnDepartment").length == 0 
      ) {
          this.isDepartmentDropdownOpen = false;
        }
     });
    }

  ngOnInit() { }

  toggleDropdown(key:string) {

    switch (key) {
      
    case "department":
    this.isDepartmentDropdownOpen=!this.isDepartmentDropdownOpen;
    this.loadDepartmentByLocationId();

    break;
    }
  }

  selectedDepartment: Department;
  onClickDepartment(item) {
    this.selectedDepartment = item;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["faBarcode"].currentValue != changes["faBarcode"].previousValue
    ) {
      this.loadDepartmentByLocationId();
    }
  }

  async ChangeDepartment(data: NgForm) {
    /* Is Form Valid */
    if (this.selectedDepartment != null) return;

    await this.baseService.popupService.ShowQuestionPopupForDepartmentUpdate(
      (response: boolean) => {
        if (response == true) {
          let cloneItem = new FixedAsset();
          Object.assign(cloneItem, this.faBarcode);

          // cloneItem.DepartmentId = data.value.departmentIds;
          cloneItem.DepartmentId = Number(this.selectedDepartment == null ? null :this.selectedDepartment.DepartmentId);
          cloneItem.Department = this.departments.find(
            x => x.DepartmentId == this.selectedDepartment.DepartmentId
          );

          this.isWaitingInsertOrUpdate = true;

          this.baseService.fixedAssetService.ChangeDepartment(
            cloneItem,
            (insertedItem: FixedAsset, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);
              this.isWaitingInsertOrUpdate = false;

              /* Set inserted Item id to model */
              this.faBarcode.DepartmentId = cloneItem.DepartmentId;
              this.faBarcode.Department = cloneItem.Department;
              
              // this.resetForm(data, true);
              
              this.faComponent.loadFixedAsset();

              this.resetDropdown('department');
              
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

  resetForm(data: NgForm, isNewItem: boolean) {
    if (isNewItem == true) {
      this.faBarcode = new FixedAsset();
    }
    data.reset();
    data.resetForm(this.faBarcode);    
    // this.newDepartmentId = null;
  }

  resetDropdown(key:string){
    switch(key){
      case "department":
      this.selectedDepartment = null;      
      break;
    }
  }

  // async loadDropdownList() {
  //   /* Load departments to department dropdown */
  //   this.baseService.departmentService.GetDepartmentsByLocationId(
  //     this.faBarcode.DepartmentId,
  //     (departments: Department[]) => {
  //       this.departments = departments;
  //     },
  //     (error: HttpErrorResponse) => {
  //       this.baseService.popupService.ShowErrorPopup(error);
  //     }
  //   );
  // }

  loadDepartmentByLocationId() {
    this.departments = [];

    if (this.faBarcode.Location.LocationId == 0 || !this.faBarcode.Location.LocationId) {
      return;
    }

    if (this.faBarcode.Location) {
      this.baseService.departmentService.GetDepartmentsByLocationId(
        this.faBarcode.Location.LocationId,
        (departments: Department[]) => {
          this.departments = departments;
          this.dataTableDepartment.TGT_loadData(this.departments);          
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }
  }
}
