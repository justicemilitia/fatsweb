import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { BaseComponent } from '../base/base.component';
import vDashboardFixedAssets from 'src/app/models/vDashboardFixedAssets';
import vGetDashboardTransactions from 'src/app/models/vGetDashboardTransactions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  assetValues: vDashboardFixedAssets = new vDashboardFixedAssets();

  transactions: vGetDashboardTransactions[] = [];

  constructor(public baseService: BaseService) {
    super(baseService);
  }

  ngOnInit() {
    this.loadValues();
    this.loadTransactions();
    setInterval(() => {
      this.loadValues();
      this.loadTransactions();
    }, 60 * 1000)
  }


  async loadValues() {
    this.baseService.dashboardService.GetDashboardFixedAssetsInfo((result) => {
      this.assetValues = <vDashboardFixedAssets>result;
    }, (result) => {
      console.log(result);
    })
  }

  async loadTransactions() {
    this.baseService.dashboardService.GetDashboardTransactionsInfo((result) => {
      this.transactions = <vGetDashboardTransactions[]>result;
    }, (result) => {
      console.log(result);
    })
  }
}
