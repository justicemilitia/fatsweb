import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
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
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [LocationComponent],
  providers: [LocationComponent]
})
export class LocationComponent extends BaseComponent implements OnInit {
  locations: Location[] = [];
  location: Location = new Location();

  public dataTable: TreeGridTable = new TreeGridTable("location",
    [
      {
        columnDisplayName: "Lokasyon Adı",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Kodu",
        columnName: ["Code"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Barkodu",
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
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
        columnDisplayName: "Bağlı Olduğu Lokasyon",
        columnName: ["ParentLocation"],
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
    this.loadLocations();
  }

  ngOnInit() {}

  loadLocations() {
    this.baseService.locationService.GetLocations(
      (locs: Location[]) => {
        this.locations = locs;
        this.dataTable.TGT_loadData(this.locations);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  resetForm() {
    this.location = new Location();
  }

  OnSubmit(data: NgForm) {
    if (data.value.LocationId == null) this.insertLocation(data);
    else this.updateLocation(data);
  }

  insertLocation(data: NgForm) {
    if (data.form.invalid == true) 
      return;
    this.location = <Location>data.value;
    this.baseService.locationService.InsertLocation(
      this.location,
      (data: Location, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.locations.push(data);
        this.dataTable.TGT_loadData(this.locations);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  updateLocation(data: NgForm) {
    this.location = <Location>data.value;
    this.baseService.popupService.ShowQuestionPopupForUpdate(response => {
      if (response == true) {
        this.baseService.locationService.UpdateLocation(
          this.location,
          (location, message) => {
            this.baseService.popupService.ShowSuccessPopup(message);
            this.dataTable.TGT_updateData(location);
          },
          (error: HttpErrorResponse) => {
            this.baseService.popupService.ShowErrorPopup(error);
          }
        );
      }
    });
  }

  onDoubleClickItem(item: any) {
    this.baseService.locationService.GetLocationById(item.LocationId, result => {
      this.location = result;
    }, (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });
    $("#btnAddLocation").trigger("click");
    $("#btnInsertOrUpdateLocation").html("Güncelle");
  
  }
}
