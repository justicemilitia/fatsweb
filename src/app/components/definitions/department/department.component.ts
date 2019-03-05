import { Component, OnInit, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { Department } from "../../../models/Department";
import { Location } from "../../../models/Location";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { BaseComponent } from "../../base/base.component";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";

@Component({
  selector: "app-department",
  templateUrl: "./department.component.html",
  styleUrls: ["./department.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [DepartmentComponent],
  providers: [DepartmentComponent]
})
export class DepartmentComponent extends BaseComponent implements OnInit {
  departments: Department[] = [];
  locations: Location[] = [];
  department: Department = new Department();

  public dataTable: TreeGridTable = new TreeGridTable("department",
    [
      {
        columnDisplayName: "Departman Adı",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Departman Kodu",
        columnName: ["DeparmtentCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Bağlı Olduğu Lokasyon",
        columnName: ["Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Açıklama",
        columnName: ["Description"],
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

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadDepartments();
    this.loadDropdownList();
  }

  ngOnInit() {}

  resetForm() {
    this.department = new Department();
  }

  onSubmit(data: NgForm) {
    if (data.value.DepartmentId == null) {
      this.insertDepartment(data);
    } else {
      this.updateDepartment(data);
    }
  }

  async deleteDepartments() {
    /* get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir departman seçiniz"
      );
      return;
    }

    /* Show Question Message */
    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {
      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.departmentService.DeleteDepartments(
        itemIds,
        (notDeletedItemIds: number[]) => {
          /* Deactive the spinner */
          this.baseService.spinner.hide();

          /* if any item exists in not deleted items */
          if (notDeletedItemIds) {
            /* Service return us not deleted ids. We will delete ids which exists in notDeletedItemIds number array */
            for (let ii = 0; ii < itemIds.length; ii++) {
              if (notDeletedItemIds.includes(itemIds[ii])) {
                itemIds.splice(ii, 1);
                ii--;
              }
            }

            /* if any value couldnt delete then show popup */
            if (itemIds.length == 0) {
              this.baseService.popupService.ShowAlertPopup(
                "Hiçbir Kayıt Silinemedi!"
              );
              return;
            }

            /* if some of them is deleted show this */
            if (itemIds.length > 0) {
              this.baseService.popupService.ShowAlertPopup(
                selectedItems.length.toString() +
                  " kayıttan " +
                  itemIds.length.toString() +
                  "'i silinebildi!"
              );
            }
          } else {
            /* if all of them removed */
            this.baseService.popupService.ShowAlertPopup(
              " Tüm kayıtlar başarıyla silindi!"
            );
          }

          /* Now Delete items from the source */
          for (let ii = 0; ii < itemIds.length; ii++) {
            let index = this.departments.findIndex(
              x => x.DepartmentId == itemIds[ii]
            );
            if (index > -1) {
              this.departments.splice(index, 1);
            }
          }

          /* Reload Page */
          this.dataTable.TGT_loadData(this.departments);
        },
        (error: HttpErrorResponse) => {
          this.baseService.spinner.hide();
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    });
  }

  async insertDepartment(data: NgForm) {
    /* Check model state is valid */
    if (data.form.invalid == true) return;

    /* Insert Department service */
    await this.baseService.departmentService.InsertDepartment(
      this.department,
      (data: Department, message) => {
        /* Show pop up, get inserted department then set it to department id, then load data. */
        this.baseService.popupService.ShowSuccessPopup(message);
        this.department.DepartmentId = data.DepartmentId;
        this.departments.push(this.department);
        this.dataTable.TGT_loadData(this.departments);
        this.resetForm();
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async updateDepartment(data: NgForm) {
    /* Check model state */
    if (data.form.invalid == true) return;

    /* Ask for approve question if its true then update the department */
    await this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {
          debugger;
          this.baseService.departmentService.UpdateDepartment(
            this.department,
            (_department, message) => {
              /* Show pop up then update data in datatable */
              this.baseService.popupService.ShowSuccessPopup(message);
              this.dataTable.TGT_updateData(this.department);
              this.resetForm();
            },
            (error: HttpErrorResponse) => {
              /* Show error message */
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
        }
      }
    );
  }

  async loadDropdownList() {
    await this.baseService.locationService.GetLocations(
      locations => (this.locations = locations),
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadDepartments() {
    /* Load all departments to datatable */
    await this.baseService.departmentService.GetDepartments(
      (departments: Department[]) => {
        this.departments = departments;
        this.dataTable.TGT_loadData(this.departments);
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadDepartmentById(event: any){

    if (event.target.value.toString().trim() !== '') {

      await this.baseService.departmentService.GetDepartmentById(<number>event.target.value, (departments: Department[]) => {

        /* Load departments */
        this.departments = departments;

      }, (error: HttpErrorResponse) => {

        /* show erro pop up */
        this.baseService.popupService.ShowErrorPopup(error);

      });

    }
  }
  
  async onDoubleClickItem(item: any) {
  
    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* get department information from server */
    await this.baseService.departmentService.GetDepartmentById(item.DepartmentId, (result: Department) => {

      /* then bind it to department model to update */
      setTimeout(() => {

        /* Trigger to model to show it */
        $("#btnAddDepartment").trigger("click");

        /* bind result to model */
        this.department = result;
        this.baseService.spinner.hide();

      }, 1000);

    }, (error: HttpErrorResponse) => {

       /* hide spinner */
       this.baseService.spinner.hide();

      /* show error message */
      this.baseService.popupService.ShowErrorPopup(error);

    });
  }
}
