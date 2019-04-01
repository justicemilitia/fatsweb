import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { Location } from 'src/app/models/Location';

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
  newLocationId: number = null;

  /* List Of Locations */
  locations: Location[] = [];

  /* Is Waiting For An Insert Or Update */
  isWaitingInsertOrUpdate = false;


  constructor(baseService: BaseService) {
    super(baseService);
    this.loadDropdownList();
  }

  ngOnInit() { }

  async ChangeLocation(data: NgForm) {
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    this.baseService.popupService.ShowQuestionPopupForLocationUpdate(
      (response: boolean) => {
        if (response == true) {
          let cloneItem = new FixedAsset();
          Object.assign(cloneItem, this.faBarcode);

          cloneItem.LocationId = data.value.locationIds;

          cloneItem.Location = this.locations.find(x => x.LocationId == cloneItem.LocationId);

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

  resetForm(data: NgForm) {
    data.resetForm();
    this.newLocationId = null;
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
  }
}
