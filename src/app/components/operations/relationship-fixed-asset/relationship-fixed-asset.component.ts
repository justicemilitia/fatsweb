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
      this.loadRelationalFixedAssetPopup();
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

  errorMessage: HttpErrorResponse;

  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedassetrelationship",
    [
      {
        columnDisplayName: this.getLanguageValue('Barcode'),
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Name'),
        columnName: ["FixedAssetCard", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Category_Name'),
        columnName: ["FixedAssetCard", "FixedAssetCardCategory", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Serial_Number'),
        columnName: ["SerialNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Brand_Name'),
        columnName: ["FixedAssetCardModel", "FixedAssetCardBrand", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Model_Name'),
        columnName: ["FixedAssetCardModel", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Statu_Name'),
        columnName: ["Status", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Statu_Code'),
        columnName: ["Status", "FixedAssetStatusCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Price'),
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
        columnDisplayName: this.getLanguageValue('Location_Name'),
        columnName: ["Location", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Code'),
        columnName: ["Location", "LocationCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Barcode'),
        columnName: ["Location", "Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Coordinate'),
        columnName: ["Location", "Coordinate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Address'),
        columnName: ["Location", "Address"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Location_Description'),
        columnName: ["Location", "Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Receipt_Date'),
        columnName: ["ReceiptDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Invoice_No'),
        columnName: ["InvoiceNo"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Invoice_Date'),
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
        columnDisplayName: this.getLanguageValue('Depreciation_Period'),
        columnName: ["DepreciationPeriod"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('IFRS_Price'),
        columnName: ["Ifrsprice"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Will_IFRS_Be_Calculated'),
        columnName: ["WillIfrsbeCalculated"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('IFRS_Period'),
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
        columnDisplayName: this.getLanguageValue('Guarentee_Start_Date'),
        columnName: ["GuaranteeStartDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Guarentee_End_Date'),
        columnName: ["GuaranteeEndDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Activation_Date'),
        columnName: ["ActivationDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Department_Code'),
        columnName: ["Department", "DepartmentCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Department_Name'),
        columnName: ["Department", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Department_Description'),
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
        columnDisplayName: this.getLanguageValue('Barcode'),
        columnName: ["Barcode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Card_Name'),
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
          this.errorMessage = error;
          this.popupComponent.ShowModal("#modalShowErrorMessage");                    
          // this.baseService.popupService.ShowErrorPopup(error);
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
          // this.errorMessage = error;
          // this.popupComponent.ShowModal("#modalShowErrorMessage");          

          /* Show alert message */          
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }
  
    loadRelationalFixedAssetPopup() {
      this.parentIds = [];
      let selectedItems = <FixedAssetRelationship[]>(
        this.dataTable.TGT_getSelectedItems()
      );
  
      selectedItems.forEach((e : FixedAssetRelationship) => {
        if (e.FixedAssetParentId != null) {
          this.parentIds.push(e.FixedAssetParentId);
        }
      });
  
      if (!selectedItems || selectedItems.length == 0) {
        this.popupComponent.ShowModal("#modalSelectAtLeastOneFixedAsset");
        return;
      }
      else if(this.parentIds == null || this.parentIds.length == 0){
        this.popupComponent.ShowModal("#modalRelationshipFixedAsset");
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
        this.popupComponent.ShowModal("#modalRelationshipFixedAsset");
        
        // $("#btnOpenRelationship").trigger("click");
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

    closeModal(){
      this.popupComponent.CloseModal('#modalRelationshipFixedAsset');
    }
  }
  