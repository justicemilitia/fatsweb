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

  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;

  constructor(baseService: BaseService) {
    super(baseService);
    this.loadDropdownList();
  }

  ngOnInit() {}

  async ChangeFirm(data: NgForm) {
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    await this.baseService.popupService.ShowQuestionPopupForFirmUpdate(
      (response: boolean) => {
        if (response == true) {
          let cloneItem = new FixedAsset();
          Object.assign(cloneItem, this.faBarcode);

          cloneItem.FirmId = Number(data.value.FirmId);
          cloneItem.LocationId = Number(data.value.LocationId);
          cloneItem.DepartmentId = Number(data.value.DepartmentId);
          cloneItem.UserId = Number(data.value.UserId);

          this.isWaitingInsertOrUpdate = true;

          this.baseService.fixedAssetService.ChangeFirm(
            cloneItem,
            (insertedItem: FixedAsset, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              this.isWaitingInsertOrUpdate = false;

              /* Set inserted Item id to model */
              this.faBarcode.FirmId = cloneItem.FirmId;
              if (
                this.faBarcode.FirmId !=
                this.baseService.authenticationService.currentFirm.FirmId
              )
                this.resetForm(data, true);
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

  resetForm(data: NgForm, isNewItem:boolean) {
    
    data.resetForm(this.fixedAsset);
    if (isNewItem == true) {
      this.fixedAsset = new FixedAsset();
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

  loadDepartmentByLocationId() {
    this.baseService.departmentService.GetDepartmentsByLocationId(
      this.locationId,
      departments => {
        1;
        this.departments = departments;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
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
