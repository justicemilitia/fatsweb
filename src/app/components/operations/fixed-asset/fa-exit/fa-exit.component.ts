import { Component, OnInit, NgModule } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAssetCardProperty } from "../../../../models/FixedAssetCardProperty";
import { HttpErrorResponse } from "@angular/common/http";
import * as $ from "jquery";
import { TransactionLog } from '../../../../models/TransactionLog';
import { Currency } from '../../../../models/Currency';

@Component({
  selector: 'app-fa-exit',
  templateUrl: './fa-exit.component.html',
  styleUrls: ['./fa-exit.component.css']
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
    currencies: Currency;

  constructor(baseService: BaseService) {
    super(baseService);
  }

  ngOnInit() {
  }

  onSubmit(data: NgForm) {
      this.exitFixedAsset(data);
  }

  async exitFixedAsset(data: NgForm){
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    await this.baseService.fixedAssetService.ExitFixedAsset(
      this.transactionLog,
      (insertedItem: TransactionLog, message) => {

        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Set inserted Item id to model */
        this.transactionLog.TransactionLogId =
          insertedItem.TransactionLogId;

        /* Push inserted item to Property list */
        this.transactionLogs.push(this.transactionLog);

      },
      (error: HttpErrorResponse) => {

        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async GetCurrencyList(){
       /* Load currencies to currencies dropdown */
       await this.baseService.currencyService.GetCurrencies(currencies => {
        this.currencies = currencies
      }, (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      });
  }
}
