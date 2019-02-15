import { Component, OnInit, NgModule } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  NgForm
} from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";

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
  constructor(
    private formBuilder: FormBuilder,
    public baseService: BaseService
  ) {
    super(baseService);
  }

  insertingLocation: any = {};
  locations: Location[] = [];

  ngOnInit() {}

  insertLocation(data: NgForm) {
    console.log(data.value);
    this.insertingLocation = <Location>data.value;
    this.baseService.locationService.InsertLocation(this.insertingLocation);
  }

  LoadDropdownList() {
    debugger;
    this.baseService.locationService.GetLocations(locations => {
      this.locations = locations;
    });
  }
}
