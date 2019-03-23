import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from '../../../../services/base.service';
import { TreeGridTable } from '../../../../extends/TreeGridTable/modules/TreeGridTable';
import { FixedAsset } from '../../../../models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';
import * as $ from "jquery";

@Component({
  selector: 'app-fa-change-location',
  templateUrl: './fa-change-location.component.html',
  styleUrls: ['./fa-change-location.component.css']
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaChangeLocationComponent],
  providers: [FaChangeLocationComponent]
})
export class FaChangeLocationComponent extends BaseComponent implements OnInit {

  @Input() faBarcode: FixedAsset = new FixedAsset();
  newLocationId: number;

   /* List Of Locations */
  locations: Location[] = [];

   constructor(baseService: BaseService) {
    super(baseService);
    this.loadDropdownList();
  }

  ngOnInit() {
  } 

  async ChangeLocation(data: NgForm) {

    /* Is Form Valid */
    if (data.form.invalid == true) return;
    let cloneItem=new FixedAsset();
    Object.assign(cloneItem, this.faBarcode);


    cloneItem.LocationId=data.value.locationIds;

     await this.baseService.fixedAssetService.ChangeLocation(
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
    await this.baseService.locationService.GetLocations(locations => {
      this.locations = locations
    }, (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }
}
