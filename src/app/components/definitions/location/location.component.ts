import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { TreeGridTable } from "src/app/extends/TreeGridTable";
import { IData } from "src/app/models/interfaces/IData";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import{ Location } from "../../../models/Location";

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
export class LocationComponent extends TreeGridTable
implements OnInit, DoCheck {
  insertingLocation: any = {};
  locations: Location[] = [];

  filter: any = {
    Name: "",
    Barcode: "",
    Coordinate: "",
    ParentLocation: {
      Name:""
    },
    Description: ""
  };

  order: any = {
    isDesc: false,
    column: "Name"
  };

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadLocations();
  }

  ngOnInit() {}

  ngDoCheck(): void {
    this.doFilter();
  }

 //#region Grid Methods

 doFilter() {
  this.TGT_doFilter(this.locations, this.filter);
}

doOrder(column: string) {
  this.order.isDesc = !this.order.isDesc;
  this.order.column = column;
  this.TGT_doOrder(this.locations, this.filter, this.order);
}

doCollapse(data: IData) {
  data.isExtended = !data.isExtended;
  this.TGT_loadData(this.locations);
}

//#endregion

  insertLocation(data: NgForm) {
    this.insertingLocation = <Location>data.value;
    this.baseService.locationService.InsertLocation(
      this.insertingLocation
    );
  }

  loadLocations() {
    this.baseService.locationService.GetLocations(
      (locs: Location[]) => {
        this.locations = <Location[]>this.convertDataToTree(locs);
        this.TGT_loadData(this.locations);
      },
      (error: HttpErrorResponse) => {
        this.errorManager(error);
      }
    );
  }
}
