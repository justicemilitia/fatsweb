import { Component, OnInit } from '@angular/core';
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';
import { BaseService } from '../../../services/base.service';
import { BaseComponent } from '../../base/base.component';
import { FixedAssetFilter } from '../../../models/FixedAssetFilter';
import { NgForm } from '@angular/forms';
import { convertNgbDateToDateString, getToday, convertDateToNgbDate } from '../../../declarations/extends';
import { FixedAsset } from '../../../models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';
import { Page } from '../../../extends/TreeGridTable/models/Page';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FixedAssetCardProperty } from '../../../models/FixedAssetCardProperty';
import { MatTabChangeEvent } from '@angular/material';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-depreciation-detail-list',
  templateUrl: './depreciation-detail-list.component.html',
  styleUrls: ['./depreciation-detail-list.component.css']
})
export class DepreciationDetailListComponent extends BaseComponent implements OnInit {

  fixedAssetFilters: FixedAssetFilter[] = [];
  fixedAssetFilter: FixedAssetFilter = new FixedAssetFilter();

  fixedAssets: FixedAsset[] = [];
  fixedAsset: FixedAsset = new FixedAsset();
  isValid: boolean = true;
  isDepreciationList: boolean = true;
  isDepreciationIFRSList: boolean = false;
  isDetailInfo:boolean = true;
  isDetailInfoIFRS: boolean = false;
  
  /* Is Table Exporting */
  isTableExporting:boolean = false;
  
  currentPage: number = 1;
  perInPage: number = 25;
  totalPage: number = 1;
  pages: Page[] = [];
  faProperties: FixedAssetCardProperty[] = [];  
  
