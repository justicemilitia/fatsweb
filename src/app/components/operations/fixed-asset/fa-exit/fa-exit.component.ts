import {
  Component,
  OnInit,
  NgModule,
  Input,
  AfterViewInit
} from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAssetCardProperty } from "../../../../models/FixedAssetCardProperty";
import { HttpErrorResponse } from "@angular/common/http";
import * as $ from "jquery";
import { TransactionLog } from "../../../../models/TransactionLog";
import { Currency } from "../../../../models/Currency";
import { CheckOutReason } from "../../../../models/CheckOutReason";
import { FixedAssetComponent } from "../fixed-asset.component";
import { TreeGridTable } from "../../../../extends/TreeGridTable/modules/TreeGridTable";
import { FixedAsset } from "../../../../models/FixedAsset";
import { DOCUMENT_URL } from '../../../../declarations/service-values';

@Component({
  selector: "app-fa-exit",
  templateUrl: "./fa-exit.component.html",
  styleUrls: ["./fa-exit.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaExitComponent],
  providers: [FaExitComponent]
})
export class FaExitComponent extends BaseComponent implements OnInit {
  /* Current Fixed Asset Card Property */
  transactionLog: TransactionLog = new TransactionLog();
  transactionLogs: TransactionLog[] = [];
  currencies: Currency[] = [];
  locations: Location[] = [];
  checkedOutReasons: CheckOutReason[] = [];
  faExitIds: number[] = [];
  fixedAsset: FixedAsset = new FixedAsset();
  @Input() faDataTable: TreeGridTable;
  @Input() faBarcode: string;
  @Input() faComponent: FixedAssetComponent;
  IsCreateExitForm: boolean = false;

  constructor(baseService: BaseService) {
    super(baseService);
    this.LoadDropdownList();
  }

  ngOnInit() {}

  onSubmit(data: NgForm) {
    if (data.form.invalid == true) return;
    this.popupComponent.ShowModal('#modalShowDeletePopupForFaExit');    
    // this.exitFixedAsset(data);
    this.popupComponent.CloseModal('#modalExitFixedAsset');    
    
  }

  async exitFixedAsset(data:NgForm) {
    /* Is Form Valid */

    // await this.baseService.popupService.ShowQuestionPopupForDeleteWithoutUndo(
    //  (response: boolean) => {
        // if (response == true) {
          this.transactionLog.FixedAssetIds = [];

          this.transactionLog.FixedAssetIds = (<FixedAsset[]>(
            this.faDataTable.TGT_getSelectedItems()
          )).map(x => x.FixedAssetId);

          this.baseService.fixedAssetService.ExitFixedAsset(
            this.transactionLog,
            (formList: any[], message) => {
              /* Show success pop up */

              this.baseService.popupService.ShowSuccessPopup(message);

              if(this.IsCreateExitForm==true){
                for(let i=0;i<formList.length;i++){
                  this.PressExitForm(formList[i].FixedAssetFormCode);
                }
              }
              
              /* Push inserted item to Property list */
              this.transactionLogs.push(this.transactionLog);

              this.faComponent.loadFixedAsset();  

              $("#CloseModalExit").trigger("click");

              this.resetForm(data,true);
            
            },
            (error: HttpErrorResponse) => {
              /* Show alert message */
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
         

        // }
    //   }
    // );
  }

  async LoadDropdownList() {
    /* Load currencies to currencies dropdown */
    await this.baseService.currencyService.GetCurrencies(
      currencies => {
        this.currencies = currencies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    /* Load location to locations dropdown */
    await this.baseService.locationService.GetLocations(
      locations => {
        this.locations = locations;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    /* Load checked out reasons to checked out reason dropdown */
    await this.baseService.checkOutReasonService.GetCheckOutReason(
      checkedOutReasons => {
        this.checkedOutReasons = checkedOutReasons;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  resetForm(data: NgForm, isNewItem: boolean) {
    if (isNewItem == true) {
      this.transactionLog = new TransactionLog();
    }
    data.reset();
    data.resetForm(this.transactionLog);
  }

  isCreateExitForm(event){
    if(event.target.checked == true){
      this.IsCreateExitForm = true;
    }
    else {
      this.IsCreateExitForm = false;
    }
  }

  PressExitForm(formName: string){
    let url:string;
    url=DOCUMENT_URL + formName + ".pdf";
    // this.router.navigate([url]); 
    window.open(url,"_blank");    
  }
}
