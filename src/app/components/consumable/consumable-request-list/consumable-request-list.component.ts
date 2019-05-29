import { Component, OnInit, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';
import { ConsumableRequest } from '../../../models/ConsumableRequest';

@Component({
  selector: 'app-consumable-request-list',
  templateUrl: './consumable-request-list.component.html',
  styleUrls: ['./consumable-request-list.component.css']
})
export class ConsumableRequestListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
