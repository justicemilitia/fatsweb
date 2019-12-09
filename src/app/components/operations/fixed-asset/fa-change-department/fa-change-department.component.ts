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
  implements OnInit {

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
  
  constructor(baseService: BaseService) {
    super(baseService);
    this.loadDropdownList();

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
    break;
    }
  }

  selectedDepartment: Department;
  onClickDepartment(item) {
    this.selectedDepartment = item;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (
  //     changes["faBarcode"].currentValue != changes["faBarcode"].previousValue
  //   ) {
  //     this.loadDepartmentByLocationId();
  //   }
  // }

  onSubmit(data: NgForm) {

    if (this.selectedDepartment != null) 
    this.popupComponent.ShowModal('#modalShowQuestionPopupForChangeDepartment');
    
    else
    return;

  }

  async ChangeDepartment(data: NgForm) {

          let cloneItem = new FixedAsset();
          Object.assign(cloneItem, this.faBarcode);

          // cloneItem.DepartmentId = data.value.departmentIds;
          cloneItem.DepartmentId = Number(this.selectedDepartment == null ? null :this.selectedDepartment.DepartmentId);
          cloneItem.Department = this.departments.find(
            x => x.DepartmentId == this.selectedDepartment.DepartmentId
          );

          this.isWaitingInsertOrUpdate = true;

          this.baseService.spinner.show();

          this.baseService.fixedAssetService.ChangeDepartment(
            cloneItem,
            (insertedItem: FixedAsset, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              this.baseService.spinner.hide();

              this.isWaitingInsertOrUpdate = false;

              /* Set inserted Item id to model */
              this.faBarcode.DepartmentId = cloneItem.DepartmentId;
              this.faBarcode.Department = cloneItem.Department;
              this.faBarcode.Department.Name = cloneItem.Department.Name;
              // this.resetForm(data, true);
              
              this.faComponent.loadFixedAsset();
              this.resetDropdown('department');
              
            },
            (error: HttpErrorResponse) => {
              /* Show alert message */
              this.isWaitingInsertOrUpdate = false;

              this.baseService.spinner.hide();
              
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
          this.popupComponent.CloseModal('#modalShowQuestionPopupForChangeDepartment');
          this.popupComponent.ShowModal('#modalChangeDepartment');    
          this.resetForm(data);
  }

  resetForm(data: NgForm) {
    data.resetForm();
    this.selectedDepartment = null;  
  }

  resetDropdown(key:string){
    switch(key){
      case "department":
      this.selectedDepartment = null;      
      break;
    }
  }

  closeChangeDepartmentPopup(){
    this.popupComponent.CloseModal("#modalShowQuestionPopupForChangeDepartment");
  }

  async loadDropdownList() {
    /* Load departments to department dropdown */
    this.baseService.departmentService.GetDepartments(
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
