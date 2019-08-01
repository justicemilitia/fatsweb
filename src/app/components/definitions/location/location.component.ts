import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Location } from "../../../models/Location";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';

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
        columnDisplayName: this.getLanguageValue('Location_Name'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Code'),
        columnName: ["LocationCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Barcode'),
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Coordinate'),
        columnName: ["Coordinate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Address'),
        columnName: ["Address"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Description'),
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
      this.popupComponent.ShowModal('#modalShowQuestionPopupForLocation');
      this.popupComponent.CloseModal('#modalLocation');
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
      this.baseService.popupService.ShowAlertPopup(this.getLanguageValue('Choose_at_least_one_location'));
      return;
    }

    /* Show Question Message */
    // this.baseService.popupService.ShowQuestionPopupForDelete(() => {

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
          this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('Delete_operation_successful'));
        else
          this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('All_records_deleted'));

        /* Clear all the ids from table */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Copy original source to current locations */
        this.locations = <Location[]>this.dataTable.TGT_copySource();

      }, (itemIds:NotDeletedItem[] ,error: HttpErrorResponse) => {

        let barcode:Location;

        let notDeletedCode : string[]=[];

        let locations = <Location[]>this.dataTable.TGT_copySource();
        
        /* Hide spinner then show error message */
        this.baseService.spinner.hide();

        itemIds.forEach((e:NotDeletedItem) => {
          for(let i=0; i<itemIds.length; i++){
        barcode = locations.find(x=>x.LocationId == e[i].Id);
        }     
          notDeletedCode.push(barcode.Barcode);
        });

        /* Show error message */
        if(itemIds.length>0)
        this.baseService.popupService.ShowDeletePopup(error,notDeletedCode);
        else
        this.baseService.popupService.ShowErrorPopup(error);

      });
      this.popupComponent.CloseModal('#modalShowDeletePopupForLocation');
    // });
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

  async updateLocation() {

        this.isWaitingInsertOrUpdate = true;
    
        let willUpdateItem = new Location();
        Object.assign(willUpdateItem, this.location);
        
        /* if user approve question update location. */
        this.baseService.locationService.UpdateLocation(this.location, (_location, message) => {

          /* After update succeed get parent location then update it in table. */
          this.location.ParentLocation = this.locations.find(x => x.getId() == this.location.getParentId());
        
          let updatedLocation = new Location();
          Object.assign(updatedLocation, this.location);

          /* Close loading icon */
          this.isWaitingInsertOrUpdate = false;

          this.baseService.popupService.ShowSuccessPopup(message);
          
          /* Update in table */
          this.dataTable.TGT_updateData(updatedLocation);

          /* Get original source from table */
          this.locations = <Location[]>this.dataTable.TGT_copySource();

        }, (error: HttpErrorResponse) => {

          /* Close loader */
          this.isWaitingInsertOrUpdate = false;

          /* Show error message */
          this.baseService.popupService.ShowErrorPopup(error);

        });

        this.popupComponent.CloseModal('#modalShowQuestionPopupForLocation');
  }

  async loadLocations() {

    /* Load all fixed asset cards to datatable */
    await this.baseService.locationService.GetLocations(
      (locs: Location[]) => {
        Object.assign(this.locations, locs);
        this.dataTable.TGT_loadData(this.locations);
        if(locs.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */

        /* Show error message */
        this.baseService.popupService.ShowErrorPopup(error);

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

      /* Show error message */
      this.baseService.popupService.ShowErrorPopup(error);

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
