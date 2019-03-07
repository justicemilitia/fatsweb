import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { Agreement } from "../../../models/Agreement";
import { IData } from "src/app/extends/TreeGridTable/models/interfaces/IData";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import { Company } from '../../../models/Company';

@Component({
  selector: "app-agreement",
  templateUrl: "./agreement.component.html",
  styleUrls: ["./agreement.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule, HttpClient],
  declarations: [AgreementComponent],
  providers: [AgreementComponent]
})
export class AgreementComponent extends BaseComponent implements OnInit {
  selectedFile: any;

  /* List of agreements */
  agreements: Agreement[] = [];

  /* Current agreement */
  agreement: Agreement = new Agreement();

  /* List of companies */
  companies: Company[] = [];

  public dataTable: TreeGridTable = new TreeGridTable(
    "agreement",
    [
      {
        columnDisplayName: "Sözleşme Adı",
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Sözleşme Kodu",
        columnName: ["AgreementCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Sözleşme No",
        columnName: ["No"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "İlgili Şirket",
        columnName: ["Company", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Başlangıç Tarihi",
        columnName: ["StartDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => { return value ? (<Date>value).toLocaleString().substring(0,10).split("-").reverse().join("-"): ''}                
      },
      {
        columnDisplayName: "Bitiş Tarihi",
        columnName: ["EndDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => { return value ? (<Date>value).toLocaleString().substring(0,10).split("-").reverse().join("-"): ''}        
      },
      {
        columnDisplayName: "Tutar",
        columnName: ["Price"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Dosya",
        columnName: ["AgreementFile"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: "Açıklama",
        columnName: ["Description"],
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
    this.loadAgreements();
    this.loadCompanies();
  }

  ngOnInit() {}

  resetForm() {
    // this.agreement = new Agreement();
  }

  onSubmit(data: NgForm) {
    /* if agreement id exists means update it otherwise insert it */
    if (data.value.AgreementId == null) {
      this.addAgreements(data);
    } else {
      this.updateAgreement(data);
    }
  }

  async deleteAgreements() {
    /* get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir sözleşme seçiniz"
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
      this.baseService.agreementService.DeleteAgreements(
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
                "Hiçbir Kayıt Silinemedi!"
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
            let index = this.agreements.findIndex(
              x => x.AgreementId == itemIds[ii]
            );
            if (index > -1) {
              this.agreements.splice(index, 1);
            }
          }

          /* Reload Page */
          this.dataTable.TGT_loadData(this.agreements);
        },
        (error: HttpErrorResponse) => {
          this.baseService.spinner.hide();
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    });
  }

  async addAgreements(data: NgForm) {
    if (data.form.invalid == true) return;

    /* Insert agreement service */

    await this.baseService.agreementService.InsertAgreement(
      this.agreement,
      (data: Agreement, message) => {
        /* Show pop up, get inserted agreement then set it agreement id, then load data. */
        this.baseService.popupService.ShowSuccessPopup(message);
        this.agreement.AgreementId = data.AgreementId;
        this.agreements.push(this.agreement);
        this.dataTable.TGT_loadData(this.agreements);
        this.resetForm();
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async updateAgreement(data: NgForm) {
    /* Check model state */
    if (data.form.invalid == true) return;

    /* Ask for approve question if its true then update the agreement */
    await this.baseService.popupService.ShowQuestionPopupForUpdate(
      (response: boolean) => {
        if (response == true) {
          this.baseService.agreementService.UpdateAgreement(
            this.agreement,
            (_agreement, message) => {
              /* Show pop up then update data in datatable */
              this.baseService.popupService.ShowSuccessPopup(message);
              this.dataTable.TGT_updateData(this.agreement);
              this.resetForm();
            },
            (error: HttpErrorResponse) => {
              /* Show error message */
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
        }
      }
    );
  }

  async loadAgreements() {
    /* Load all agreements to datatable */
    await this.baseService.agreementService.GetAgreement(
      (agreements: Agreement[]) => {
        this.agreements = agreements;
        this.dataTable.TGT_loadData(this.agreements);
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadCompanies() {
    await this.baseService.companyService.GetCompanies(
      (companies: Company[]) => {
        this.companies = companies;
      },(error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadAgreementById(event: any) {
    if (event.target.value.toString().trim() !== "") {
      await this.baseService.agreementService.GetAgreementById(
        <number>event.target.value,
        (agreements: Agreement[]) => {
          /* Load agreements */
          this.agreements = this.agreements;
        },
        (error: HttpErrorResponse) => {
          /* show erro pop up */
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }
  }

  async onDoubleClickItem(item: Agreement) {
    /* Show spinner for loading */
    this.baseService.spinner.show();

     /* load companies if not loaded */
     await this.loadCompanies();

    /* get agreement information from server */
    await this.baseService.agreementService.GetAgreementById(
      item.AgreementId,
      (result: Agreement) => {
        /* then bind it to agreement model to update */
        setTimeout(() => {
          /* Trigger to model to show it */
          $("#btnAddAgreement").trigger("click");

          /* bind result to model */
          this.agreement = result;
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

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }
}
