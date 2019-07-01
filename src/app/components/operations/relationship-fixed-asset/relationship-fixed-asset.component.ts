import {
  Component,
  OnInit,
  NgModule,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetRelationship } from "../../../models/FixedAssetRelationship";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { FixedAsset } from "../../../models/FixedAsset";

@Component({
  selector: "app-relationship-fixed-asset",
  templateUrl: "./relationship-fixed-asset.component.html",
  styleUrls: ["./relationship-fixed-asset.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [RelationshipFixedAssetComponent],
  providers: [RelationshipFixedAssetComponent]
})
export class RelationshipFixedAssetComponent extends BaseComponent
  implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["Ids"]) {
      this.loadRelationalFixedAsset();
    }
  }

  /* Fixed Asset list */
  fixedAsset: FixedAssetRelationship = new FixedAssetRelationship();
  fixedAssets: FixedAssetRelationship[] = [];
  Ids: number[] = [];
  parentIds: number[] = [];

  isParentNull: boolean = false;

  isTableRefreshing: boolean = false;

  isTableExporting: boolean = false;

  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedassetrelationship",
    [
      {
        columnDisplayName: "Barkod",
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Adı",
        columnName: ["FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Kategorisi",
        columnName: ["FixedAssetCard", "FixedAssetCardCategory", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Seri No",
        columnName: ["SerialNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Marka",
        columnName: ["FixedAssetCardModel", "FixedAssetCardBrand", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Model",
        columnName: ["FixedAssetCardModel", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü",
        columnName: ["Status", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü Kodu",
        columnName: ["Status", "FixedAssetStatusCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Fiyat",
        columnName: ["Price"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Personel",
        columnName: ["FixedAssetUsers", "User", "FirstName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },

      // {
      //   columnDisplayName: "Şirket",
      //   columnName: ["Company","Name"],
      //   isActive: true,
      //   classes: [],
      //   placeholder: "",
      //   type: "text"
      // },
      {
        columnDisplayName: "Lokasyon Adı",
        columnName: ["Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Kodu",
        columnName: ["Location", "LocationCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Barkodu",
        columnName: ["Location", "Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Koordinatı",
        columnName: ["Location", "Coordinate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Adresi",
        columnName: ["Location", "Address"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Açıklaması",
        columnName: ["Location", "Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Makbuz Tarihi",
        columnName: ["ReceiptDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Fatura No",
        columnName: ["InvoiceNo"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Fatura Tarihi",
        columnName: ["InvoiceDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      // {
      //   columnDisplayName: "Amortisman hesaplanacak mı ?",
      //   columnName: ["WillDepreciationBeCalculated"],
      //   isActive: true,
      //   classes: [],
      //   placeholder: "",
      //   type: "text"
      // },
      // {    NESNE DÖNÜLECEK
      //   columnDisplayName: "Amortisman Yöntemi",
      //   columnName: ["DepreciationCalculationType","Name"],
      //   isActive: true,
      //   classes: [],
      //   placeholder: "",
      //   type: "text"
      // },
      {
        columnDisplayName: "Amortisman Periyodu",
        columnName: ["DepreciationPeriod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Ifrs Fiyatı",
        columnName: ["Ifrsprice"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Ifrs hesaplanacak mı ?",
        columnName: ["WillIfrsbeCalculated"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Ifrs Periyodu",
        columnName: ["Ifrsperiod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      // {
      //   columnDisplayName: "Enflasyon İndekslemesi",
      //   columnName: ["HasInflationIndexation"],
      //   isActive: true,
      //   classes: [],
      //   placeholder: "",
      //   type: "text"
      // },
      {
        columnDisplayName: "Garanti Başlangıç Tarihi",
        columnName: ["GuaranteeStartDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Garanti Bitiş Tarihi",
        columnName: ["GuaranteeEndDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Aktivasyon Tarihi",
        columnName: ["ActivationDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Departman Kodu",
        columnName: ["Department", "DepartmentCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Departman Adı",
        columnName: ["Department", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Departman Açıklama",
        columnName: ["Department", "Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Masraf Yeri",
        columnName: ["ExpenseCenter", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );

  public dataTableRelationship: TreeGridTable = new TreeGridTable(
    "breakfixedassetrelationship",
    [
      {
        columnDisplayName: "Demirbaş Barkodu",
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Adı",
        columnName: ["FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetRelationship();

    this.dataTableRelationship.isPagingActive = false;
    this.dataTableRelationship.isColumnOffsetActive = false;
    this.dataTableRelationship.isDeleteable = false;
    this.dataTableRelationship.isTableEditable = true;
    this.dataTableRelationship.isMultipleSelectedActive = false;
    this.dataTableRelationship.isLoading = false;
    this.dataTableRelationship.isFilterActive = false;
    this.dataTableRelationship.isConfigOpen = false;
  }

  ngOnInit() { }

  async loadFixedAssetRelationship() {
    /* Load all fixed asset cards to datatable */
    await this.baseService.fixedAssetService.GetFixedAssetRelationship(
      (far: FixedAssetRelationship[]) => {
        Object.assign(this.fixedAssets, far);
        // far.forEach((element: FixedAssetRelationship) => {
        //   let e = element.InverseFixedAssetParent;
        //   if (e && e.length != 0) {
        //     e.forEach((p, i) => {
        //       let f = new FixedAssetRelationship();
        //       Object.assign(f, p);
        //       this.fixedAssets.push(f);
        //     })
        //   }
        // });
        this.dataTable.TGT_loadData(this.fixedAssets);
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */

        /* Show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async breakRelationship(data: NgForm) {
    this.Ids = [];

    /* Is Form Valid */
    if (data.form.invalid == true) return;

    let selectedItems = <FixedAssetRelationship[]>(
      this.dataTable.TGT_getSelectedItems()
    );

    this.fixedAsset.FixedAssetIds = selectedItems.map(x => x.getId());

    await this.baseService.fixedAssetService.BreakFixedAssetRelationship(
      this.fixedAsset,
      (insertedItem: FixedAsset, message) => {
        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Set inserted Item id to model */
        this.fixedAsset.FixedAssetId = insertedItem.FixedAssetId;

        /* Push inserted item to Property list */
        this.fixedAssets.push(this.fixedAsset);
        this.refreshTable();
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadRelationalFixedAsset() {
    this.parentIds = [];
    let selectedItems = <FixedAssetRelationship[]>(
      this.dataTable.TGT_getSelectedItems()
    );

    selectedItems.forEach(e => {
      if (e.FixedAssetParentId != null) {
        this.parentIds.push(e.FixedAssetParentId);
      }
    });

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir demirbaş seçiniz"
      );
      return;
    } else if (this.parentIds.length == 0) {
      // this.baseService.popupService.ShowAlertPopup(
      //   "Seçilen demirbaşların ilişkisi bulunmadığı için işlem gerçekleştirilemedi!"
      // );
      // this.baseService.popupService.ShowQuestionPopupForRelationalFixedAsset();
      $("#btnShowRelationshipModal").trigger("click");
      return;
    }

    else {
      let listedItem: FixedAssetRelationship[] = [];

      selectedItems.forEach(e => {
        let item = new FixedAssetRelationship();
        e.FixedAssetParentId = null;
        Object.assign(item, e);
        listedItem.push(item);
      });

      this.dataTableRelationship.TGT_loadData(listedItem);
      if (listedItem.length == 0) {
        this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
      }
      $("#btnOpenRelationship").trigger("click");
    }
  }

  selectedRelationFa() {
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    let itemIds: number[] = selectedItems.map(x => x.getId());
    this.Ids = itemIds;
    return this.Ids;
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadFixedAssetRelationship();

    this.isTableRefreshing = false;
  }
}