  totalAccumulatedValue: number;
  totalNddValue: number;
  totalDepreciationMonthlyValue: number;
  totalRevaluatedValue: number;

  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedasset",
    [
      {
        columnDisplayName: "Barkod",
        columnName: ["FixedAsset", "Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Adı",
        columnName: ["FixedAsset", "FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Kategorisi",
        columnName: ["FixedAsset", "FixedAssetCard", "FixedAssetCardCategory", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      { 
        columnDisplayName: "Amortisman Yöntemi",
        columnName: ["FixedAsset", "DepreciationCalculationType","Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Aktif Demirbaş Değeri",
        columnName: ["FixedAsset", "Price"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Aktif Demirbaş Değeri",
        columnName: ["FixedAsset", "Currency", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Amortisman Oranı",
        columnName: ["Rate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }, 
      {
        columnDisplayName: "Amortisman Periyodu",
        columnName: ["FixedAsset","DepreciationPeriod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Amortisman Değeri",
        columnName: ["Value"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }, 
      {
        columnDisplayName: "Birikmiş Amortisman Değeri",
        columnName: ["AccumulatedValue"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },  
      {
        columnDisplayName: "Net Defter Değeri",
        columnName: ["Nddvalue"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },  
      {
        columnDisplayName: "Seri No",
        columnName: ["FixedAsset", "SerialNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Marka",
        columnName: ["FixedAsset", "FixedAssetCardModel", "FixedAssetCardBrand", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Model",
        columnName: ["FixedAsset", "FixedAssetCardModel", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü",
        columnName: ["FixedAsset", "Status", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü Kodu",
        columnName: ["FixedAsset", "Status", "FixedAssetStatuCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Personel",
        columnName: ["FixedAsset", "|FixedAssetUsers"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.FixedAssetUsers.length > 0 ? value.FixedAssetUsers[0].User.FirstName + ' ' + value.FixedAssetUsers[0].User.LastName : '';
          }
          else {
            return '';
          }
        }

      },
      {
        columnDisplayName: "Lokasyon Adı",
        columnName: ["FixedAsset", "Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Tedarikçi Şirket",
        columnName: ["FixedAsset", "Company", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Sözleşmeli Şirket",
        columnName: ["FixedAsset", "InsuranceCompany", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Kodu",
        columnName: ["FixedAsset", "Location", "LocationCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Barkodu",
        columnName: ["FixedAsset", "Location", "Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Koordinatı",
        columnName: ["FixedAsset", "Location", "Coordinate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Adresi",
        columnName: ["FixedAsset", "Location", "Address"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Açıklaması",
        columnName: ["FixedAsset", "Location", "Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü Rengi",
        columnName: ["FixedAsset", "Status","Color"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "color",   
      },
      {
        columnDisplayName: "Makbuz Tarihi",
        columnName: ["FixedAsset", "ReceiptDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.ReceiptDate ? value.ReceiptDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Fatura No",
        columnName: ["FixedAsset", "InvoiceNo"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Fatura Tarihi",
        columnName: ["FixedAsset", "InvoiceDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.InvoiceDate ? value.InvoiceDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Amortisman hesaplanacak mı ?",
        columnName: ["FixedAsset", "WillDepreciationBeCalculated"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Amortisman Periyodu",
        columnName: ["FixedAsset", "DepreciationPeriod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Ifrs Fiyatı",
        columnName: ["FixedAsset", "Ifrsprice"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Ifrs hesaplanacak mı ?",
        columnName: ["FixedAsset", "WillIfrsbeCalculated"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Ifrs Periyodu",
        columnName: ["FixedAsset", "Ifrsperiod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Enflasyon İndekslemesi",
        columnName: ["FixedAsset", "HasInflationIndexation"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Garanti Başlangıç Tarihi",
        columnName: ["FixedAsset", "GuaranteeStartDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.GuaranteeStartDate ? value.GuaranteeStartDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Garanti Bitiş Tarihi",
        columnName: ["FixedAsset", "GuaranteeEndDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.GuaranteeEndDate ? value.GuaranteeEndDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Demirbaş Giriş Tarihi",
        columnName: ["FixedAsset", "CreationDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.CreationDate ? value.CreationDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Activation_Date'),
        columnName: ["FixedAsset", "ActivationDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.ActivationDate ? value.ActivationDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Departman Kodu",
        columnName: ["FixedAsset", "Department", "DepartmentCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Departman Adı",
        columnName: ["FixedAsset", "Department", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Departman Açıklama",
        columnName: ["FixedAsset", "Department", "Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Açıklaması",
        columnName: ["FixedAsset", "Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Dosya Adı",
        columnName: ["FixedAsset", "FixedAssetFiles","FileName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.FixedAssetFiles.length > 0 ? value.FixedAssetFiles[0].FileName : '';
          }
          else {
            return '';
          }
        }
      },
      {
        columnDisplayName: "Aktif mi?",
        columnName: ["FixedAsset", "IsActive"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      }
    ],
    {
      isDesc: false,
      column: ["FixedAsset", "Barcode"]
    }
  );

  public dataTableIFRS: TreeGridTable = new TreeGridTable(
    "fixedasset",
    [
      {
        columnDisplayName: "Barkod",
        columnName: ["FixedAsset", "Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Adı",
        columnName: ["FixedAsset", "FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Kategorisi",
        columnName: ["FixedAsset", "FixedAssetCard", "FixedAssetCardCategory", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      // { 
      //   columnDisplayName: "IFRS Yöntemi",
      //   columnName: ["DepreciationCalculationType","Name"],
      //   isActive: true,
      //   classes: [],
      //   placeholder: "",
      //   type: "text"
      // },
      {
        columnDisplayName: "IFRS Demirbaş Değeri",
        columnName: ["FixedAsset", "Price"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "IFRS Amortisman Oranı",
        columnName: ["Rate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }, 
      {
        columnDisplayName: "IFRS Amortisman Periyodu",
        columnName: ["FixedAsset","DepreciationPeriod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "IFRS Amortisman Değeri",
        columnName: ["Value"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Net Defter Değeri",
        columnName: ["Nddvalue"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },  
      {
        columnDisplayName: "Seri No",
        columnName: ["FixedAsset", "SerialNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Marka",
        columnName: ["FixedAsset", "FixedAssetCardModel", "FixedAssetCardBrand", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Model",
        columnName: ["FixedAsset", "FixedAssetCardModel", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü",
        columnName: ["FixedAsset", "Status", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü Kodu",
        columnName: ["FixedAsset", "Status", "FixedAssetStatuCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Personel",
        columnName: ["FixedAsset", "|FixedAssetUsers"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.FixedAssetUsers.length > 0 ? value.FixedAssetUsers[0].User.FirstName + ' ' + value.FixedAssetUsers[0].User.LastName : '';
          }
          else {
            return '';
          }
        }

      },
      {
        columnDisplayName: "Lokasyon Adı",
        columnName: ["FixedAsset", "Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Tedarikçi Şirket",
        columnName: ["FixedAsset", "Company", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Sözleşmeli Şirket",
        columnName: ["FixedAsset", "InsuranceCompany", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Kodu",
        columnName: ["FixedAsset", "Location", "LocationCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Barkodu",
        columnName: ["FixedAsset", "Location", "Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Koordinatı",
        columnName: ["FixedAsset", "Location", "Coordinate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Adresi",
        columnName: ["FixedAsset", "Location", "Address"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Lokasyon Açıklaması",
        columnName: ["FixedAsset", "Location", "Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Statü Rengi",
        columnName: ["FixedAsset", "Status","Color"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "color",   
      },
      {
        columnDisplayName: "Makbuz Tarihi",
        columnName: ["FixedAsset", "ReceiptDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.ReceiptDate ? value.ReceiptDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Fatura No",
        columnName: ["FixedAsset", "InvoiceNo"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Fatura Tarihi",
        columnName: ["FixedAsset", "InvoiceDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.InvoiceDate ? value.InvoiceDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Amortisman hesaplanacak mı ?",
        columnName: ["FixedAsset", "WillDepreciationBeCalculated"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Amortisman Periyodu",
        columnName: ["FixedAsset", "DepreciationPeriod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Ifrs Fiyatı",
        columnName: ["FixedAsset", "Ifrsprice"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Ifrs hesaplanacak mı ?",
        columnName: ["FixedAsset", "WillIfrsbeCalculated"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Ifrs Periyodu",
        columnName: ["FixedAsset", "Ifrsperiod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Enflasyon İndekslemesi",
        columnName: ["FixedAsset", "HasInflationIndexation"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Garanti Başlangıç Tarihi",
        columnName: ["FixedAsset", "GuaranteeStartDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.GuaranteeStartDate ? value.GuaranteeStartDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Garanti Bitiş Tarihi",
        columnName: ["FixedAsset", "GuaranteeEndDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.GuaranteeEndDate ? value.GuaranteeEndDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Demirbaş Giriş Tarihi",
        columnName: ["FixedAsset", "CreationDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.CreationDate ? value.CreationDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Activation_Date'),
        columnName: ["FixedAsset", "ActivationDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.ActivationDate ? value.ActivationDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Departman Kodu",
        columnName: ["FixedAsset", "Department", "DepartmentCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Departman Adı",
        columnName: ["FixedAsset", "Department", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Departman Açıklama",
        columnName: ["FixedAsset", "Department", "Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Demirbaş Açıklaması",
        columnName: ["FixedAsset", "Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Dosya Adı",
        columnName: ["FixedAssetFiles","FileName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value.FixedAssetFiles.length > 0 ? value.FixedAssetFiles[0].FileName : '';
          }
          else {
            return '';
          }
        }
      },
      {
        columnDisplayName: "Aktif mi?",
        columnName: ["FixedAsset", "IsActive"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      }
    ],
    {
      isDesc: false,
      column: ["FixedAsset", "Barcode"]
    }
  );

  constructor(protected baseService: BaseService) { 

    super(baseService);
    this.loadDepreciationList();
    this.loadFixedAssetProperties();

    this.totalDepreciationValues(this.today(), true);
  }

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

  ngOnInit() {
  }

  onSubmitDepreciationFilter(dataDepreciationFilter: NgForm) {
    if (dataDepreciationFilter.form.invalid == true) return;
    this.filterDepreciation(dataDepreciationFilter);
  }

  onSubmitDepreciationIFRSFilter(dataDepreciationIFRSFilter: NgForm) {
    if (dataDepreciationIFRSFilter.form.invalid == true) return;
    this.filterDepreciationIFRS(dataDepreciationIFRSFilter);
  }

  loadDepreciationList(){

      let cloneItem = new FixedAssetFilter();

      cloneItem.IsFilter = true;
      cloneItem.PerPage = 1000;
      cloneItem.Page=1;      
      cloneItem.Date =  this.today() == null ? null : convertNgbDateToDateString(this.today());
      cloneItem.IsValid=true;
      cloneItem.WillDepreciationBeCalculated = true;

    this.baseService.depreciationService.GetDepreciationFixedAssetDetail(
        cloneItem,
        (fixedAssets: any[],totalPage) => {

          this.fixedAssets = fixedAssets;

                fixedAssets.forEach(e => {
                    e.FixedAsset.FixedAssetPropertyDetails.forEach(p => {
                      if (p.FixedAssetCardPropertyId) {
                        e["PROP_" + p.FixedAssetCardPropertyId.toString()] = p.Value;
                      }
                  });
                });

        

          this.dataTable.TGT_loadData(this.fixedAssets);
          this.currentPage = 1;
          this.perInPage = 1000;
          this.totalPage = totalPage;
          this.TGT_calculatePages();
        },
        (error: HttpErrorResponse) => {
          /* Show alert message */
          console.log(error);
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }

  

  loadDepreciationIFRSList(){

    let cloneItem = new FixedAssetFilter();

    cloneItem.IsFilter = true;  
    cloneItem.PerPage = 1000;
    cloneItem.Page=1;      
    cloneItem.Date =  this.today() == null ? null : convertNgbDateToDateString(this.today());
    cloneItem.IsValid=true;
    cloneItem.WillIfrsbeCalculated = true;    

   this.baseService.depreciationService.GetIFRSFixedAssetDetail(
      cloneItem,
      (fixedAssets: any[],totalPage) => {

        this.fixedAssets = fixedAssets;

              fixedAssets.forEach(e => {
                  e.FixedAsset.FixedAssetPropertyDetails.forEach(p => {
                    if (p.FixedAssetCardPropertyId) {
                      e["PROP_" + p.FixedAssetCardPropertyId.toString()] = p.Value;
                    }
                });
              });

       

        this.dataTableIFRS.TGT_loadData(this.fixedAssets);
        this.currentPage = 1;
        this.perInPage = 1000;
        this.totalPage = totalPage;
        this.TGT_calculatePages();
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        console.log(error);
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

  async loadFixedAssetPropertiesIFRS() {
    this.baseService.fixedAssetService.GetFixedAssetProperties(
      (faProperties: FixedAssetCardProperty[]) => {
        this.faProperties = faProperties;
        this.faProperties.forEach(e => {
          this.dataTableIFRS.dataColumns.push({
            columnName: ["PROP_" + e.FixedAssetCardPropertyId.toString()],
            columnDisplayName: e.Name,
            isActive: true,
            type: "text"
          });
        });
        this.dataTableIFRS.TGT_bindActiveColumns();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async filterDepreciation(data: NgForm){
    /* Is Form Valid */
    // if (data.form.invalid == true) return;

    this.fixedAssetFilter.IsFilter = true;
    this.fixedAssetFilter.Page = 1;
    this.fixedAssetFilter.PerPage = 1000;

    let cloneItem = new FixedAssetFilter();
    Object.assign(cloneItem, this.fixedAssetFilter);

    cloneItem.Date = data.value.depreciationDate == null ? null : convertNgbDateToDateString(data.value.depreciationDate);
    cloneItem.WillDepreciationBeCalculated = data.value.WillDepreciationBeCalculated;
    cloneItem.WillIfrsbeCalculated = data.value.WillIfrsbeCalculated;
    cloneItem.IsValid=this.isValid;

    await this.baseService.depreciationService.GetDepreciationFilterList(
      cloneItem,
      (fixedAssets: FixedAsset[],totalPage) => {

        this.fixedAssets = fixedAssets;
        this.dataTable.TGT_loadData(this.fixedAssets);
        this.currentPage = 1;
        this.perInPage = 1000;
        this.totalPage = totalPage;
        this.TGT_calculatePages();
        this.totalDepreciationValues(cloneItem.Date, cloneItem.IsValid);
        this.totalDepreciationIFRSValues(cloneItem.Date, cloneItem.IsValid);        
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        console.log(error);
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async filterDepreciationIFRS(data: NgForm){
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    this.fixedAssetFilter.IsFilter = true;
    this.fixedAssetFilter.Page = 1;
    this.fixedAssetFilter.PerPage = 1000;

    let cloneItem = new FixedAssetFilter();
    Object.assign(cloneItem, this.fixedAssetFilter);

    cloneItem.Date = data.value.depreciationDate == null ? null : convertNgbDateToDateString(data.value.depreciationDate);
    cloneItem.WillDepreciationBeCalculated = data.value.WillDepreciationBeCalculated;
    cloneItem.WillIfrsbeCalculated = data.value.WillIfrsbeCalculated;
    cloneItem.IsValid=this.isValid;

    await this.baseService.depreciationService.GetIFRSFixedAssetDetail(
      cloneItem,
      (fixedAssets: FixedAsset[],totalPage) => {

        this.fixedAssets = fixedAssets;
        this.dataTable.TGT_loadData(this.fixedAssets);
        this.currentPage = 1;
        this.perInPage = 1000;
        this.totalPage = totalPage;
        this.TGT_calculatePages();
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        console.log(error);
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  today() {
    let getdate:NgbDate = getToday();
    console.log(getToday());
    return getToday();
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    let selectedItems= this.dataTable.TGT_getSelectedItems();
    
    if(tabChangeEvent.index==0){
      this.totalDepreciationValues(this.today(), true);
      this.loadDepreciationList();
      this.loadFixedAssetProperties();
      
      this.isDepreciationList=true;
      this.isDepreciationIFRSList=false;
      this.isDetailInfo=true;
      this.isDetailInfoIFRS=false;
    } 
    else if(tabChangeEvent.index==1){
      this.totalDepreciationIFRSValues(this.today(), true);      
      this.loadDepreciationIFRSList();
      this.loadFixedAssetPropertiesIFRS();

      this.isDepreciationList=false;
      this.isDepreciationIFRSList=true;
      this.isDetailInfoIFRS=true;
      this.isDetailInfo=false;      
    }
  }

   totalDepreciationValues(date:NgbDate, isValid: boolean){
     this.baseService.depreciationService.DepreciationTotalValues(date, isValid,
      (totalValues: any[],totalPage) => {

        this.totalAccumulatedValue = totalValues == null ? null : totalValues[0].TotalAccumulatedValue;
        this.totalNddValue = totalValues == null ? null : totalValues[0].TotalNDDValue;
        this.totalDepreciationMonthlyValue = totalValues == null ? null : totalValues[0].TotalValue;
        this.totalRevaluatedValue = totalValues == null ? null : totalValues[0].TotalRevaluatedValue;
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        console.log(error); 
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  totalDepreciationIFRSValues(date:NgbDate, isValid: boolean){
    this.baseService.depreciationService.DepreciationIFRSTotalValues(date, isValid,
     (totalValues: any[],totalPage) => {

       this.totalAccumulatedValue = totalValues == null ? null : totalValues[0].TotalAccumulatedValue;
       this.totalNddValue = totalValues == null ? null : totalValues[0].TotalNDDValue;
       this.totalDepreciationMonthlyValue = totalValues == null ? null : totalValues[0].TotalValue;
       this.totalRevaluatedValue = totalValues == null ? null : totalValues[0].TotalRevaluatedValue;
     },
     (error: HttpErrorResponse) => {
       /* Show alert message */
       console.log(error); 
       this.baseService.popupService.ShowErrorPopup(error);
     }
   );
  }

  isExitFixedAsset(event){
    if(event.target.checked==true){
      this.isValid=false;
    }
    else{
      this.isValid=true;
    }
  }
}
