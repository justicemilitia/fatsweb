import { Component, OnInit, NgModule, OnChanges, SimpleChanges } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { Department } from "../../../models/Department";
import { Location } from "../../../models/Location";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { BaseComponent } from "../../base/base.component";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

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
export class DepartmentComponent extends BaseComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["selectedItems"]) {
      this.notDeletedBarcode= '';
    }
  }
  /* Is Request send and waiting for response ? */
  isWaitingInsertOrUpdate: boolean = false;

  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;

  /* Is Table Exporting */

  isTableExporting: boolean = false;

  /* List Of Departments */
  departments: Department[] = [];

  /* Departments For Dropdown */

  ddlDepartments: Department[] = [];

  /* List Of Locations */
  locations: Location[] = [];

  /* Current Edit Department */
  department: Department = new Department();

  notDeletedBarcode: string = '';
  selectedItems:any[]=[];

  public dataTable: TreeGridTable = new TreeGridTable(
    "department",
    [
      {
        columnDisplayName: this.getLanguageValue('Department_Name'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Department_Code'),
        columnName: ["DepartmentCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Parent_Location'),
        columnName: ["Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Department_Description'),
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

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.department);
    if (isNewItem == true) {
      this.department = new Department();
    }
  }

  onSubmit(data: NgForm) {

    /* Check model state is valid */
    if (data.form.invalid == true) return;

    if (this.department.DepartmentId == null) {
      this.insertDepartment(data);
    } else {
      this.popupComponent.ShowModal('#modalShowQuestionPopupForDepartment');
      this.popupComponent.CloseModal('#modalDepartment');
    }
  }

  get getDepartmentsWithoutCurrent() {
    return this.departments.filter(
      x => x.DepartmentId != this.department.DepartmentId
    );
  }

  async deleteDepartments() {
    /* get selected items from table */
    this.selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!this.selectedItems || this.selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir departman seçiniz"
      );
      return;
    }

    /* Show Question Message */
    // await this.baseService.popupService.ShowQuestionPopupForDelete(() => {
      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = this.selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.departmentService.DeleteDepartments(
        itemIds,
        () => {
          /* Deactive the spinner */
          this.baseService.spinner.hide();

          /* if all of them removed */
          if (itemIds.length == 1)
            this.baseService.popupService.ShowSuccessPopup(
              this.getLanguageValue('Delete_operation_successful')
            );
          else
            this.baseService.popupService.ShowSuccessPopup(
              this.getLanguageValue('All_records_deleted')
            );

          /* Clear all the ids from table */
          this.dataTable.TGT_removeItemsByIds(itemIds);

          /* Get Original source */
          this.departments = <Department[]>this.dataTable.TGT_copySource();
        },
        (itemIds:NotDeletedItem[],error: HttpErrorResponse) => {
        
        let barcode:Department;

        let notDeletedCodes : string[]=[];

        let departments = <Department[]>this.dataTable.TGT_copySource();
        
          /* Hide Loading Spinner */
          this.baseService.spinner.hide();

          itemIds.forEach((e:NotDeletedItem) => {
            for(let i=0; i<itemIds.length; i++){
          barcode = departments.find(x=>x.DepartmentId == e[i].Id);
          }     
            notDeletedCodes.push(barcode.DepartmentCode);
          });

          /* Show error message */
          if(itemIds.length>0)
          {
          // this.baseService.popupService.ShowDeletePopup(error,notDeletedCodes);
          
          notDeletedCodes.forEach((e, i) => {
            this.notDeletedBarcode +=
              e + (i == this.selectedItems.length - 1 ? "" : ", ");
          });
           this.popupComponent.ShowModal('#modalShowErrorPopup');     
          }
          else
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
      this.popupComponent.CloseModal('#modalShowDeletePopupForDepartment');      
    // });
  }

  loadDepartmentByLocationId(event: any) {
    this.ddlDepartments = [];

    if (!event.target.value || event.target.value == "") {
      this.department.DepartmentId = null;
      this.department = new Department();
      return;
    }

    if (event.target.value) {
      this.baseService.departmentService.GetDepartmentsByLocationId(
        <number>event.target.value,
        (departments: Department[]) => {
          this.ddlDepartments = departments;
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }
  }

  async insertDepartment(data: NgForm) {
    /* Check model state is valid */
    if (data.form.invalid == true) return;

    /* Find Location for selected location */
    let location = this.locations.find(
      x => x.LocationId == this.department.LocationId
    );
    if (!location) location = new Location();

    /* if department location instance is empty then create a new one */
    if (!this.department.Location) this.department.Location = new Location();

    /* Bind found item to department model */
    this.department.Location.LocationId = location.LocationId;
    this.department.Location.Name = location.Name;

    /* Show Loading bar */
    this.isWaitingInsertOrUpdate = true;

    /* Insert Department service */
    await this.baseService.departmentService.InsertDepartment(
      this.department,
      (insertedItem: Department, message) => {
        /* Close waiting loader */
        this.isWaitingInsertOrUpdate = false;

        /* Show pop up */
        this.baseService.popupService.ShowSuccessPopup(message);
        this.department.DepartmentId = insertedItem.DepartmentId;

        /* Push new item to current list of locations then reload table */
        this.departments.push(this.department);
        this.dataTable.TGT_loadData(this.departments);

        /* Reset all data */
        this.resetForm(data, true);
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.isWaitingInsertOrUpdate = false;
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async updateDepartment(data: NgForm) {
    
          /* loading icon visible */
          this.isWaitingInsertOrUpdate = true;

          let willUpdateItem = new Department();
          Object.assign(willUpdateItem, this.department);
          
          /* Find Location for selected location */
          let location = this.locations.find(
            x => x.LocationId == this.department.LocationId
          );
          if (!location) location = new Location();

          /* if department location instance is empty then create a new one */
          if (!this.department.Location)
            this.department.Location = new Location();

          /* Bind found item to department model */
          this.department.Location.LocationId = location.LocationId;
          this.department.Location.Name = location.Name;

          /* Save parent to rollback it. Normally api says circuler error */
          let parentDepartment = this.department.ParentDepartment;
          this.department.ParentDepartment = null;

        
          /* if user approve question update department */
          this.baseService.departmentService.UpdateDepartment(
            this.department,
            (_department, message) => {
              /* Close loading icon */
              this.isWaitingInsertOrUpdate = false;

              /* Show pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              /* After update succeed get parent location then update it in table. */
              this.department.ParentDepartment = this.departments.find(
                x => x.getId() == this.department.getParentId()
              );
              let updatedDepartment = new Department();
              Object.assign(updatedDepartment, this.department);

              /* Update in table */
              this.dataTable.TGT_updateData(updatedDepartment);

              /* Get original source */
              this.departments = <Department[]>this.dataTable.TGT_copySource();
            },
            (error: HttpErrorResponse) => {
              /* Close loader */
              this.isWaitingInsertOrUpdate = false;

              /* Rollback the parent department */
              this.department.ParentDepartment = parentDepartment;

              /* Show error message */
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
        this.popupComponent.CloseModal('#modalShowQuestionPopupForDepartment');          
  }

  async loadDropdownList() {
    /* Load locations to location dropdown */
    await this.baseService.locationService.GetLocations(
      locations => {
        this.locations = locations;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    /* Load locations to location dropdown */
    // await this.baseService.departmentService.GetDepartments(
    //   departments => {
    //     this.ddlDepartments = departments;
    //   },
    //   (error: HttpErrorResponse) => {
    //     this.baseService.popupService.ShowErrorPopup(error);
    //   }
    // );
  }

  async loadDepartments() {
    /* Load all departments to datatable */
    await this.baseService.departmentService.GetDepartments(
      (departments: Department[]) => {
        this.departments = departments;
        this.dataTable.TGT_loadData(this.departments);
        if(this.departments.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async onDoubleClickItem(item: any) {
    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* get department information from server */
    await this.baseService.departmentService.GetDepartmentById(
      item.DepartmentId,
      (result: Department) => {
        /* then bind it to department model to update */
        setTimeout(() => {
          /* Trigger to model to show it */
          $("#btnEditDepartment").trigger("click");

          /* close spinner */
          this.baseService.spinner.hide();

          /* bind result to model */
          this.department = result;
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        /* hide spinner */
        this.baseService.spinner.hide();

        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadDepartments();

    this.isTableRefreshing = false;
  }
}
