import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import {
  HttpErrorResponse,
  HttpClient
} from "@angular/common/http";
import { Agreement } from "../../../models/Agreement";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import { Company } from "../../../models/Company";
import { convertDateToNgbDate, convertNgbDateToDateString } from 'src/app/declarations/extends';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';
import { PopupComponent } from '../../popup/popup.component';
import { CDK_DESCRIBEDBY_HOST_ATTRIBUTE } from '@angular/cdk/a11y';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, ResponseContentType, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { saveAs } from "file-saver";
import { MIME_TYPES, IMAGE_URL, SERVICE_URL } from '../../../declarations/service-values';

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

  @Input() response: boolean;  
  popupComp: PopupComponent = new PopupComponent(this.baseService);

  /* Is Request send and waiting for response ? */
  isWaitingInsertOrUpdate: boolean = false;
  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;

  /* Is Table Exporting */
  isTableExporting: boolean = false;

  selectedFile: any;

  /* List of agreements */
  agreements: Agreement[] = [];

  /* Current agreement */
  agreement: Agreement = new Agreement();

  /* List of companies */
  companies: Company[] = [];

  agreementFiles: any[] = [];

  minDate:NgbDate;

  updatedAgreement: NgForm = null;

  notDeletedCode: string = '';

  selectedItems:any[]=[];
  
  agreementFileName: string = '';
  filename: string = '';
  fileURL;
  public dataTable: TreeGridTable = new TreeGridTable(
    "agreement",
    [
      {
        columnDisplayName: this.getLanguageValue('Agreement_Name'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Agreement_Code'),
        columnName: ["AgreementCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Agreement_No'),
        columnName: ["No"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Related_Company'),
        columnName: ["Company", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Start_Date'),
        columnName: ["StartDate"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          return value.StartDate ? value.StartDate.substring(0, 10).split("-").reverse().join("-") : "";
        }
      },
      {
        columnDisplayName: this.getLanguageValue('End_Date'),
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
        columnDisplayName: this.getLanguageValue('Agreement_Price'),
        columnName: ["Price"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('File'),
        columnName: ["AgreementFile"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Description'),
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

  constructor(public baseService: BaseService, private http: Http, private sanitizer: DomSanitizer) {
    super(baseService);
    this.loadAgreements();
    this.loadCompanies();

    // this.downloadFile();
  }

  ngOnInit() { }

  resetForm(data: NgForm, isNewItem: boolean) {
    if (isNewItem == true) {
      this.agreement = new Agreement();
      this.clearFiles();
    }
    data.reset();
    data.resetForm(this.agreement);

  }

  onSubmit(data: NgForm) {

    if (data.form.invalid == true) return;

    if (data.value.Price) {
      if (!this.isNumeric(data.value.Price)) {
        return;
      }
    }
    /* if agreement id exists means update it otherwise insert it */
    if (this.agreement.AgreementId == null) {
      this.addAgreements(data);
    }
     else {
      this.popupComponent.ShowModal('#modalShowQuestionPopupForAgreement');
      this.popupComponent.CloseModal('#modalAgreement');
      
      // Object.assign(this.updatedAgreement, data);
      // this.updateAgreement(data);
    }

  }

  onDelete(){
    
    /* get selected items from table */
    this.selectedItems = this.dataTable.TGT_getSelectedItems();
   
    /* if count of items equals 0 show message for no selected item */
    if (!this.selectedItems || this.selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir sözleşme seçiniz"
      );
      return;
    }
   else
   this.popupComponent.ShowModal('#modalShowDeletePopupForAgreement');
   
 }
  
  async deleteAgreements() {

    /* get selected items from table */
    let selectedItems = this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!selectedItems || selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "{{getLanguageValue('Choose_at_least_one_agreement')}}"
      );
      return;
    }

    /* Show Question Message */
    // this.baseService.popupService.ShowQuestionPopupForDelete(() => {
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

        /* if all of them removed */
        if (itemIds.length == 1)
          this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('Delete_operation_successful'));
        else
          this.baseService.popupService.ShowSuccessPopup(this.getLanguageValue('All_records_deleted'));

        /* Clear ids from source */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Get current table source */
        this.agreements = <Agreement[]>this.dataTable.TGT_copySource();
        },
        (itemIds:NotDeletedItem[],error: HttpErrorResponse) => {
          
          let barcode:Agreement;

          let notDeletedCodes : string[]=[];

          let agreements = <Agreement[]>this.dataTable.TGT_copySource();
          
          /* Hide Loading Spinner */
          this.baseService.spinner.hide();

          itemIds.forEach((e:NotDeletedItem) => {
            for(let i=0; i<itemIds.length; i++){
          barcode = agreements.find(x=>x.AgreementId == e[i].Id);
          }     
          notDeletedCodes.push(barcode.AgreementCode);
          });
  
            /* Show error message */
            if(itemIds.length>0)
            {
              // this.baseService.popupService.ShowDeletePopup(error,notDeletedCodes);
              notDeletedCodes.forEach((e, i) => {
                this.notDeletedCode +=
                  e + (i == selectedItems.length - 1 ? "" : ", ");
              });

              this.popupComponent.ShowModal('#modalShowErrorPopup');
            }                      
            else
            this.baseService.popupService.ShowErrorPopup(error);
  
        });
      this.popupComponent.CloseModal('#modalShowDeletePopupForAgreement');
    // });
  }

  async addAgreements(data: NgForm) {

    /* Activate the loading spinner */
    this.baseService.spinner.show();
    
    let willInsertItem = new Agreement();

    Object.assign(willInsertItem, this.agreement);

    /* Insert agreement service */
    willInsertItem.CompanyId = willInsertItem.CompanyId ? Number(willInsertItem.CompanyId) : null;
    willInsertItem.Price = this.agreement.Price ? Number(willInsertItem.Price) : null;
    willInsertItem.StartDate = convertNgbDateToDateString(willInsertItem.StartDate);
    willInsertItem.EndDate = convertNgbDateToDateString(willInsertItem.EndDate);
    willInsertItem.Company = this.companies.find(x => x.CompanyId == willInsertItem.CompanyId);

    if (this.agreementFiles && this.agreementFiles.length > 0) {
      willInsertItem.AgreementFile = this.agreementFiles[0].name;
    }

    this.isWaitingInsertOrUpdate = true;
    
    this.baseService.agreementService.InsertAgreement(willInsertItem, this.agreementFiles,
      (insertedItem: Agreement, message) => {

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        this.isWaitingInsertOrUpdate = false;

        /* Show pop up, get inserted agreement then set it agreement id, then load data. */
        this.baseService.popupService.ShowSuccessPopup(message);

        willInsertItem.AgreementId = insertedItem.AgreementId;

        this.agreements.push(willInsertItem);

        this.dataTable.TGT_loadData(this.agreements);

        /* Reset Forms and make company empty to use new */
        this.resetForm(data, true);

      }, (error: HttpErrorResponse) => {

        /* Deactive the spinner */
        this.baseService.spinner.hide();

        this.isWaitingInsertOrUpdate = false;

        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }

  async updateAgreement(data: NgForm) {

     /* Activate the loading spinner */
     this.baseService.spinner.show();

    /* Convert object to new object */
    let willUpdateItem = new Agreement();
    
    Object.assign(willUpdateItem, this.agreement);

    /* Update agreement values with valid values */
    willUpdateItem.CompanyId = willUpdateItem.CompanyId ? Number(willUpdateItem.CompanyId) : null;
    willUpdateItem.Price = this.agreement.Price ? Number(willUpdateItem.Price) : null;
    willUpdateItem.StartDate = convertNgbDateToDateString(willUpdateItem.StartDate);
    willUpdateItem.EndDate = convertNgbDateToDateString(willUpdateItem.EndDate);
    willUpdateItem.Company = this.companies.find(x => x.CompanyId == willUpdateItem.CompanyId);

    if (this.agreementFiles && this.agreementFiles.length > 0) {
      willUpdateItem.AgreementFile = this.agreementFiles[0].name;
    }
    
          this.isWaitingInsertOrUpdate = true;

          this.baseService.agreementService.UpdateAgreement(
            willUpdateItem, this.agreementFiles,
            (_agreement, message) => {
              
              /* Deactive the spinner */
              this.baseService.spinner.hide();
              
              this.isWaitingInsertOrUpdate = false;

              /* Show pop up then update data in datatable */
              this.baseService.popupService.ShowSuccessPopup(message);

              this.dataTable.TGT_updateData(willUpdateItem);

              /* Get original source from table */
              this.agreements = <Agreement[]>this.dataTable.TGT_copySource();

            },
            (error: HttpErrorResponse) => {
              // /* Deactive the spinner */
              // this.baseService.spinner.hide();

              this.isWaitingInsertOrUpdate = false;
              /* Show error message */
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
          this.popupComponent.CloseModal('#modalShowQuestionPopupForAgreement');

  }


  async loadAgreements() {
    /* Load all agreements to datatable */
    this.baseService.agreementService.GetAgreement(
      (agreements: Agreement[]) => {
        this.agreements = agreements;
        this.dataTable.TGT_loadData(this.agreements);
        if(agreements.length==0){
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
        }
      },
      (error: HttpErrorResponse) => {
        /* if error show pop up */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadCompanies() {
    this.baseService.companyService.GetCompanies(
      (companies: Company[]) => {
        this.companies = companies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadAgreementById(event: any) {
    if (event.target.value.toString().trim() !== "") {
      this.baseService.agreementService.GetAgreementById(
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

    /* Clear Model */
    this.agreement = new Agreement();

    /* Show spinner for loading */
    this.baseService.spinner.show();

    /* load companies if not loaded */
    this.loadCompanies();

    /* get agreement information from server */
    this.baseService.agreementService.GetAgreementById(
      item.AgreementId,
      (result: Agreement) => {
        /* then bind it to agreement model to update */
        setTimeout(() => {
          /* Trigger to model to show it */
          $("#btnAddAgreement").trigger("click");

          this.baseService.spinner.hide();

          /* bind result to model */
          this.agreement = result;

          this.agreement.StartDate = convertDateToNgbDate(this.agreement.StartDate);

          this.agreement.EndDate = convertDateToNgbDate(this.agreement.EndDate);          

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

  clearFiles() {
    this.agreementFiles = [];

    this.agreement.AgreementFile = null;
  }

  changeFile(event) {
    this.agreementFiles = event.target.files;
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();

    await this.loadAgreements();

    this.isTableRefreshing = false;

  }

downloadFiles(){
  let selectedItems = <Agreement[]>this.dataTable.TGT_getSelectedItems();

  if (!selectedItems || selectedItems.length == 0) {
    this.baseService.popupService.ShowAlertPopup(
      this.getLanguageValue("Please_choose_at_least_one_record")
    );
    return;
  }
  

  selectedItems.forEach((e,i) => {
    this.filename = selectedItems[i] == null ? null : (<Agreement>selectedItems[i]).AgreementFile;  
    if(this.filename != ''){
      this.downloadFile(this.filename);      
    }
    this.filename='';
  });
}

downloadFile(fileName: string){ 

 
  //file type extension
  let checkFileType =  this.filename.split('.').pop();
  var fileType;
  switch(checkFileType){
    case 'txt':
    fileType = "text/plain";    
    break;
    case 'pdf':
    fileType = "application/pdf";    
    break;
    case 'doc':
    fileType = "application/vnd.ms-word";    
    break;
    case 'docx':
    fileType = "application/vnd.ms-word";    
    break;
    case 'xls':
    fileType = "application/vnd.ms-excel";    
    break;
    case 'xlsx':
    fileType = "application/vnd.ms-excel";    
    break;
    case 'png':
    fileType = "image/png";    
    break;
    case 'jpg':
    fileType = "image/jpeg";    
    break;
    case 'jpeg':
    fileType = "image/jpeg";    
    break;
    case 'gif':
    fileType = "image/gif";    
    break;
    case 'csv':
    fileType = "text/csv";    
    break;
   }
  
  this.baseService.fileUploadService.DownloadFile(fileName, fileType)
  .subscribe(
            success => {
              saveAs(success, fileName); 
            },
            (error: HttpErrorResponse) => {
              /* show error pop up */
              this.baseService.popupService.ShowErrorPopup(error);
            }
        );
}
}
