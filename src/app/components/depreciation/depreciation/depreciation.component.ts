import { Component, OnInit } from "@angular/core";
import { BaseService } from "../../../services/base.service";
import { BaseComponent } from "../../base/base.component";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import { Page } from "../../../extends/TreeGridTable/models/Page";
import { FixedAsset } from "../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-depreciation",
  templateUrl: "./depreciation.component.html",
  styleUrls: ["./depreciation.component.css"]
})
export class DepreciationComponent extends BaseComponent implements OnInit {
  searchDescription: string = "";
  fixedAssets: FixedAsset[] = [];
  fixedAsset: FixedAsset = new FixedAsset();

  path: string;
  currentPage: number = 1;
  perInPage: number = 25;
  totalPage: number = 1;
  pages: Page[] = [];

  public dataTable: TreeGridTable = new TreeGridTable(
    "depreciation",
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
        columnDisplayName: "Fiyat",
        columnName: ["Price"],
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
        type: "text",
        formatter: value => {
          return value.InvoiceDate
            ? value.InvoiceDate.substring(0, 10)
                .split("-")
                .reverse()
                .join("-")
            : "";
        }
      },
      {
        columnDisplayName: "Aktivasyon Tarihi",
        columnName: ["ActivationDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.ActivationDate
            ? value.ActivationDate.substring(0, 10)
                .split("-")
                .reverse()
                .join("-")
            : "";
        }
      },
      {
        columnDisplayName: "Masraf Yeri",
        columnName: ["ExpenseCenter", "ExpenseCenterName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Açıklaması",
        columnName: ["Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        //  NESNE DÖNÜLECEK
        columnDisplayName: "Amortisman Yöntemi",
        columnName: ["DepreciationCalculationType", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Amortisman hesaplanacak mı ?",
        columnName: ["WillDepreciationBeCalculated"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Amortisman Periyodu",
        columnName: ["DepreciationPeriod"],
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
        type: "checkbox"
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
        columnDisplayName: "Ifrs Periyodu",
        columnName: ["Ifrsperiod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Enflasyon hesaplanacak mı?",
        columnName: ["HasInflationIndexation"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      }
    ],
    {
      isDesc: false,
      column: ["Barcode"]
    }
  );

  constructor(protected baseService: BaseService) {
    super(baseService);
    this.loadFixedAsset();
  }

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

  ngOnInit() {}

  async loadFixedAsset(_perInPage: number = 25, _currentPage: number = 1) {
    this.searchDescription = "";
    this.dataTable.TGT_clearData();
    this.dataTable.isLoading = true;

    this.baseService.fixedAssetService.GetFixedAsset(
      _perInPage,
      _currentPage,
      false,
      (fa: FixedAsset[], totalPage: number, message: string) => {
        this.perInPage = _perInPage;
        this.currentPage = _currentPage;
        this.dataTable.perInPage = _perInPage;
        this.fixedAssets = fa;
        this.totalPage = totalPage ? totalPage : 1;

        fa.forEach(e => {
          e.FixedAssetPropertyDetails.forEach(p => {
            if (p.FixedAssetCardPropertyId) {
              e["PROP_" + p.FixedAssetCardPropertyId.toString()] = p.Value;
            }
          });
        });
        this.dataTable.TGT_loadData(this.fixedAssets);
        this.TGT_calculatePages();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadDropdownList() {

  }

  onSubmit(data: NgForm) {
    if (data.form.invalid == true) return;

    if (data.value.Price) {
      return;
    }
    /* if agreement id exists means update it otherwise insert it */
    // if (this.agreement.AgreementId == null) {
    //   this.addAgreements(data);
    // } else {
    //   this.updateAgreement(data);
  }
}
