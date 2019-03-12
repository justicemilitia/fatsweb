import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardProperty } from "../../../models/FixedAssetCardProperty";
import { HttpErrorResponse } from "@angular/common/http";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import * as $ from "jquery";
import { FixedAssetCardPropertyType } from "../../../models/FixedAssetCardPropertyType";

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

  /* Store Fixed Card Properties */
  fixedAssetCardProperties: FixedAssetCardProperty[] = [];

  /* Store Fixed Card Property Types */
  fixedAssetCardPropertyTypes: FixedAssetCardPropertyType[] = [];

  /* Current Fixed Asset Card Property */
  fixedAssetCardProperty: FixedAssetCardProperty = new FixedAssetCardProperty();

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
        columnName: ["FixedAssetCardPropertyType", "Name"],
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
        type: "text"
      },
      {
        columnDisplayName: "Özellik Değeri",
        columnName: ["FixedAssetPropertyValues", "Value"],
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

  constructor(public baseService: BaseService) {
    super(baseService);
    this.loadFixedAssetCardProperties();
  }

  ngOnInit() {}

  resetForm(data: NgForm, isNewItem: boolean) {
    /* Reset form if required create a new object */
    data.resetForm(this.fixedAssetCardProperty);
    if (isNewItem == true) {
      this.fixedAssetCardProperty = new FixedAssetCardProperty();
    }
  }

  onSubmit(data: NgForm) {
    /* if fixed asset card property id exists means update it, otherwise insert it */
    if (data.value.FixedAssetCardPropertyId == null) {
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
            this.baseService.popupService.ShowAlertPopup(
              "Kayıt Başarıyla silindi!"
            );
          else
            this.baseService.popupService.ShowAlertPopup(
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

    /* Insert Fixed Asset Card Property */
    await this.baseService.fixedAssetCardPropertyService.InsertFixedAssetCardProperty(
      this.fixedAssetCardProperty,
      (insertedItem: FixedAssetCardProperty, message) => {
        /* Close waiting loader */
        this.isWaitingInsertOrUpdate = false;

        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Set inserted Item id to model */
        this.fixedAssetCardProperty.FixedAssetCardPropertyId =
          insertedItem.FixedAssetCardPropertyId;

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
    await this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {
          /* Change button to loading */
          this.isWaitingInsertOrUpdate = true;

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

  async loadFixedAssetCardProperties() {
    /* Load all fixed asset card cateogories to datatable */
    await this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardProperties(
      (fixedAssetCardProperties: FixedAssetCardProperty[]) => {
        /* Bind Fixed Properties to model */
        this.fixedAssetCardProperties = fixedAssetCardProperties;

        /* Load data to table */
        this.dataTable.TGT_loadData(this.fixedAssetCardProperties);
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadFixedAssetCardPropertyTypes() {
    await this.baseService.fixedAssetCardPropertyService.GetFixedAssetCardPropertyTypes(
      (fixedAssetPropertyTypes: FixedAssetCardPropertyType[]) => {
        this.fixedAssetCardPropertyTypes = fixedAssetPropertyTypes;
        console.log(this.fixedAssetCardPropertyTypes);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }
}
