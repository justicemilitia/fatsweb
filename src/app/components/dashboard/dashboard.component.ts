import { Component, OnInit, DoCheck } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { BaseComponent } from '../base/base.component';
import vDashboardFixedAssets from 'src/app/models/vDashboardFixedAssets';
import vGetDashboardTransactions from 'src/app/models/vGetDashboardTransactions';
import { Firm } from 'src/app/models/Firm';
import vGetDashboardPersonalInfo from 'src/app/models/GetDashboardPersonalInfo';
import { loadMorris } from 'src/assets/js/chart.morris.js';
import { loadPieChart } from 'src/assets/js/chart.flot.js';
import Morris, { ColorizeMorrisses } from 'src/app/models/MorrisModel';
import FlotPie from 'src/app/models/FlotPie';

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

  fixedAssetGroupTypes = {
    priceGroupType: 1,
    activeGroupType: 1,
    totalGroupType: 1
  }

  math = Math;

  countEnums = {
    Month: 1,
    Year: 0,
    Day: 2
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

  loadFixedAssetsByLocation() {

    this.baseService.dashboardService.GetFixedAssetCountByLocation((result: []) => {

      let ms: Morris[] = [];

      result.forEach((e: any) => {
        let m: Morris = new Morris();
        m.label = e.Name;
        m.value = e.TotalCount;
        ms.push(m);
      })

      ColorizeMorrisses(ms, false)

      loadMorris(ms, null);

    }, (result) => {
      // Error
    });

  }

  loadFixedAssetsByCategory() {

    this.baseService.dashboardService.GetFixedAssetCountByDepartment((result: []) => {

      let ms: Morris[] = [];

      result.forEach((e: any) => {
        let m: Morris = new Morris();
        m.label = e.Name;
        m.value = e.TotalCount;
        ms.push(m);
      });

      ColorizeMorrisses(ms, true)

      loadMorris(null,ms);

    }, (result) => {
      // Error
    });

  }

  loadFixedAssetsStatusCount() {

    this.baseService.dashboardService.GetFixedAssetsStatusCount((result: []) => {

      let fs: FlotPie[] = [];

      result.forEach((e: any) => {
        let f: FlotPie = new FlotPie();
        f.label = e.Name;
        f.data.push([0,e.TotalCount]);
        f.color = e.Color;
        fs.push(f);
      });

      loadPieChart(fs);

    }, (result) => {
      // Error
    });

  }

  loadAll() {
    this.loadValues();
    this.loadTransactions();
    this.loadPersonals();
    this.loadCounts(null, null, this.countEnums.Month);
    this.loadFixedAssetsByLocation();
    this.loadFixedAssetsByCategory();
    this.loadFixedAssetsStatusCount();
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

  async loadCounts(event, reportType: string, groupType: number) {
    if (reportType)
      this.fixedAssetGroupTypes[reportType] = groupType;

    this.baseService.dashboardService.GetDashboardFixedAssetsCount(this.fixedAssetGroupTypes, (result) => {
      Object.assign(this.countValues, result);
      if (event) {
        $('.bg-primary').removeClass('primary-active');
        $(event.target).addClass('primary-active');
        $(event.target).children(".bg-primary").addClass('primary-active');
      }
    }, (result) => {
      // Error
    });
  }

  bindCountsToFlowCharts() {

  }

}
