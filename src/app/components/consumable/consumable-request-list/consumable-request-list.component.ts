import { Component, OnInit, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { NotDeletedItem } from "src/app/models/NotDeletedItem";
import { ConsumableRequest } from "../../../models/ConsumableRequest";
import { Page } from 'src/app/extends/TreeGridTable/models/Page';

@Component({
  selector: "app-consumable-request-list",
  templateUrl: "./consumable-request-list.component.html",
  styleUrls: ["./consumable-request-list.component.css"]
})
export class ConsumableRequestListComponent extends BaseComponent
  implements OnInit {

  consumable: ConsumableRequest = new ConsumableRequest();

  requestList:ConsumableRequest[]=[];

  currentPage: number = 1;

  perInPage: number = 25;

  totalPage: number = 1;

  pages: Page[] = [];

  /* Data Table */
  public dataTable: TreeGridTable = new TreeGridTable(
    "consumablematerial",
    [
      {
        columnDisplayName: "Talep Numarası",
        columnName: ["Number"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Kodu",
        columnName: ["ConsumableCard", "ConsumableCardCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Kategorisi",
        columnName: ["ConsumableCategory","ConsumableCategoryName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Adı",
        columnName: ["ConsumableCard","ConsumableCardName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Talep Açıklaması",
        columnName: ["Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Talep Edilen Miktar",
        columnName: ["RequestedAmount"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Karşılanan Miktar - Birim",
        columnName: ["RecievedAmount"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Talep Karşılama Açıklaması",
        columnName: ["ConsumableLogTypeDescription"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["ConsumableCard", "ConsumableCardName"]
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadConsumableRequestList();

    this.dataTable.isPagingActive = false;
  }

  ngOnInit() {}
  async  TGT_calculatePages() {

    let items: Page[] = [];
    let totalPage = this.totalPage;

    /* if user in a diffrent page we will render throw the first page */
    if (this.currentPage > totalPage)
      this.currentPage = 1;
    else if (this.currentPage < 1)
      this.currentPage = 1

    /* We will always put first page in to pagination items */
    items.push({
      value: 1,
      display: '1',
      isDisabled: false,
      isActive: this.currentPage == 1 ? true : false
    });

    /* if the total page is 1 return the items no more need calculation */
    if (totalPage <= 1) {
      this.pages = items;
      return;
    }

    /* we will store the last inserted item */
    let lastInsertedItem = this.currentPage - 3;

    /* if current user far enough page we will show ... (you passed many page) */
    if (lastInsertedItem > 2) {
      items.push({
        value: 0,
        display: '...',
        isDisabled: true,
        isActive: false
      });
    }

    /* We loop all pages to add pagination items */
    for (let ii = this.currentPage - 3; ii < totalPage; ii++) {
      lastInsertedItem = ii;

      /* first pages ii may be minus so we should check ii is bigger 1 */
      if (ii > 1) {
        /* Insert pagination item */
        items.push({
          value: ii,
          display: ii.toString(),
          isDisabled: false,
          isActive: this.currentPage == ii ? true : false
        });
      }

      /* maximum item we will show is 7 */
      if (items.length > 7) {
        ii = totalPage;
        break;
      }
    }

    /* After calculation if we still far from totalpage we insert ... page item */
    if (lastInsertedItem < totalPage - 1 && lastInsertedItem > 0) {
      items.push({
        value: 0,
        display: '...',
        isDisabled: true,
        isActive: false
      });
    }

    /* We always push the last page to the pagination items */
    if (!items.find(x => x.value == totalPage)) {
      items.push({
        value: totalPage,
        display: totalPage.toString(),
        isDisabled: false,
        isActive: this.currentPage == totalPage ? true : false
      });
    }

    /* We set pages to new pagination items. */
    this.pages = items;

  }

  loadConsumableRequestList(_perInPage: number = 25, _currentPage: number = 1) {
    this.baseService.consumableRequestListService.GetConsumableRequestList(
      _perInPage,
      _currentPage,
      (requestList:ConsumableRequest[], totalPage:number,message:string) => {
        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.dataTable.perInPage = _perInPage;
        this.requestList = requestList;
        this.totalPage = totalPage ? totalPage : 1;

        this.dataTable.TGT_loadData(this.requestList);
        this.TGT_calculatePages();
      },
      (error:HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  requestConsumableMaterial(){

  }
}
