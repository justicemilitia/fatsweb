import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardProperty } from "../../../models/FixedAssetCardProperty";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { FixedAssetCardPropertyType } from "../../../models/FixedAssetCardPropertyType";
import { FixedAssetCardPropertyValue } from "src/app/models/FixedAssetCardPropertyValue";
import { PropertyValueTypes } from "../../../declarations/property-value-types.enum";
import { GetFixedAssetTypes } from 'src/app/declarations/fixed-asset-types';

@Component({
  selector: "app-fixed-asset-card-property",
  templateUrl: "./fixed-asset-card-property.component.html",
  styleUrls: ["./fixed-asset-card-property.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FixedAssetCardPropertyComponent],
  providers: [FixedAssetCardPropertyComponent]
})
export class FixedAssetCardPropertyComponent extends BaseComponent
  implements OnInit {
  /* Is Waititing for a request */
  isWaitingInsertOrUpdate: boolean = false;

  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;

  /* Is Table Exporting */
  isTableExporting: boolean = false;

  fixedAssetTypes = GetFixedAssetTypes();

  /* Store Fixed Card Properties */
  fixedAssetCardProperties: FixedAssetCardProperty[] = [];

  /* Store Fixed Card Property Types */
  fixedAssetCardPropertyTypes: FixedAssetCardPropertyType[] = [];

  /* Store Fixed Card Property Types */
  fixedAssetCardPropertyValues: FixedAssetCardPropertyValue[] = [];
  fixedAssetCardPropertyValue: FixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();

  /* Current Fixed Asset Card Property */
  fixedAssetCardProperty: FixedAssetCardProperty = new FixedAssetCardProperty();

  /* "Liste" option selected, or not */
  isListSelected: boolean;
  // fixedAssetCardPropertyValues: string[]=[];
  id: number;

  /* Data Table */
  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedassetcardproperty",
    [
      {
        columnDisplayName: "Özellik Adı",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Özellik Kodu",
        columnName: ["FixedAssetCardPropertyCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Özellik Tipi",
        columnName: ["FixedAssetType", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Tekil Mi?",
        columnName: ["IsUnique"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      },
      {
        columnDisplayName: "Özellik Değeri",
        columnName: ["FixedAssetAsDisplay"],
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

  /* Fixed Asset Card Property Value Data Table */
  public dataTablePropertyValue: TreeGridTable = new TreeGridTable(
    "fixedassetcardpropertyvalue",
    [
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
      column: ["Value"]
    }
  );

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetCardProperties();
    this.loadFixedAssetCardPropertyTypes();

    this.dataTablePropertyValue.isPagingActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isColumnOffsetActive = false;
    this.dataTablePropertyValue.isDeleteable = true;
    this.dataTablePropertyValue.isTableEditable = true;
    this.dataTablePropertyValue.isMultipleSelectedActive = false;
    this.dataTablePropertyValue.isLoading = false;
  }

  ngOnInit() { }

  resetForm(data: NgForm, isNewItem: boolean) {
    /* Reset form if required create a new object */
    data.resetForm(this.fixedAssetCardProperty);
    if (isNewItem == true) {
      this.fixedAssetCardProperty = new FixedAssetCardProperty();
      this.fixedAssetCardPropertyValues =[];
      this.dataTablePropertyValue.TGT_clearData();
      this.isListSelected = false;
    }
  }

  clearPropertValue() {
    this.fixedAssetCardProperty.FixedAssetPropertyValues = null;
  }

  onSubmit(data: NgForm) {
    /* if fixed asset card property id exists means update it, otherwise insert it */
    if (this.fixedAssetCardProperty.FixedAssetCardPropertyId == null) {
      this.addFixedAssetCardProperty(data);
    } else {
      this.updateFixedAssetCardProperty(data);
    }
  }

  async deleteFixedAssetCardProperties() {
    /* get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir şirket seçiniz"
      );
      return;
    }

    /* Show Question Message */
    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {
      /* Activate the loading spinner */
      this.baseService.spinner.show();

      /* Convert items to ids */
      let itemIds: number[] = selectedItems.map(x => x.getId());

      /* Delete all */
      this.baseService.fixedAssetCardPropertyService.DeleteFixedAssetCardProperties(
        itemIds,
        () => {
          /* Deactive the spinner */
          this.baseService.spinner.hide();

          /* if all of them removed */
          if (itemIds.length == 1)
            this.baseService.popupService.ShowSuccessPopup(
              "Kayıt Başarıyla silindi!"
            );
          else
            this.baseService.popupService.ShowSuccessPopup(
              "Tüm kayıtlar başarıyla silindi!"
            );

          /* Clear ids from source */
          this.dataTable.TGT_removeItemsByIds(itemIds);

          /* Get current table source */
          this.fixedAssetCardProperties = <FixedAssetCardProperty[]>(
            this.dataTable.TGT_copySource()
          );
        },
        (error: HttpErrorResponse) => {
          /* Deactive the spinner */
          this.baseService.spinner.hide();

          /* Show alert pop up */
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    });
  }

  async addFixedAssetCardProperty(data: NgForm) {
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    /* Close waiting loader */
    this.isWaitingInsertOrUpdate = true;

    this.fixedAssetCardPropertyValues = <FixedAssetCardPropertyValue[]>this.dataTablePropertyValue.TGT_copySource();

    this.fixedAssetCardProperty.FixedAssetPropertyValues = this.fixedAssetCardPropertyValues;

    /* Insert Fixed Asset Card Property */
    this.baseService.fixedAssetCardPropertyService.InsertFixedAssetCardProperty(
      this.fixedAssetCardProperty,
      (insertedItem: FixedAssetCardProperty, message) => {
        /* Close waiting loader */
        this.isWaitingInsertOrUpdate = false;

        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Set inserted Item id to model */
        this.fixedAssetCardProperty.FixedAssetCardPropertyId =
          insertedItem.FixedAssetCardPropertyId;

        /* Display item updated */
        this.fixedAssetCardProperty.FixedAssetPropertyValues.forEach((p, i) => {
          this.fixedAssetCardProperty.FixedAssetAsDisplay += p.Value + (i < this.fixedAssetCardProperty.FixedAssetPropertyValues.length - 1 ? "|" : "");
        });

        /* Push inserted item to Property list */
        this.fixedAssetCardProperties.push(this.fixedAssetCardProperty);

        /* Reload data table */
        this.dataTable.TGT_loadData(this.fixedAssetCardProperties);

        /* Reset Forms */
        this.resetForm(data, true);
      },
      (error: HttpErrorResponse) => {
        /* Close waiting loader */
        this.isWaitingInsertOrUpdate = false;

        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async updateFixedAssetCardProperty(data: NgForm) {
    /* Check model state */
    if (data.form.invalid == true) return;

    /* Ask for approve question if its true then update the fixed asset card Property */
    this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {
          /* Change button to loading */
          this.isWaitingInsertOrUpdate = true;

          this.fixedAssetCardPropertyValues = <FixedAssetCardPropertyValue[]>this.dataTablePropertyValue.TGT_copySource();

          this.fixedAssetCardProperty.FixedAssetPropertyValues = this.fixedAssetCardPropertyValues;

          /* Update Model to database */
          this.baseService.fixedAssetCardPropertyService.UpdateFixedAssetCardProperty(
            this.fixedAssetCardProperty,
            (_fixedAssetCardProperty, message) => {
              /* Change loading to button */
              this.isWaitingInsertOrUpdate = false;

              /* Show pop up then update data in datatable */
              this.baseService.popupService.ShowSuccessPopup(message);

              /* Create a fixed asset for updated item to create a refrences */
              let updatedModel = new FixedAssetCardProperty();
              Object.assign(updatedModel, this.fixedAssetCardProperty);

              if (updatedModel.FixedAssetTypeId != PropertyValueTypes.Liste) {
                updatedModel.FixedAssetPropertyValues = [];
              }

              /* Display item updated */
              updatedModel.FixedAssetPropertyValues.forEach((p, i) => {
                updatedModel.FixedAssetAsDisplay += p.Value + (i < updatedModel.FixedAssetPropertyValues.length - 1 ? "|" : "");
              });

              /* Update in datatable */
              this.dataTable.TGT_updateData(updatedModel);

              /* Get original source */
              this.fixedAssetCardProperties = <FixedAssetCardProperty[]>(
                this.dataTable.TGT_copySource()
              );
            },
            (error: HttpErrorResponse) => {
              /* Change loading to button */
              this.isWaitingInsertOrUpdate = false;

              /* Show error message */
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
        }
      }
    );
  }

  async onDoubleClickItem(item: FixedAssetCardProperty) {
    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* load property types if not loaded */
    this.loadFixedAssetCardPropertyTypes();

    /* get agreement information from server */
    this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardPropertyById(
      item.FixedAssetCardPropertyId,
      (result: FixedAssetCardProperty) => {
        /* then bind it to fixed asset card property model to update */
        setTimeout(() => {
          /* Trigger to model to show it */
          $("#btnAddFixedAssetCardProperty").trigger("click");

          if (result.FixedAssetTypeId == PropertyValueTypes.Liste)
            this.isListSelected = true;
          else
            this.isListSelected = false;

          this.dataTablePropertyValue.TGT_clearData();

          this.fixedAssetCardPropertyValues = <FixedAssetCardPropertyValue[]>this.dataTablePropertyValue.TGT_copySource();

          if (result.FixedAssetPropertyValues) {
            let values = <FixedAssetCardPropertyValue[]>result.FixedAssetPropertyValues;
            values.forEach((e: FixedAssetCardPropertyValue) => {
              let item = new FixedAssetCardPropertyValue();
              Object.assign(item, e);
              this.fixedAssetCardPropertyValues.push(item);
            })
          }

          this.dataTablePropertyValue.TGT_loadData(this.fixedAssetCardPropertyValues);


          /* bind result to model */
          this.fixedAssetCardProperty = result;
          this.baseService.spinner.hide();
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        /* hide spinner */
        this.baseService.spinner.hide();

        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadFixedAssetCardProperties() {
    /* Load all fixed asset card properties to datatable */
    await this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
      (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
        /* Bind Fixed Properties to model */
        this.fixedAssetCardProperties = fixedAssetCardProperties;
        this.fixedAssetCardProperties.forEach(e => {
          e.FixedAssetPropertyValues.forEach((p, i) => {
            e.FixedAssetAsDisplay += p.Value + (i < e.FixedAssetPropertyValues.length - 1 ? "|" : "");
          });
        });
        /* Load data to table */
        this.dataTable.TGT_loadData(this.fixedAssetCardProperties);
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async insertPropertyValueToArray(value: any) {
    value.value = value.value.trim();
  
    this.fixedAssetCardPropertyValues = <FixedAssetCardPropertyValue[]>this.dataTablePropertyValue.TGT_copySource();

    if (
      value.value != "" &&
      !this.fixedAssetCardPropertyValues.find(x => x.Value == value.value)
    ) {
      this.fixedAssetCardPropertyValue.Value = value.value;
      this.fixedAssetCardPropertyValue.FixedAssetPropertyValueId = this.getValueId();
      this.fixedAssetCardPropertyValues.push(this.fixedAssetCardPropertyValue);
      this.dataTablePropertyValue.TGT_loadData(this.fixedAssetCardPropertyValues);
      this.fixedAssetCardPropertyValue = new FixedAssetCardPropertyValue();
      value.value = null;
      $('#value').focus();
    } else {
      value.value = null;
    }
  }

  getValueId() {
    let id = 0;
    this.fixedAssetCardPropertyValues.forEach(e => {
      if (e.FixedAssetPropertyValueId < id)
        id = e.FixedAssetPropertyValueId;
    })
    return id - 1;
  }

  async loadFixedAssetCardPropertyTypes() {
    await this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardPropertyTypes(
      (fixedAssetPropertyTypes: FixedAssetCardPropertyType[]) => {
        this.fixedAssetCardPropertyTypes = fixedAssetPropertyTypes;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  changeValue(event) {
    if (event.target.value == PropertyValueTypes.Liste.toLocaleString())
      this.isListSelected = true;
    else {
      this.isListSelected = false;
    }
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadFixedAssetCardProperties();

    this.isTableRefreshing = false;

  }

}
