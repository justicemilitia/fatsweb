import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Location } from "../../../models/Location";
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';

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
export class LocationComponent extends BaseComponent
  implements OnInit {
  insertingLocation: any = {};
  locations: Location[] = [];
  location: Location = new Location();

  public dataTable: TreeGridTable = new TreeGridTable(
    [
      {
        columnDisplayName: "Lokasyon Adı",
        columnName: "Name",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Kodu",
        columnName: "Code",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Barkodu",
        columnName: "Barcode",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Koordinat",
        columnName: "Coordinate",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Bağlı Olduğu Lokasyon",
        columnName: "ParentLocation",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Açıklama",
        columnName: "Description",
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      Code: "",
      Name: "",
      Barcode: "",
      Coordinate: "",
      ParentLocation: "",
      Description: ""
    },
    {
      isDesc: false,
      column: "Name"
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
      });
  }

  ResetForm(form?: NgForm) {
    if (form != null) this.ResetForm();
    this.location = new Location();
  }

  OnSubmit(data: NgForm) {
    if (data.value.LocationId == null) this.insertLocation(data);
    else this.updateLocation(data);
  }

  insertLocation(data: NgForm) {
    this.insertingLocation = <Location>data.value;
    this.baseService.locationService.InsertLocation(this.insertingLocation);
  }

  updateLocation(data: NgForm) {
    this.location = <Location>data.value;
    this.baseService.locationService.UpdateLocation(this.location);
    this.loadLocations();
  }

  
  FillLocationModal(location: Location) {
    this.baseService.locationService.GetLocationById(result => {
      this.location = result;
    }, location.LocationId);
  }

  onDoubleClickItem(item: any) {
    console.log(item);
  }
}
