import { Component, OnInit, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { NotDeletedItem } from "src/app/models/NotDeletedItem";
import { ConsumableRequest } from "../../../models/ConsumableRequest";
import { Page } from "src/app/extends/TreeGridTable/models/Page";
import { ConsumableCard } from "src/app/models/ConsumableCard";
import { ConsumableCategory } from "src/app/models/ConsumableCategory";
import { FixedAssetCardProperty } from "src/app/models/FixedAssetCardProperty";
import { Consumable } from "src/app/models/Consumable";
import { ConsumableUnit } from "src/app/models/ConsumableUnit";
import { FixedAssetPropertyDetails } from "src/app/models/FixedAssetPropertyDetails";
import { FixedAssetCardPropertyValue } from "src/app/models/FixedAssetCardPropertyValue";

@Component({
  selector: "app-consumable-request-list",
  templateUrl: "./consumable-request-list.component.html",
  styleUrls: ["./consumable-request-list.component.css"]
})
export class ConsumableRequestListComponent extends BaseComponent
  implements OnInit {
  consumable: ConsumableRequest = new ConsumableRequest();

  consumableRequest: ConsumableRequest = new ConsumableRequest();

  receiveConsumableMaterial: ConsumableRequest = new ConsumableRequest();

  requestList: ConsumableRequest[] = [];

  consumableCard: ConsumableCard = new ConsumableCard();

  consumableCards: ConsumableCard[] = [];

  consumableCategories: ConsumableCategory[] = [];

  fixedassetproperty: FixedAssetCardProperty[] = [];

  faPropertyDetails: FixedAssetPropertyDetails[] = [];

  fixedAssetPropertyDetail: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();

  fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();

  faProperties: FixedAssetCardProperty[] = [];

  insertedProperty:FixedAssetPropertyDetails[]= [];

  currentPage: number = 1;

  perInPage: number = 25;

  totalPage: number = 1;

  pages: Page[] = [];

  propertyValue: string;

  isListSelected: boolean = false;

  sameProperty: boolean = false;

  visiblePropertyName: boolean = false;

  isSelectedProperty: boolean = false;

  visible: boolean = false;

  isWaitingInsertOrUpdate: boolean = false;

  isTableRefreshing: boolean = false;

  isTableExporting: boolean = false;

  requestedUser : string;

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
        columnName: ["ConsumableCategory", "ConsumableCategoryName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Malzeme Adı",
        columnName: ["ConsumableCard", "ConsumableCardName"],
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

  public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
    "fixedassetpropertyvalue",
    [
      {
        columnDisplayName: "Özellik Adı",
        columnName: ["FixedAssetCardProperty", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Özellik Değeri",
        columnName: ["Value"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["FixedAssetCardProperty", "Name"]
    }
  );

  public dataTableRequestPropertyValue: TreeGridTable = new TreeGridTable(
    "fixedassetpropertyvalue",
    [
      {
        columnDisplayName: "Özellik Adı",
        columnName: ["FixedAssetCardProperty", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Özellik Değeri",
        columnName: ["Value"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["FixedAssetCardProperty", "Name"]
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadConsumableRequestList();
    this.loadFixedAssetProperties();
    this.loadDropdown();

    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isFilterActive = false;
    this.dataTablePropertyValue.isLoading = false;
    this.dataTablePropertyValue.isScrollActive = false;
    this.dataTablePropertyValue.isDeleteable = true;

    this.dataTableRequestPropertyValue.isPagingActive = false;
    this.dataTableRequestPropertyValue.isColumnOffsetActive = false;
    this.dataTableRequestPropertyValue.isTableEditable = true;
    this.dataTableRequestPropertyValue.isMultipleSelectedActive = false;
    this.dataTableRequestPropertyValue.isFilterActive = false;
    this.dataTableRequestPropertyValue.isLoading = false;
    this.dataTableRequestPropertyValue.isScrollActive = false;
    this.dataTableRequestPropertyValue.isDeleteable = true;

    this.dataTable.isPagingActive = false;
  }

  ngOnInit() {}
  async TGT_calculatePages() {
    let items: Page[] = [];
    let totalPage = this.totalPage;

    /* if user in a diffrent page we will render throw the first page */
    if (this.currentPage > totalPage) this.currentPage = 1;
    else if (this.currentPage < 1) this.currentPage = 1;

    /* We will always put first page in to pagination items */
    items.push({
      value: 1,
      display: "1",
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
        display: "...",
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
        display: "...",
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

  async loadDropdown() {
    this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
      (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
        this.fixedassetproperty = fixedAssetCardProperties;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.consumableCategoryService.GetConsumableCategories(
      (categories: ConsumableCategory[]) => {
        this.consumableCategories = categories;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadConsumableCardByCategoryId(event: any) {
    this.consumableCards = [];
    this.consumableCard.ConsumableUnit = null;

    if (!event.target.value || event.target.value == "") {
      this.consumable.ConsumableCardId = null;
      //  this.consumable.ConsumableCard = new ConsumableCard();
      return;
    }
    if (event.target.value) {
      this.baseService.consumableCardService.GetConsumableCardsByCategoryId(
        <number>event.target.value,
        (consumableCards: ConsumableCard[]) => {
          this.consumableCards = consumableCards;
        },
        (error: HttpErrorResponse) => {}
      );
    }
  }

  async loadConsumableUnitByCardId(event: any) {
    this.consumableCard = new ConsumableCard();

    // if (!event.target.value || event.target.value == "") {
    //   this.consumable.ConsumableUnits.ConsumableUnitId = null;
    //   this.consumable.ConsumableUnits = new ConsumableUnit();
    //   return;
    // }

    this.baseService.consumableService.GetConsumableCardUnitByCardId(
      <number>event.target.value,
      (consumablecard: ConsumableCard) => {
        this.consumableCard = consumablecard;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadConsumableRequestList(
    _perInPage: number = 25,
    _currentPage: number = 1
  ) {
    this.baseService.consumableRequestListService.GetConsumableRequestList(
      _perInPage,
      _currentPage,
      (
        requestList: ConsumableRequest[],
        totalPage: number,
        message: string
      ) => {
        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.dataTable.perInPage = _perInPage;
        this.requestList = requestList;
        this.totalPage = totalPage ? totalPage : 1;
        let faProperties: FixedAssetCardProperty[] = [];
        this.requestList.forEach(e => {
          e.Consumable.FixedAssetPropertyDetails.forEach(p => {
            if (p.FixedAssetCardPropertyId) {
              e["PROP_" + p.FixedAssetCardPropertyId.toString()] = p.Value;
            }
          });
        });
        this.dataTable.TGT_loadData(this.requestList);
        this.TGT_calculatePages();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadFixedAssetProperties() {
    this.baseService.fixedAssetService.GetFixedAssetProperties(
      (faProperties: FixedAssetCardProperty[]) => {
        this.faProperties = faProperties;
        this.faProperties.forEach(e => {
          this.dataTable.dataColumns.push({
            columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
            columnDisplayName: e.Name,
            isActive: true,
            type: "text"
          });
        });
        this.dataTable.TGT_bindActiveColumns();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  insertPropertyValueToArray(propertyId: any) {
    this.faPropertyDetails = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

    if (this.isListSelected == false)
      this.propertyValue = this.fixedAssetPropertyDetail.Value;

    this.faPropertyDetails.forEach(e => {
      if (
        e.FixedAssetCardPropertyId ==
          this.fixedAssetPropertyDetail.FixedAssetCardPropertyId &&
        e.Value == this.propertyValue
      )
        this.sameProperty = true;
    });

    if (this.sameProperty == true) {
      this.sameProperty = false;
      return;
    }

    if (this.fixedAssetPropertyDetail.FixedAssetCardPropertyId != null) {
      this.visiblePropertyName = false;

      if (
        this.fixedAssetPropertyDetail.Value != null ||
        this.fixedAssetCardPropertyValue.FixedAssetPropertyValueId != null
      ) {
        let fixedasset = this.fixedassetproperty.find(
          x => x.FixedAssetCardPropertyId == Number(propertyId.value)
        );

        this.fixedAssetPropertyDetail.FixedAssetPropertyDetailId =
          (this.faPropertyDetails.length + 1) * -1;

        this.fixedAssetPropertyDetail.FixedAssetCardProperty = fixedasset;

        if (this.isListSelected == true)
          this.fixedAssetPropertyDetail.Value = this.propertyValue;
        this.faPropertyDetails.push(this.fixedAssetPropertyDetail);

        this.dataTablePropertyValue.TGT_loadData(this.faPropertyDetails);

        this.fixedAssetPropertyDetail = new FixedAssetPropertyDetails();
        this.fixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
        propertyId = null;
        this.visible = false;
        this.isSelectedProperty = false;
      } else {
        this.visiblePropertyName = true;
      }
    } else {
      this.visible = true;
      this.visiblePropertyName = true;
    }
  }

  requestConsumableMaterial(data: NgForm) {
    if (data.form.invalid == true) return;

    let insertedItem: ConsumableRequest = new ConsumableRequest();

    let propertyDetail = <FixedAssetPropertyDetails[]>(
      this.dataTablePropertyValue.TGT_copySource()
    );

    Object.assign(insertedItem, this.consumable);
    insertedItem.ConsumableCategoryId = <number>(
      this.consumable.ConsumableCategoryId
    );
    insertedItem.FixedAssetPropertyDetails = propertyDetail;

    console.log(insertedItem);

    this.baseService.consumableRequestListService.RequestConsumableMaterial(
      insertedItem,
      (requestItem: ConsumableRequest) => {
        this.isWaitingInsertOrUpdate = false;

        insertedItem.ConsumableId = requestItem.ConsumableId;
      },
      (error: HttpErrorResponse) => {}
    );
  }

  selectedRequestConsumableMaterial() {
    let selectedItems = <ConsumableRequest[]>(
      this.dataTable.TGT_getSelectedItems()
    );

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir talep seçiniz!"
      );
      return;
    }

    if (selectedItems.length > 1) {
      this.baseService.popupService.ShowAlertPopup(
        "Birden fazla talep seçtiniz!"
      );

      return;
    }

    let selectedId: number = selectedItems[0].ConsumableLogId;

    this.cancelRequestConsumableMaterial(selectedId);
  }

  cancelRequestConsumableMaterial(selectedLogId: number) {

    $("#btnCancelRequest").trigger("click");

    this.baseService.consumableRequestListService.GetRequestConsumableMaterial(
      selectedLogId,
      (consumableRequest:ConsumableRequest) => {
        Object.assign(this.consumableRequest, consumableRequest[0]);
        console.log(this.consumableRequest);
        this.requestedUser = this.consumableRequest.User.FirstName + " " +this.consumableRequest.User.LastName; 

        let property:FixedAssetPropertyDetails[] =  this.consumableRequest.Consumable.FixedAssetPropertyDetails;

        property.forEach(e => { 
        let propertydetails: FixedAssetPropertyDetails = new FixedAssetPropertyDetails();

        propertydetails.FixedAssetPropertyDetailId = e.FixedAssetPropertyDetailId;
        propertydetails.FixedAssetCardProperty = e.FixedAssetCardProperty;
        propertydetails.Value = e.Value;

        this.insertedProperty.push(propertydetails);
        });

        this.dataTableRequestPropertyValue.TGT_loadData(this.insertedProperty);

      },
      (error: HttpErrorResponse) => {}
    );
  }
}
