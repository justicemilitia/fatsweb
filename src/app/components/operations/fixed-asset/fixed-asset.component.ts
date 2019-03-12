import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "src/app/services/base.service";

@Component({
  selector: "app-fixed-asset",
  templateUrl: "./fixed-asset.component.html",
  styleUrls: ["./fixed-asset.component.css"]
})
export class FixedAssetComponent extends BaseComponent implements OnInit {
  constructor(baseService: BaseService) {
    super(baseService);
  }

  ngOnInit() {}
}
