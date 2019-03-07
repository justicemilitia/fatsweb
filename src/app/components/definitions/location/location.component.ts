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
  locations: Location[] = [];
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
    console.log(this.dataTable.dataColumns);
    this.loadLocations();
  }

  ngOnInit() { }

  resetForm() {
    this.location = new Location();
  }

  onSubmit(data: NgForm) {
    if (data.value.LocationId == null) {
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
    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {

      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      debugger;
      this.baseService.locationService.DeleteLocations(itemIds, (notDeletedItemIds: number[]) => {

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
            this.baseService.popupService.ShowAlertPopup("Hiçbir Kayıt Silinemedi!");
            return;
          }

          /* if some of them is deleted show this */
          if (itemIds.length > 0) {
            this.baseService.popupService.ShowAlertPopup(selectedItems.length.toString() + ' kayıttan ' + itemIds.length.toString() + "'i silinebildi!");
          }

        } else {

          /* if all of them removed */
          this.baseService.popupService.ShowAlertPopup(" Tüm kayıtlar başarıyla silindi!");

        }

        /* Now Delete items from the source */
        for (let ii = 0; ii < itemIds.length; ii++) {
          let index = this.locations.findIndex(x => x.LocationId == itemIds[ii]);
          if (index > -1) {
            this.locations.splice(index, 1);
          }
        }

        /* Reload Page */
        this.dataTable.TGT_loadData(this.locations);

      }, (error: HttpErrorResponse) => {

        this.baseService.spinner.hide();
        this.baseService.popupService.ShowErrorPopup(error);

      });

    });
  }

  async addLocation(data: NgForm) {

    /* Check model state is valid */
    if (data.form.invalid == true) return;

    /* Insert Location service */
    await this.baseService.locationService.InsertLocation(
      this.location,
      (inserted: Location, message) => {

        /* Show pop up, get inserted location then set it location id, then load data. */
        this.baseService.popupService.ShowSuccessPopup(message);
        this.location.LocationId = inserted.LocationId;
        this.locations.push(this.location);
        this.dataTable.TGT_loadData(this.locations);
        
        /* reset all data */
        this.resetForm();
        data.resetForm();

      },
      (error: HttpErrorResponse) => {

        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);

      }
    );
  }

  async updateLocation(data: NgForm) {
    /* Check model state */
    if (data.form.invalid == true) return;

    /* Ask for approve question if its true then update the location */
    await this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {

          /* if user approve question update user. */
          this.baseService.locationService.UpdateLocation(
            this.location,
            (_location, message) => {

              /* Show pop up then update data in datatable */
              this.baseService.popupService.ShowSuccessPopup(message);

              /* After update succeed get parent location then update it in table. */
              this.location.ParentLocation = this.locations.find(x => x.getId() == this.location.getParentId());
              this.dataTable.TGT_updateData(this.location);

              /* reset form */
              this.resetForm();
              data.resetForm();

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

  async loadLocations() {

    /* Load all fixed asset cards to datatable */
    await this.baseService.locationService.GetLocations(
      (locs: Location[]) => {
        this.locations = locs;
        this.dataTable.TGT_loadData(this.locations);
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

    /* get location information from server */
    await this.baseService.locationService.GetLocationById(
      item.LocationId,
      (result: Location) => {
        /* then bind it to location model to update */
        setTimeout(() => {

          /* Trigger to model to show it */
          $("#btnAddLocation").trigger("click");

          /* bind result to model */
          this.location = result;
          this.baseService.spinner.hide();

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
}
