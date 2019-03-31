import { Component, OnInit, DoCheck } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { BaseComponent } from '../base/base.component';
import vDashboardFixedAssets from 'src/app/models/vDashboardFixedAssets';
import vGetDashboardTransactions from 'src/app/models/vGetDashboardTransactions';
import { Firm } from 'src/app/models/Firm';
import vGetDashboardPersonalInfo from 'src/app/models/GetDashboardPersonalInfo';
import { vGetDashboardFixedAssetCounts } from 'src/app/models/vGetDashboardFixedAssetCounts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit, DoCheck {

  prevStateOfFirm: Firm = null;

  assetValues: vDashboardFixedAssets = new vDashboardFixedAssets();

  transactions: vGetDashboardTransactions[] = [];

  personalValues: vGetDashboardPersonalInfo = new vGetDashboardPersonalInfo();

  countValues: any = {};

  math = Math;

  countEnums = {
    Month: 1,
    Year: 0

  }

  constructor(public baseService: BaseService) {
    super(baseService);
  }

  ngOnInit() {
    this.prevStateOfFirm = this.baseService.authenticationService.currentFirm;

    this.loadAll();

    setInterval(() => {
      this.loadAll();
    }, 60 * 1000);
  }

  ngDoCheck(): void {
    if (this.prevStateOfFirm != this.baseService.authenticationService.currentFirm) {
      this.loadAll();
      this.prevStateOfFirm = this.baseService.authenticationService.currentFirm;
    }
  }


  loadAll() {
    this.loadValues();
    this.loadTransactions();
    this.loadPersonals();
    this.loadCounts();
  }

  async loadValues() {
    this.baseService.dashboardService.GetDashboardFixedAssetsInfo((result) => {
      this.assetValues = (<vDashboardFixedAssets>result);
    }, (result) => {
      // Error
    })
  }

  async loadTransactions() {
    this.baseService.dashboardService.GetDashboardTransactionsInfo((result) => {
      this.transactions = <vGetDashboardTransactions[]>result;
    }, (result) => {
      // Error
    })
  }

  async loadPersonals() {
    this.baseService.dashboardService.GetDashboardPersonalsInfo((result) => {
      Object.assign(this.personalValues, result);
    }, (result) => {
      // Error
    });
  }

  async loadCounts() {
    this.baseService.dashboardService.GetDashboardFixedAssetsCount(this.countEnums.Month, (result) => {
      Object.assign(this.countValues, result);
    }, (result) => {
      // Error
    });
  }

  bindCountsToFlowCharts() {
    
  }

}
