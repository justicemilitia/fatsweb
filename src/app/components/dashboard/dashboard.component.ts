import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { BaseComponent } from '../base/base.component';
import vDashboardFixedAssets from 'src/app/models/vDashboardFixedAssets';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  assetValues:vDashboardFixedAssets = new vDashboardFixedAssets();

  constructor(public baseService:BaseService) { 
    super(baseService);    
  }

  ngOnInit() {
    setInterval(() => {
      this.loadValues();
    },60 * 1000)
  }


  loadValues() {
    this.baseService.dashboardService.GetDashboardValues((result) => {
      this.assetValues = <vDashboardFixedAssets>result;
    },(result) => {
      console.log(result);
    })
  }

}
