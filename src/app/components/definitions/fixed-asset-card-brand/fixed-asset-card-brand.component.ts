import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { FixedAssetCardBrand } from "../../../models/FixedAssetCardBrand";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { BaseComponent } from "../../base/base.component";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import { FixedAssetCardModel } from "src/app/models/FixedAssetCardModel";

@Component({
  selector: "app-fixed-asset-card-brand",
  templateUrl: "./fixed-asset-card-brand.component.html",
  styleUrls: ["./fixed-asset-card-brand.component.css"]
})
@NgModule({
  imports: [ ReactiveFormsModule],
  declarations: [FixedAssetCardBrandComponent],
  providers: [FixedAssetCardBrandComponent]
})
export class FixedAssetCardBrandComponent extends BaseComponent
  implements OnInit {

  fixedAssetCardBrands: FixedAssetCardBrand[] = [];
  fixedAssetCardBrand: FixedAssetCardBrand = new FixedAssetCardBrand();

  public dataTable: TreeGridTable = new TreeGridTable(
    "fixedassetcardbrand",
    [
      {
        columnDisplayName: "Kod",
        columnName: ["FixedAssetCardBrandCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Marka",
        columnName: ["Name"],
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
    this.loadFixedAssetCardBrands();
    //this.loadFixedAssetCardModels();    
  }

  ngOnInit() {}

  resetForm() {
    this.fixedAssetCardBrand = new FixedAssetCardBrand();
  }

  onSubmit(data: NgForm) {
    if (data.value.FixedAssetCardBrandId == null)
      this.insertFixedAssetCardBrand(data);
    else this.updateFixedAssetCardBrand(data);
  }

  async deleteFixedAssetCardBrand() {

    let selectedItems = this.dataTable.TGT_getSelectedItems();

    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir şirket seçiniz"
      );
      return;
    }

    await this.baseService.popupService.ShowQuestionPopupForDelete(() => {

      this.baseService.spinner.show();

      let itemIds: number[] = selectedItems.map(x => x.getId());

      this.baseService.fixedAssetCardBrandService.DeleteFixedAssetCarBrands(
        itemIds,
        (notDeletedItemIds: number[]) => {
          /* Deactive the spinner */
          this.baseService.spinner.hide();

          /* if any item exists in not deleted items */
          if (notDeletedItemIds) {
            /* Service return us not deleted ids. We will delete ids which exists in notDeletedItemIds number array */
            for (let ii = 0; ii < itemIds.length; ii++) {
              if (notDeletedItemIds.includes(itemIds[ii])) {
                itemIds.splice(ii, 1);
                ii--;
              }
            }

            /* if any value couldnt delete then show popup */
            if (itemIds.length == 0) {
              this.baseService.popupService.ShowAlertPopup(
                "Hiç Bir Kayıt Silinemedi!"
              );
              return;
            }

            /* if some of them is deleted show this */
            if (itemIds.length > 0) {
              this.baseService.popupService.ShowAlertPopup(
                selectedItems.length.toString() +
                  " kayıttan " +
                  itemIds.length.toString() +
                  "'i silinebildi!"
              );
            }
          } else {
            /* if all of them removed */
            this.baseService.popupService.ShowAlertPopup(
              " Tüm kayıtlar başarıyla silindi!"
            );
          }

          /* Now Delete items from the source */
          for (let ii = 0; ii < itemIds.length; ii++) {
            let index = this.fixedAssetCardBrands.findIndex(
              x => x.FixedAssetCardBrandId == itemIds[ii]
            );
            if (index > -1) {
              this.fixedAssetCardBrands.splice(index, 1);
            }
          }

          /* Reload Page */
          this.dataTable.TGT_loadData(this.fixedAssetCardBrands);
        },
        (error: HttpErrorResponse) => {
          this.baseService.spinner.hide();
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    });
  }

  async insertFixedAssetCardBrand(data: NgForm) {
    if (data.form.invalid == true) return;

    await this.baseService.fixedAssetCardBrandService.InsertFixedAssetCardBrand(
      this.fixedAssetCardBrand,
      (insertedItem: FixedAssetCardBrand, message) => {
        this.baseService.popupService.ShowSuccessPopup(message);
        this.fixedAssetCardBrand.FixedAssetCardBrandId=insertedItem.FixedAssetCardBrandId;
        this.fixedAssetCardBrands.push(this.fixedAssetCardBrand);
        this.dataTable.TGT_loadData(this.fixedAssetCardBrands);
        this.resetForm();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async updateFixedAssetCardBrand(data: NgForm) {
    if(data.form.invalid==true) return;
    
    await this.baseService.popupService.ShowQuestionPopupForUpdate((response:boolean) => {
      if (response == true) {
        this.baseService.fixedAssetCardBrandService.UpdateFixedAssetCardBrand(
          this.fixedAssetCardBrand,
          (_fixedAssetCardBrand, message) => {
            this.baseService.popupService.ShowSuccessPopup(message);
            this.dataTable.TGT_updateData(this.fixedAssetCardBrand);
            this.resetForm();
          },
          (error: HttpErrorResponse) => {
            this.baseService.popupService.ShowErrorPopup(error);
          }
        );
      }
    });
  }

 async loadFixedAssetCardBrands() {   
   await this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
      (facbs: FixedAssetCardBrand[]) => {
        this.fixedAssetCardBrands = facbs;
        this.dataTable.TGT_loadData(this.fixedAssetCardBrands);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async onDoubleClickItem(item: FixedAssetCardBrand) {
    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* get company information from server */
    await this.baseService.fixedAssetCardBrandService.GetFixedAssetBrandById(
      item.FixedAssetCardBrandId,
      (result: FixedAssetCardBrand) => {
        /* then bind it to company model to update */
        setTimeout(() => {
          /* Trigger to model to show it */
          $("#btnAddFixedAssetCardBrand").trigger("click");

          /* bind result to model */
          this.fixedAssetCardBrand = result;
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
}
