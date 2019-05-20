import { Component, OnInit, DoCheck } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { BaseComponent } from '../base/base.component';
import vDashboardFixedAssets from 'src/app/models/vDashboardFixedAssets';
import vGetDashboardTransactions from 'src/app/models/vGetDashboardTransactions';
import { Firm } from 'src/app/models/Firm';
import vGetDashboardPersonalInfo from 'src/app/models/GetDashboardPersonalInfo';
import { loadMorris, loadFlotLine } from 'src/assets/js/chart.morris.js';
import { loadPieChart } from 'src/assets/js/chart.flot.js';
import Morris, { ColorizeMorrisses } from 'src/app/models/MorrisModel';
import FlotPie from 'src/app/models/FlotPie';
import { GetTransactionIcon } from 'src/app/declarations/transaction-icons';
import { GetDayOfWeekFromDayOfYear, GetMonthOfYearsLong } from 'src/app/declarations/date-values';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { convertNgbDateToDateString, convertDateToNgbDate, getToday } from "../../declarations/extends";
import { FixedAsset } from '../../models/FixedAsset';
import { FixedAssetComponent } from '../operations/fixed-asset/fixed-asset.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Page } from '../../extends/TreeGridTable/models/Page';

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
  
  fixedAssets: FixedAsset[] = [];
  faComponent: FixedAssetComponent;
  currentPage: number = 1;
  perInPage: number = 25;
  totalPage: number = 1;
  pages: Page[] = [];

  totalPrices: any[] = [];
  totalPricesActiveGroup = 2;

  fixedAssetGroupTypes = {
    priceGroupType: 1,
    activeGroupType: 1,
    totalGroupType: 1
  }

  math = Math;
  transactionIcons = GetTransactionIcon;

  countEnums = {
    Month: 1,
    Year: 0,
    Day: 2,
    Week: 3
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

  async loadFixedAssetsByLocation() {

    this.baseService.dashboardService.GetFixedAssetCountByLocation((result: []) => {

      let ms: Morris[] = [];

      result.forEach((e: any) => {
        let m: Morris = new Morris();
        m.label = e.Name;
        m.value = e.TotalCount;
        ms.push(m);
      })

      ColorizeMorrisses(ms, false)

      loadMorris(ms, null, null);

    }, (result) => {
      // Error
    });

  }

  async loadFixedAssetsByDepartment() {

    this.baseService.dashboardService.GetFixedAssetCountByDepartment((result: []) => {

      let ms: Morris[] = [];

      result.forEach((e: any) => {
        let m: Morris = new Morris();
        m.label = e.Name;
        m.value = e.TotalCount;
        ms.push(m);
      });

      ColorizeMorrisses(ms, true)

      loadMorris(null, ms, null);

    }, (result) => {
      // Error
    });

  }


  async loadFixedAssetsByCategory() {

    this.baseService.dashboardService.GetFixedAssetCountByCategory((result: []) => {

      let ms: Morris[] = [];

      result.forEach((e: any) => {
        let m: Morris = new Morris();
        m.label = e.Name;
        m.value = e.TotalCount;
        ms.push(m);
      });

      ColorizeMorrisses(ms, true)

      loadMorris(null, null, ms);

    }, (result) => {
      // Error
    });

  }

  async loadFixedAssetsStatusCount() {

    this.baseService.dashboardService.GetFixedAssetsStatusCount((result: []) => {

      let fs: FlotPie[] = [];

      result.forEach((e: any) => {
        let f: FlotPie = new FlotPie();
        f.label = e.Name;
        f.data.push([0, e.TotalCount]);
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
    this.loadFixedAssetsByDepartment();
    this.loadFixedAssetsByCategory();
    this.loadFixedAssetsStatusCount();
    this.loadFixedAssetPriceLine(null, this.totalPricesActiveGroup);
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

  loadCounts(event, reportType: string, groupType: number) {
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

  async loadFixedAssetPriceLine(event, groupType: number) {

    this.baseService.dashboardService.GetDashboardFixedAssetPriceCountLine(groupType, 10, (result) => {
      if (event != null) {
        $('.card-title-categories').children().removeClass('current');
        $(event.target).addClass('current');
      }

      this.totalPricesActiveGroup = groupType;
      this.totalPrices = [];
      Object.assign(this.totalPrices, result);
      let multiDimention = [];

      /* Values */
      this.totalPrices.forEach(e => {
        multiDimention.push([e.Dates, e.TotalOfItems]);
      });

      let xValues = [];
      /* x axis Values */
      if (groupType == this.countEnums.Week) {
        this.totalPrices.forEach((e, i) => {
          xValues.push([e.Dates, e.Dates.toString() + "hafta"]);
        });
      } else if (groupType == this.countEnums.Day) {
        let today = (new Date()).getDay();
        this.totalPrices.forEach((e, i) => {
          xValues.push([e.Dates, GetDayOfWeekFromDayOfYear(today - (this.totalPrices.length - 1 - i), 'tr')]);
        });
      } else if (groupType == this.countEnums.Month) {
        let currentMonth = (new Date()).getMonth();
        this.totalPrices.forEach((e, i) => {
          xValues.push([e.Dates, GetMonthOfYearsLong('tr')[currentMonth - (this.totalPrices.length - 1 - i)]]);
        });
      }

      this.totalPrices.sort((a, b) => { return a.TotalOfItems - b.TotalOfItems });

      let yValues = [];
      yValues.push([0, 'TL']);
      /* Y axis Values */
      if (this.totalPrices.length > 0) {
        let highest = this.totalPrices[this.totalPrices.length - 1].TotalOfItems;
        yValues.push([Math.floor(highest / 2), Math.floor(highest / 2).toLocaleString().toString() + " TL"]);
        yValues.push([Math.floor(highest / 4), Math.floor(highest / 4).toLocaleString().toString() + " TL"]);
        yValues.push([Math.floor(highest), Math.floor(highest).toLocaleString().toString() + " TL"]);
      }

      this.totalPrices.sort((a, b) => { return a.Dates - b.Dates });

      loadFlotLine(multiDimention, yValues, xValues)
    }, (result) => {
      // Error
    });
  }

  // onClickGuaranteeFixedAsset(){
  //     /* Load all fixed asset cards to datatable */
  //      this.baseService.fixedAssetService.GetGuaranteeFixedAssetList(
  //       (fa: FixedAsset[]) => {
  //         this.fixedAssets = fa;
  //         fa.forEach((element: FixedAsset) => {
  //         });
  //         this.faComponent.dataTable.TGT_loadData(this.fixedAssets);
  //       },
  //       (error: HttpErrorResponse) => {
  //         this.baseService.popupService.ShowErrorPopup(error);
  //       }
  //     );
  // }

  onClickGuaranteeFixedAsset() {

    this.faComponent.dataTable.TGT_clearData();
    this.faComponent.dataTable.isLoading = true;

    this.baseService.fixedAssetService.GetGuaranteeFixedAssetList(
      (fa: FixedAsset[], message: string) => {
        this.fixedAssets = fa;

        fa.forEach(e => {
          e.FixedAssetPropertyDetails.forEach(p => {
            if (p.FixedAssetCardPropertyId) {
              e["PROP_" + p.FixedAssetCardPropertyId.toString()] = p.Value;
            }
          });
        });
        this.faComponent.dataTable.TGT_loadData(this.fixedAssets);
        this.faComponent.TGT_calculatePages();
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

}
