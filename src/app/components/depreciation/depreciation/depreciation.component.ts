import { Component, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { BaseService } from "../../../services/base.service";
import { BaseComponent } from "../../base/base.component";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import { Page } from "../../../extends/TreeGridTable/models/Page";
import { FixedAsset } from "../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { Currency } from "../../../models/Currency";
import { DepreciationCalculationType } from "../../../models/DepreciationCalculationType";
import { MatTabChangeEvent } from '@angular/material';
import { Depreciation } from '../../../models/Depreciation';
import { DepreciationIFRS } from '../../../models/DepreciationIFRS';
import { FixedAssetFilter } from '../../../models/FixedAssetFilter';
import { convertNgbDateToDateString } from '../../../declarations/extends';
import { FixedAssetCardProperty } from '../../../models/FixedAssetCardProperty';

@Component({
  selector: "app-depreciation",
  templateUrl: "./depreciation.component.html",
  styleUrls: ["./depreciation.component.css"]
})
export class DepreciationComponent extends BaseComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["fixedAssetBarcodes"]) {
      // this.loadLostFixedAsset();
    }
  }
  isWaitingInsertOrUpdate: boolean = false;  
  searchDescription: string = "";
  fixedAssets: FixedAsset[] = [];
  fixedAsset: FixedAsset = new FixedAsset();

  fixedAssetFilters: FixedAssetFilter[] = [];
  fixedAssetFilter: FixedAssetFilter = new FixedAssetFilter();

  path: string;
  currentPage: number = 1;
  perInPage: number = 10000;
  totalPage: number = 1;
  pages: Page[] = [];
  fixedAssetIds: number[] = [];
  currencies: Currency[] = [];
  depreciationTypes: DepreciationCalculationType[] = [];
  fixedAssetBarcodes: string;
  depreciationBeCalculated: boolean = false;
  ifrsDepreciationBeCalculated: boolean = false;
  fixedAssetDepreciationDetails: Depreciation[]=[];
  fixedAssetIfrsDepreciationDetails: DepreciationIFRS[]=[];
  isDetailInfo: boolean = false;
  isDepreciationTab: boolean = false;
  isIFRSTab: boolean = false;
  isValid: boolean = true;
  isDepreciationNull: boolean=false;
  isFixedAssetList: boolean;
  isExitList: boolean;

  requiredDepreciation:boolean = false;
  requiredIFRS:boolean = true;

  isDepreciationCalculation:boolean=false;
  isDepreciationCalculationIfrs:boolean=false;

    /* Is Table Exporting */
    isTableExporting: boolean = false;
    faProperties: FixedAssetCardProperty[] = [];

    dataDepreciation: NgForm;

  public dataTable: TreeGridTable = new TreeGridTable(
    "depreciation",
    [
      {
        columnDisplayName: "Barkod",
        columnName:["Barcode"],
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
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Activation_Date'),
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
        columnDisplayName: this.getLanguageValue('Expense_Center'),
        columnName: ["ExpenseCenter", "Name"],
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
        columnName: ["DepreciationCalculationType",
          "DepreciationCalculationTypeDescription"
        ],
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


  public dataTableDepreciationDetail: TreeGridTable = new TreeGridTable(
    "depreciationdetail",
    [
      {
        columnDisplayName: "Amortisman Tarihi",
        columnName: ["EndDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.EndDate ? value.EndDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Amortisman Değeri",
        columnName: ["Value"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value  => {
          return value.Value == 0 ? '0' : value.Value;
        }
      },
      {
        columnDisplayName: "Birikmiş Amortisman",
        columnName: ["AccumulatedValue"], 
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value  => {
          return value.AccumulatedValue == 0 ? '0' : value.AccumulatedValue;
        }
      },
      {
        columnDisplayName: "Net Defter Değeri",
        columnName: ["Nddvalue"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value  => {
          return value.Nddvalue == 0 ? '0' : value.Nddvalue;
        }
      },
    ],
    {
      isDesc: false,
      column: ["EndDate"]
    }
  );

  public dataTableIFRSDepreciationDetail: TreeGridTable = new TreeGridTable(
    "ifrsdepreciationdetail",
    [
      {
        columnDisplayName: "Amortisman Tarihi",
        columnName: ["EndDate"],
        isActive: false,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Amortisman Tarihi",
        columnName: ["|EndDateIfrs"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.EndDate ? value.EndDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: "Aylık Değer",
        columnName: ["Value"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value  => {
          return value.Value == 0 ? '0' : value.Value;
        }
      },
      {
        columnDisplayName: "Net Defter Değeri",
        columnName: ["Nddvalue"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value  => {
          return value.Nddvalue == 0 ? '0' : value.Nddvalue;
        }
      }
    ],
    {
      isDesc: false,
      column: ["EndDate"]
    }
  );

  constructor(protected baseService: BaseService) {
    super(baseService);
    // this.loadFixedAssetDepreciations();
    this.loadDropdownList();
    this.loadFixedAsset(this.perInPage, this.currentPage);
    this.loadFixedAssetProperties();

    this.dataTable.isPagingActive = false;

    this.dataTableDepreciationDetail.isPagingActive=false;
    this.dataTableDepreciationDetail.isMultipleSelectedActive=false;

    this.dataTableIFRSDepreciationDetail.isPagingActive=false;
    this.dataTableIFRSDepreciationDetail.isMultipleSelectedActive=false;
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

    //Demirbaş Listesi
    async loadFixedAsset(_perInPage: number = 25, _currentPage: number = 1) {

      this.searchDescription = '';
      this.dataTable.TGT_clearData();
      this.dataTable.isLoading = true;

      this.baseService.fixedAssetService.GetFixedAsset(_perInPage, _currentPage, false,
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


  //Amortisman Detayları
  // async loadFixedAssetDepreciations(_perInPage: number = 25, _currentPage: number = 1) {
  //   this.searchDescription = "";
  //   this.dataTable.TGT_clearData();
  //   this.dataTable.isLoading = true;

  //   this.baseService.depreciationService.GetDepreciationFixedAsset(
  //     _perInPage,
  //     _currentPage,
  //     false,
  //     true,
  //     (fa: FixedAsset[], totalPage: number, message: string) => {
  //       this.perInPage = _perInPage;
  //       this.currentPage = _currentPage;
  //       this.dataTable.perInPage = _perInPage;
  //       this.fixedAssets = fa;
  //       this.totalPage = totalPage ? totalPage : 1;

  //       this.dataTable.TGT_loadData(this.fixedAssets);
  //       this.TGT_calculatePages();
  //     },
  //     (error: HttpErrorResponse) => {
  //       this.baseService.popupService.ShowErrorPopup(error);
  //     }
  //   );
  // }

  loadDropdownList() {

    this.baseService.currencyService.GetCurrencies(
      currencies => {
        this.currencies = currencies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    this.baseService.depreciationService.GetDepreciationCalculationTypes(
      depreciationTypes => {
        this.depreciationTypes = depreciationTypes;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }


    onSubmitDepreciation(dataDepreciation: NgForm) {

    if (dataDepreciation.form.invalid == true) return;
      
    /* Check model state is valid */

    this.popupComponent.ShowModal('#modalShowQuestionPopupForDepreciation');
    this.popupComponent.CloseModal('#modalUpdateDepreciation');
  }

  async depreciationInfo() {
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        this.getLanguageValue("Please_choose_at_least_one_record")
      );
      return;
    } else if (!selectedItems || selectedItems.length == 1) {
      this.baseService.fixedAssetService.GetFixedAssetById(
        selectedItems[0].getId(),
        (result: FixedAsset) => {
          Object.assign(this.fixedAsset, result);
          this.depreciationBeCalculated = result.WillDepreciationBeCalculated == null ? false : result.WillDepreciationBeCalculated;
          this.ifrsDepreciationBeCalculated = result.WillIfrsbeCalculated == null ? false : result.WillIfrsbeCalculated;
          this.fixedAssetBarcodes = result.Barcode;
          $("#showModal").click();
        },
        (error: HttpErrorResponse) => {
          /* hide spinner */
          this.baseService.spinner.hide();

          /* show error message */
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    } else {
      this.selectedBarcodes();
      this.depreciationBeCalculated = false;
      this.ifrsDepreciationBeCalculated = false;
      this.fixedAsset= new FixedAsset();
      $("#showModal").click();
    }
  }

  async depreciationInfoForDetail() {

    let selectedItems = this.dataTable.TGT_getSelectedItems();

      this.baseService.fixedAssetService.GetFixedAssetById(
        selectedItems[0].getId(),
        (result: FixedAsset) => {
          Object.assign(this.fixedAsset, result);
          this.depreciationBeCalculated = result.WillDepreciationBeCalculated == null ? false: result.WillDepreciationBeCalculated;
          this.ifrsDepreciationBeCalculated = result.WillIfrsbeCalculated == null ? false: result.WillIfrsbeCalculated;
          this.fixedAssetBarcodes = result.Barcode;
        },
        (error: HttpErrorResponse) => {
          /* hide spinner */
          this.baseService.spinner.hide();

          /* show error message */
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
  }

  async updateAllDepreciation(data: NgForm) {

    
    /* Activate the loading spinner */
    this.baseService.spinner.show();

    this.isWaitingInsertOrUpdate = true;
    
    /* Convert object to new object */
    let willUpdateItem = new FixedAsset();
    Object.assign(willUpdateItem, this.fixedAsset);

    this.fixedAsset.FixedAssetIds = (<FixedAsset[]>(
      this.dataTable.TGT_getSelectedItems()
    )).map(x => x.FixedAssetId);

          /* Update fixed asset values with valid values */
          willUpdateItem.FixedAssetIds = this.fixedAsset.FixedAssetIds;
          willUpdateItem.Price = this.fixedAsset.Price ? Number(this.fixedAsset.Price) : 0;
          willUpdateItem.Ifrsprice = this.fixedAsset.Ifrsprice ? Number(this.fixedAsset.Ifrsprice) : 0;
          willUpdateItem.CurrencyId = this.fixedAsset.CurrencyId ? Number(this.fixedAsset.CurrencyId) : null;
          willUpdateItem.IFRSCurrecyId = this.fixedAsset.IfrscurrecyId ? Number(this.fixedAsset.IfrscurrecyId) : null;
          willUpdateItem.IfrscurrecyId = this.fixedAsset.IfrscurrecyId ? Number(this.fixedAsset.IfrscurrecyId) : null;
          willUpdateItem.DepreciationPeriod = this.fixedAsset.DepreciationPeriod ? Number(this.fixedAsset.DepreciationPeriod): null;
          willUpdateItem.Ifrsperiod = this.fixedAsset.Ifrsperiod ? Number(this.fixedAsset.Ifrsperiod) : null;
          willUpdateItem.WillDepreciationBeCalculated = this.fixedAsset.WillDepreciationBeCalculated ? true: false;
          willUpdateItem.WillIfrsbeCalculated = this.fixedAsset.WillIfrsbeCalculated ? true: false;
          willUpdateItem.HasInflationIndexation = this.fixedAsset.HasInflationIndexation ? true : false;

          this.baseService.depreciationService.UpdateDepreciation(
            willUpdateItem,
            (_fixedAsset, message) => {
              
              /* Deactive the spinner */
              this.baseService.spinner.hide();

              /* Close loading icon */              
              this.isWaitingInsertOrUpdate = false;

              /* Show pop up then update data in datatable */
              this.baseService.popupService.ShowSuccessPopup(message);

              this.dataTable.TGT_updateData(willUpdateItem);

              this.resetDepreciationPopup();

              // this.loadFixedAssetDepreciations();
              this.loadFixedAsset(this.perInPage, this.currentPage);
              this.loadFixedAssetProperties();

              this.requiredIFRS == false;
              this.requiredDepreciation == false;

              /* Get original source from table */
              this.fixedAssets = <FixedAsset[]>this.dataTable.TGT_copySource();
            },
            (error: HttpErrorResponse) => {
              // this.isWaitingInsertOrUpdate = false;
              /* Show error message */
              
              /* Deactive the spinner */
              this.baseService.spinner.hide();

              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
          this.popupComponent.CloseModal('#modalShowQuestionPopupForDepreciation');      
  }


  loadDepreciationByFixedAssetId(){

    let selectedIds = (<FixedAsset[]>this.dataTable.TGT_getSelectedItems()).map(x=>x.getId());
    let fixedAssetId: number;
    fixedAssetId=selectedIds[0];

    this.baseService.depreciationService.GetDepreciationById(
      fixedAssetId,
      (depreciationDetails: Depreciation[]) => {
        if(depreciationDetails.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
          this.dataTableDepreciationDetail.isLoading=false;

          let dataSource : Depreciation[]=[];
          this.dataTableDepreciationDetail.TGT_loadData(dataSource);
          }

         else if (selectedIds.length > 1) {
          this.baseService.popupService.ShowAlertPopup(
            "Birden fazla demirbaş seçtiniz.!"
          );
          return;
        }
      else
      {
        Object.assign(this.fixedAssetDepreciationDetails, depreciationDetails);
        this.dataTableDepreciationDetail.TGT_loadData(this.fixedAssetDepreciationDetails);
      }
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadDepreciationIFRSByFixedAssetId(){

    let selectedIds = (<FixedAsset[]>this.dataTable.TGT_getSelectedItems()).map(x=>x.getId());
    let fixedAssetId: number;
    fixedAssetId=selectedIds[0];

    this.baseService.depreciationService.GetIFRSDepreciationById(
      fixedAssetId,
      (ifrsDepreciationDetails: DepreciationIFRS[]) => {
        if(ifrsDepreciationDetails.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
          this.dataTableIFRSDepreciationDetail.isLoading=false;

          let dataSource : DepreciationIFRS[]=[];
          this.dataTableIFRSDepreciationDetail.TGT_loadData(dataSource);
          }

         else if (selectedIds.length > 1) {
          this.baseService.popupService.ShowAlertPopup(
            "Birden fazla demirbaş seçtiniz!"
          );
          return;
        }
      else
      {
        this.fixedAssetIfrsDepreciationDetails = ifrsDepreciationDetails;
        this.dataTableIFRSDepreciationDetail.TGT_loadData(ifrsDepreciationDetails);
        // this.dataTableIFRSDepreciationDetail.TGT_loadData(this.fixedAssetIfrsDepreciationDetails);
      }
       },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  public selectedBarcodes() {
    let selectedItems = <FixedAsset[]>this.dataTable.TGT_getSelectedItems();
    this.fixedAssetBarcodes = "";
    selectedItems.forEach((e, i) => {
      this.fixedAssetBarcodes +=
        e.Barcode + (i == selectedItems.length - 1 ? "" : ", ");
    });

    return this.fixedAssetBarcodes;
  }

  willIfrsDepreciationBeCalculated(event) {
    if (event.target.checked == true) {
      this.ifrsDepreciationBeCalculated = true;
    } else {
      this.ifrsDepreciationBeCalculated = false;
      this.fixedAsset.Ifrsperiod = null;
      this.fixedAsset.Ifrsprice = null;
      this.fixedAsset.IFRSCurrecyId = null;    
    }
  }

  willDepreciationBeCalculated(event) {
    if (event.target.checked == true) {
      this.depreciationBeCalculated = true;
    } else {
this.depreciationBeCalculated = false;      
      this.fixedAsset.DepreciationCalculationTypeId = null;
      this.fixedAsset.DepreciationPeriod = null;
    }
  }


  resetForm(data: NgForm, isNewItem: boolean) {
    data.resetForm(this.fixedAsset);
    if (isNewItem == true) {
      this.selectedBarcodes = null;
      // this.fixedAsset = new FixedAsset();
    }
  }

  resetDepreciationPopup(){
    if (this.dataDepreciation !=  null) {
      this.dataDepreciation.resetForm(this.fixedAsset);      
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    let selectedItems= this.dataTable.TGT_getSelectedItems();
  
    if(tabChangeEvent.index==0){
      this.isDetailInfo=false;
      // this.loadFixedAssetDepreciations();
      this.loadFixedAsset(this.perInPage, this.currentPage);
      this.loadFixedAssetProperties();
    }
    else if(tabChangeEvent.index==1){
      this.loadDepreciationByFixedAssetId();
      this.depreciationInfoForDetail();

      this.isDetailInfo=true;      
      this.isDepreciationTab=true;
      this.isIFRSTab=false; 
    }
    else if(tabChangeEvent.index==2){
      this.loadDepreciationIFRSByFixedAssetId();
      this.depreciationInfoForDetail();

      this.isDetailInfo=true;
      this.isIFRSTab=true; 
      this.isDepreciationTab=false;       
    }
  }

  onClickCalculateDepreciation(calculationType:number){
    let selectedItems = (<FixedAsset[]>(this.dataTable.TGT_getSelectedItems()));

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        this.getLanguageValue("Please_choose_at_least_one_record")
      );
      return;
    }


     switch (calculationType) {
       case 1:
       this.isDepreciationCalculation=true;
       this.isDepreciationCalculationIfrs=false;

       
     //Seçili kayıtlardan hiçbirinin amortisman bilgisi yoksa 
     let hasDepreciation: boolean = false;
     selectedItems.forEach(e=> {
       if(e.WillDepreciationBeCalculated==true)
       hasDepreciation=true;
     }); 

     if(hasDepreciation == false){
       this.baseService.popupService.ShowAlertPopup(
         this.getLanguageValue("There_is_no_value_to_calculate")
       );
       return;
     }
         break;
  
      case 2:
      this.isDepreciationCalculationIfrs=true;
      this.isDepreciationCalculation=false;

      
     //Seçili kayıtlardan hiçbirinin IFRS bilgisi yoksa 
     let hasIfrsDepreciation: boolean = false;
     selectedItems.forEach(e=> {
       if(e.WillIfrsbeCalculated==true)
       hasIfrsDepreciation=true;
     }); 

     if(hasIfrsDepreciation == false){
       this.baseService.popupService.ShowAlertPopup(
         this.getLanguageValue("There_is_no_value_to_calculate")
       );
       return;
     }
        break;
  
       default:
         break;
     }
    this.popupComponent.ShowModal('#modalShowQuestionPopupForCalculateDepreciation');
  }
  
  async calculateDepreciations(dataDepreciation: NgForm){

        /* Activate the loading spinner */
        this.baseService.spinner.show();

        this.fixedAsset.FixedAssetIds = (<FixedAsset[]>(
          this.dataTable.TGT_getSelectedItems()
        )).map(x => x.FixedAssetId);

       this.baseService.depreciationService.CalculateAllDepreciation(
        this.fixedAsset,
        (insertedItem: FixedAsset, message) => {
          /* Deactive the spinner */
          this.baseService.spinner.hide();

          /* Show success pop up */
          this.baseService.popupService.ShowSuccessPopup(message);

          this.loadFixedAsset(this.perInPage, this.currentPage);
          this.loadFixedAssetProperties();
          this.resetDepreciationPopup();
        },
        (error: HttpErrorResponse) => {
          /* Deactive the spinner */
          this.baseService.spinner.hide();

          /* Show alert message */
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
      this.popupComponent.CloseModal('#modalShowQuestionPopupForCalculateDepreciation');
  }

    async calculateIfrsDepreciations(dataDepreciation: NgForm){

        /* Activate the loading spinner */
        this.baseService.spinner.show();

        this.fixedAsset.FixedAssetIds = (<FixedAsset[]>(
          this.dataTable.TGT_getSelectedItems()
        )).map(x => x.FixedAssetId);
        
        this.baseService.depreciationService.CalculateAllIfrsDepreciation(
        this.fixedAsset,
        (insertedItem: FixedAsset, message) => {
          /* Deactive the spinner */
        this.baseService.spinner.hide();

          /* Show success pop up */
          this.baseService.popupService.ShowSuccessPopup(message);

          this.loadFixedAsset(this.perInPage, this.currentPage);
          this.loadFixedAssetProperties();
          this.resetDepreciationPopup();
          
        },
        (error: HttpErrorResponse) => {
           /* Deactive the spinner */
          this.baseService.spinner.hide();

          /* Show alert message */
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
  this.popupComponent.CloseModal('#modalShowQuestionPopupForCalculateDepreciation');  
}

  async resetFilter() {

    this.fixedAssetFilter = new FixedAssetFilter();
    this.fixedAssetFilter.WillDepreciationBeCalculated=false;
    this.fixedAssetFilter.WillIfrsbeCalculated=false;
    this.isExitList=false;
  }

  selectedFixedAsset: FixedAsset;
  onClickDepreciation(item) {
    this.selectedFixedAsset=item;
  }  

  checkValidation(data: NgForm){  

    this.dataDepreciation = data;

    if(this.depreciationBeCalculated == true && (this.fixedAsset.DepreciationPeriod == null || this.fixedAsset.DepreciationCalculationTypeId == null || this.fixedAsset.CurrencyId == null || this.fixedAsset.Price == null))
    this.requiredDepreciation = true;
    else
    this.requiredDepreciation = false;        

    
    if(this.ifrsDepreciationBeCalculated == true && (this.fixedAsset.Ifrsperiod == null || this.fixedAsset.IfrscurrecyId ==null || this.fixedAsset.Ifrsprice == null))
    this.requiredIFRS = true;
    else
    this.requiredIFRS = false;   

    if(this.requiredIFRS == false && this.requiredDepreciation == false){
      
      this.popupComponent.ShowModal('#modalShowQuestionPopupForDepreciation');
      this.popupComponent.CloseModal('#modalUpdateDepreciation');
  
      this.requiredDepreciation = true;
      this.requiredIFRS = true;
      
    }
} 

}