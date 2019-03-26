import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Location } from "../../../models/Location";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";

@Component({
  selector: "app-location",
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [LocationComponent],
  providers: [LocationComponent]
})
export class LocationComponent extends BaseComponent implements OnInit {

  /* Is Request send and waiting for response ? */
  isWaitingInsertOrUpdate: boolean = false;

  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;

  /* Is Table Exporting */

  isTableExporting: boolean = false;

  /* Location list */
  locations: Location[] = [];

  /* Current edit location */
  location: Location = new Location();

  public dataTable: TreeGridTable = new TreeGridTable(
    "location",
    [
      {
        columnDisplayName: "Lokasyon Adı",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
      },
      {
        columnDisplayName: "Lokasyon Kodu",
        columnName: ["LocationCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
      },
      {
        columnDisplayName: "Lokasyon Barkodu",
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
      },
      {
        columnDisplayName: "Koordinat",
        columnName: ["Coordinate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Adres",
        columnName: ["Address"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
      },
      {
        columnDisplayName: "Açıklama",
        columnName: ["Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );
  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadLocations();
  }

  ngOnInit() { }

  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.location);
    if (isNewItem == true) {
      this.location = new Location();
    }
  }

  onSubmit(data: NgForm) {

    /* Check model state is valid */
    if (data.form.invalid == true) return;

    if (this.location.LocationId == null) {
      this.addLocation(data);
    } else {
      this.updateLocation(data);
    }
  }

  get getLocationsWithoutCurrent() {
    return this.locations.filter(x => x.LocationId != this.location.LocationId);
  }

  async deleteLocations() {

    /* get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup("Lütfen en az bir lokasyon seçiniz");
      return;
    }

    /* Show Question Message */
    this.baseService.popupService.ShowQuestionPopupForDelete(() => {

      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.locationService.DeleteLocations(itemIds, () => {

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* if all of them removed */
        if (itemIds.length == 1)
          this.baseService.popupService.ShowSuccessPopup("Kayıt Başarıyla silindi!");
        else
          this.baseService.popupService.ShowSuccessPopup("Tüm kayıtlar başarıyla silindi!");

        /* Clear all the ids from table */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Copy original source to current locations */
        this.locations = <Location[]>this.dataTable.TGT_copySource();

      }, (error: HttpErrorResponse) => {

        /* Hide spinner then show error message */
        this.baseService.spinner.hide();

        /* Show error message */
        this.baseService.popupService.ShowErrorPopup(error);

      });

    });
  }

  async addLocation(data: NgForm) {

    /* Show Loading bar */
    this.isWaitingInsertOrUpdate = true;

    /* Insert Location service */
    this.baseService.locationService.InsertLocation(this.location, (inserted: Location, message) => {

      /* Close waiting loader */
      this.isWaitingInsertOrUpdate = false;

      /* Show pop up */
      this.baseService.popupService.ShowSuccessPopup(message);

      this.location.LocationId = inserted.LocationId;

      /* Push new item the current list of locations then reload table */
      this.locations.push(this.location);
      this.dataTable.TGT_loadData(this.locations);

      /* reset all data */
      this.resetForm(data, true);

    }, (error: HttpErrorResponse) => {

      this.isWaitingInsertOrUpdate = false;

      /* Show error message */
      this.baseService.popupService.ShowErrorPopup(error);

    });
  }

  async updateLocation(data: NgForm) {

    /* Ask for approve question if its true then update the location */
    this.baseService.popupService.ShowQuestionPopupForUpdate((response: boolean) => {
      if (response == true) {

        /* loading icon visible */
        this.isWaitingInsertOrUpdate = true;

        /* Save parent to rollback it. Normally api says circuler error */
        let parentLocation = this.location.ParentLocation;
        this.location.ParentLocation = null;

        /* if user approve question update location. */
        this.baseService.locationService.UpdateLocation(this.location, (_location, message) => {

          /* Close loading icon */
          this.isWaitingInsertOrUpdate = false;

          this.baseService.popupService.ShowSuccessPopup(message);

          /* After update succeed get parent location then update it in table. */
          this.location.ParentLocation = this.locations.find(x => x.getId() == this.location.getParentId());
          let updatedLocation = new Location();
          Object.assign(updatedLocation, this.location);

          /* Update in table */
          this.dataTable.TGT_updateData(updatedLocation);

          /* Get original source from table */
          this.locations = <Location[]>this.dataTable.TGT_copySource();

        }, (error: HttpErrorResponse) => {

          /* Close loader */
          this.isWaitingInsertOrUpdate = false;

          /* Rollback the parent department */
          this.location.ParentLocation = parentLocation;

          /* Show error message */
          this.baseService.popupService.ShowErrorPopup(error);

        });
      }
    });
  }

  async loadLocations() {

    /* Load all fixed asset cards to datatable */
    await this.baseService.locationService.GetLocations(
      (locs: Location[]) => {
        this.locations = locs;
        this.dataTable.TGT_loadData(this.locations);
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.alertInfoService.pushDanger(error.message);
        this.baseService.errorService.errorManager(error);

      }
    );
  }

  async onDoubleClickItem(item: any) {
    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* get location information from server */
    await this.baseService.locationService.GetLocationById(item.LocationId, (result: Location) => {
      /* then bind it to location model to update */
      setTimeout(() => {

        /* Trigger to model to show it */
        $("#btnEditLocation").trigger("click");

        /* Close Loading */
        this.baseService.spinner.hide();

        /* bind result to model */
        this.location = result;

      }, 1000);
    }, (error: HttpErrorResponse) => {

      /* hide spinner */
      this.baseService.spinner.hide();

      this.baseService.alertInfoService.pushDanger(error.message);
      this.baseService.errorService.errorManager(error);

    }
    );
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadLocations();

    this.isTableRefreshing = false;

  }

}
