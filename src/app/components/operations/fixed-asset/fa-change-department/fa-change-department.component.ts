import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from '../../../../services/base.service';
import { TreeGridTable } from '../../../../extends/TreeGridTable/modules/TreeGridTable';
import { FixedAsset } from '../../../../models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';
import * as $ from "jquery";
import { Department } from '../../../../models/Department';

@Component({
  selector: 'app-fa-change-department',
  templateUrl: './fa-change-department.component.html',
  styleUrls: ['./fa-change-department.component.css']
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaChangeDepartmentComponent],
  providers: [FaChangeDepartmentComponent]
})
export class FaChangeDepartmentComponent extends BaseComponent implements OnInit {

  @Input() faBarcode: FixedAsset = new FixedAsset();
  newDepartmentId: number;

     /* List Of Departments */
     departments: Department[] = [];

  constructor(baseService: BaseService) { 
    super(baseService);
    this.loadDropdownList();
  }

  ngOnInit() {
  }

  async ChangeDepartment(data: NgForm) {
    
    /* Is Form Valid */
    if (data.form.invalid == true) return;
    let cloneItem=new FixedAsset();
    Object.assign(cloneItem, this.faBarcode);


    cloneItem.DepartmentId=data.value.departmentIds;

     await this.baseService.fixedAssetService.ChangeDepartment(
      cloneItem,
      (insertedItem: FixedAsset, message) => {
        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Set inserted Item id to model */
        this.faBarcode.Barcode = cloneItem.Barcode;

      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadDropdownList() {

    /* Load locations to location dropdown */
    await this.baseService.departmentService.GetDepartments(departments => {
      this.departments = departments
    }, (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }

}
