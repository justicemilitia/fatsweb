import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "src/app/services/base.service";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { FixedAssetStatus } from "src/app/models/FixedAssetStatus";
import { HttpErrorResponse } from "@angular/common/http";
import { ColorPickerService, Cmyk } from "ngx-color-picker";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-suspension",
  templateUrl: "./suspension.component.html",
  styleUrls: ["./suspension.component.css"]
})
export class SuspensionComponent extends BaseComponent implements OnInit {

  public dataTable: TreeGridTable = new TreeGridTable(
    "suspension",
    [
      {
        columnDisplayName: "Askıya Alma Sebebi",
        columnName: ["Name"],
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
  constructor(baseService: BaseService) {
    super(baseService);
  }

  ngOnInit() {}
}
