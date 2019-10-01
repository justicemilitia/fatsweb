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
  isFirmDropdownOpen: boolean = false;
  isUserDropdownOpen:boolean = false;

  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;


  public dataTableLocation: TreeGridTable = new TreeGridTable(
    "location",
    [
      {
        columnDisplayName: this.getLanguageValue('Location'),
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

  public dataTableFirm: TreeGridTable = new TreeGridTable(
    "firm",
    [
      {
        columnDisplayName: this.getLanguageValue('Firm'),
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

  public dataTableUser: TreeGridTable = new TreeGridTable(
    "user",
    [
      {
        columnDisplayName: "Kullanıcı",
        columnName: ["FirstName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value != null ? value.FirstName + ' ' + value.LastName : '';
          }
          else {
            return '';
          }
        }
      }
    ],
    {
      isDesc: false,
      column: ["FirstName"]
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

    this.dataTableFirm.isPagingActive = false;
    this.dataTableFirm.isColumnOffsetActive = false;
    this.dataTableFirm.isDeleteable = false;
    this.dataTableFirm.isLoading = false;
    this.dataTableFirm.isScrollActive=false;
    this.dataTableFirm.isSelectAllWithChildrenActive=true;
    this.dataTableFirm.isMultipleSelectedActive=false;

    this.dataTableUser.isPagingActive = false;
    this.dataTableUser.isColumnOffsetActive = false;
    this.dataTableUser.isDeleteable = false;
    this.dataTableUser.isLoading = false;
    this.dataTableUser.isScrollActive=false;
    this.dataTableUser.isSelectAllWithChildrenActive = true;
    this.dataTableUser.isMultipleSelectedActive=true;

    $(document).on("click", e => {
      if (
        $(e.target).closest(".custom-dropdown").length == 0 && 
        $(e.target).closest("#btnFirm").length == 0 &&
        $(e.target).closest("#btnLocation").length == 0 && 
        $(e.target).closest("#btnDepartment").length == 0 &&
        $(e.target).closest('#btnUser').length == 0
      ) {
        this.isFirmDropdownOpen=false;
        this.isLocationDropdownOpen = false;
        this.isDepartmentDropdownOpen = false;
        this.isUserDropdownOpen = false;
      }
    });

    this.dataTableLocation.TGT_clearData();
    this.dataTableDepartment.TGT_clearData();
    this.dataTableUser.TGT_clearData();
  }

  ngOnInit() {}

  toggleDropdown(key:string) {

    switch (key) {

    case "firm":
    this.isFirmDropdownOpen = !this.isFirmDropdownOpen;
    this.isLocationDropdownOpen = false;
    this.isDepartmentDropdownOpen=false;
    this.isUserDropdownOpen=false;
    break;

    case "location":
    this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
    this.isDepartmentDropdownOpen=false;
    this.isFirmDropdownOpen = false;  
    this.isUserDropdownOpen=false;    
    if(this.selectedFirm!= null){
    this.loadDropdownListByFirmId(this.selectedFirm.FirmId); 
    }   
    break;

    case "department":
    this.isDepartmentDropdownOpen=!this.isDepartmentDropdownOpen;
    this.isLocationDropdownOpen = false;
    this.isFirmDropdownOpen = false;  
    this.isUserDropdownOpen=false;      
    this.loadDepartmentByLocationId();
    break;

    case "user":
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    this.isDepartmentDropdownOpen=false;
    this.isFirmDropdownOpen = false;  
    this.isLocationDropdownOpen = false;
    if(this.selectedFirm!= null){
      this.loadDropdownListByFirmId(this.selectedFirm.FirmId); 
    }
    break;
    }
  }

  selectedLocation: Location;
  onClickLocation(item) {
    this.selectedLocation = item;
    this.selectedDepartment = null;
  }

  selectedDepartment: Department;
  onClickDepartment(item) {
    this.selectedDepartment = item;
  }

  selectedFirm: Firm;
  onClickFirm(item) {
    this.selectedFirm = item;
    this.selectedLocation = null;
    this.selectedDepartment = null;

    this.loadDropdownListByFirmId(this.selectedFirm.FirmId); 
    
  }

  selectedUser: User;
  onClickUser(item) {
    this.selectedUser = item;
  }

  onSubmit(data: NgForm) {
    if (this.selectedLocation != null && this.selectedFirm != null) 
    this.popupComponent.ShowModal('#modalShowQuestionPopupForChangeFirm');

    else
    return;
  }

  async ChangeFirm(data: NgForm) {

          let cloneItem = new FixedAsset();
          Object.assign(cloneItem, this.faBarcode);

          cloneItem.FirmId = Number(this.selectedFirm == null ? null : this.selectedFirm.FirmId);
          cloneItem.LocationId = Number(this.selectedLocation == null ? null : this.selectedLocation.LocationId);
          cloneItem.DepartmentId = Number(this.selectedDepartment == null ? null :this.selectedDepartment.DepartmentId);
          cloneItem.UserId = Number(this.selectedUser == null ? null : this.selectedUser.UserId);

          this.isWaitingInsertOrUpdate = true;

          this.baseService.spinner.show();

          this.baseService.fixedAssetService.ChangeFirm(
            cloneItem,
            (insertedItem: FixedAsset, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              this.baseService.spinner.hide();
              
              this.isWaitingInsertOrUpdate = false;

              /* Set inserted Item id to model */
              this.faBarcode.FirmId = cloneItem.FirmId;
             
              this.resetForm(data);
              this.resetDropdown('location');
              this.resetDropdown('department');

              this.faTable.TGT_removeItem(this.faBarcode);
              this.faComponent.loadFixedAsset();
            },
            (error: HttpErrorResponse) => {
              /* Show alert message */
              this.baseService.popupService.ShowErrorPopup(error);

              this.isWaitingInsertOrUpdate = false;
              
              this.baseService.spinner.hide();

            }
          );
    this.popupComponent.CloseModal('#modalShowQuestionPopupForChangeFirm');
    this.popupComponent.ShowModal('#modalChangeFirm');  
    this.resetForm(data);    
  }


  resetForm(data: NgForm) {

    data.resetForm();

    this.selectedDepartment = null;
    this.selectedLocation = null;
    this.selectedFirm = null;
    this.selectedUser=null;

    this.dataTableLocation.TGT_clearData();
    this.dataTableDepartment.TGT_clearData();
    this.dataTableUser.TGT_clearData();
    this.dataTableFirm.TGT_clearData();
  }


  resetDropdown(key:string){
    switch(key){
      case "firm":
      this.selectedFirm = null;      
      break;
      case "location":
      this.selectedLocation = null;
      break;
      case "department":
      this.selectedDepartment = null;      
      break;
      case "user":
      this.selectedUser = null;      
      break;
    }
  }
  closeChangeFirmPopup(){
    this.popupComponent.CloseModal("#modalShowQuestionPopupForChangeFirm");
  }

  async loadDropdownList() {

    //Get Firms
    this.baseService.userService.GetFirms(
      (firms:Firm[])=>
      {
        this.firms=firms;
        this.dataTableFirm.TGT_loadData(this.firms);
      },(error: HttpErrorResponse)=>{

      });

  }

  loadDropdownListByFirmId(firmId: number) {
    this.baseService.locationService.GetLocationsByFirmId(
      firmId,
      locations => {
        this.locations = locations;
        this.dataTableLocation.TGT_loadData(this.locations);        
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.userService.GetUserByFirmId(
      firmId,
      users => {
        this.users = users;
        this.dataTableUser.TGT_loadData(users);
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
