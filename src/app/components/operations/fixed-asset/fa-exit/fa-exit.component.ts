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

  otherCheckReasonType:boolean=false;

  requiredDescription:boolean=false;

  fixedAssetPrice:boolean = false;

  constructor(baseService: BaseService) {
    super(baseService);
    this.LoadDropdownList();
  }

  ngOnInit() {}

  onSubmit(data: NgForm) {
    if (data.form.invalid == true) return;

    if(this.fixedAssetPrice == true) return;
   

    // this.popupComponent.ShowModal('#modalShowDeletePopupForFaExit');    
    
    // this.popupComponent.CloseModal('#modalExitFixedAsset');    
    
  }

  async exitFixedAsset(data:NgForm) {
    /* Is Form Valid */

    // await this.baseService.popupService.ShowQuestionPopupForDeleteWithoutUndo(
    //  (response: boolean) => {
        // if (response == true) {
          this.baseService.spinner.show();

          
          this.transactionLog.FixedAssetIds = [];

          this.transactionLog.FixedAssetIds = (<FixedAsset[]>(
            this.faDataTable.TGT_getSelectedItems()
          )).map(x => x.FixedAssetId);


          this.baseService.fixedAssetService.ExitFixedAsset(
            this.transactionLog,
            (formList: any[], message) => {
              /* Show success pop up */

              this.baseService.popupService.ShowSuccessPopup(message);

              this.baseService.spinner.hide();

              if(this.IsCreateExitForm==true){
                for(let i=0;i<formList.length;i++){
                  this.PressExitForm(formList[i].FixedAssetFormCode);
                }
              }
              
              /* Push inserted item to Property list */

              this.transactionLogs.push(this.transactionLog);

              this.faComponent.loadFixedAsset();  

             $("#CloseModal").trigger("click");

              this.resetForm(data,true);
            
            },
            (error: HttpErrorResponse) => {
              /* Show alert message */
              this.baseService.popupService.ShowErrorPopup(error);

              this.baseService.spinner.hide();
            }
          );
         
          this.popupComponent.CloseModal("#modalShowDeletePopupForFaExit");
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
    this.requiredDescription=false;

    this.otherCheckReasonType=true;

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

  checkCheckOutPrice(event:any){
   let price:string = (event.target.value);

   if(price == "")
   this.fixedAssetPrice = false;
   else
   this.fixedAssetPrice = true;
  }

  selectCurrency(event:any){
    if(event.target.value != null && event.target.selectedIndex != 0){
      this.fixedAssetPrice =false;
    }
    else
    this.fixedAssetPrice =true;
  }

  closeFaExit(){
    this.popupComponent.CloseModal("#modalShowDeletePopupForFaExit");

    this.otherCheckReasonType=true;
  }

  otherExitType(event:any){
    if(this.transactionLog.CheckOutReasonId == 31)
    this.otherCheckReasonType = true;
    else {
      this.otherCheckReasonType = false;

      this.requiredDescription = false;  
    }    
  }

  exitFixedAssetModal(data:NgForm){

    if(this.otherCheckReasonType == false)
      this.popupComponent.ShowModal('#modalShowDeletePopupForFaExit');
    else{
      let description:string= this.transactionLog.CheckOutDescription;
      console.log(description);
        if(description === undefined || description == '' || description == null){    

          this.requiredDescription = true;

          return;   
          }
          else{
            this.popupComponent.ShowModal('#modalShowDeletePopupForFaExit');
            this.requiredDescription = false;
            this.otherCheckReasonType = false;           
          }
    } 
  }

}
