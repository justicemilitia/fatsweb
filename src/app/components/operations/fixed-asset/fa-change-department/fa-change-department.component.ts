import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { Department } from "../../../../models/Department";

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
  newDepartmentId: number = null;

  /* List Of Departments */
  departments: Department[] = [];

  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;

  constructor(baseService: BaseService) {
    super(baseService);
    this.loadDropdownList();
  }

  ngOnInit() { }

  async ChangeDepartment(data: NgForm) {
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    this.baseService.popupService.ShowQuestionPopupForDepartmentUpdate(
      (response: boolean) => {
        if (response == true) {
          let cloneItem = new FixedAsset();
          Object.assign(cloneItem, this.faBarcode);

          cloneItem.DepartmentId = data.value.departmentIds;
          cloneItem.Department = this.departments.find(x => x.DepartmentId == cloneItem.DepartmentId);

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
              data.resetForm();
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

  resetForm(data:NgForm) {
    data.resetForm();
    this.newDepartmentId = null;
  }

  async loadDropdownList() {
    /* Load locations to location dropdown */
    await this.baseService.departmentService.GetDepartments(
      departments => {
        this.departments = departments;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
