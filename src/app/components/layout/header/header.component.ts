import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { BaseComponent } from '../../base/base.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent implements OnInit, AfterViewInit {

  applicationInfo: any;

  drawnContentForApplicationInfo: string = "";

  ngAfterViewInit(): void {
    $(".az-navbar-two").trigger("click");
    this.loadFirms();
    this.loadSystemInformations();
  }

  loadSystemInformations() {
    this.applicationInfo = {
      Application: {
        ApplicationName: 'Fats',
        ApplicationVersion: this.Version,
        ApplicationCompany: 'Trinoks',
        ApplicationContact: 'destek@trinoks.com'
      },
      License: {
        LicenseCompanyName: 'A',
        LicenseCompanyCount: 1,
        LicenseCompanyUserCount: 3,
        LicenseServerName: 'Test',
        LicenseDatabaseName: 'FATSWEB_6.0',
        LicenseDatabaseVersion: this.Version
      }
    }

    setTimeout(() => {
      this.drawnContentForApplicationInfo = this.drawInfo();
    },500);

  }

  drawInfo() {

    if (!this.applicationInfo)
      return "";

    return "<fieldset class='popover-info-category'>" +
      "<legend class='popover-info-category-title'> Hakkında </legend>" +
      "<p class='popover-info'><label class='popover-info-title'>Uygulama Adı</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.Application.ApplicationName + "</label></p>" +
      "<p class='popover-info'><label class='popover-info-title'>Versiyon</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.Application.ApplicationVersion + "</label></p>" +
      "<p class='popover-info'><label class='popover-info-title'>Üretici Firma</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.Application.ApplicationCompany + "</label></p>" +
      "<p class='popover-info'><label class='popover-info-title'>İletişim</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.Application.ApplicationContact + "</label></p>" +
      "</fieldset>" +
      "<fieldset class='popover-info-category'>" +
      "<legend class='popover-info-category-title'>Lisans</legend>" +
      "<p class='popover-info'><label class='popover-info-title'>Şirket Adı</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.License.LicenseCompanyName + "</label></p>" +
      "<p class='popover-info'><label class='popover-info-title'>İşletme Lisans Sayısı</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.License.LicenseCompanyCount + "</label></p>" +
      "<p class='popover-info'><label class='popover-info-title'>İşletme Kullanıcı Sayısı</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.License.LicenseCompanyUserCount + "</label></p>" +
      "<p class='popover-info'><label class='popover-info-title'>Sunucu Adı</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.License.LicenseServerName + "</label></p>" +
      "<p class='popover-info'><label class='popover-info-title'>Sunucu Adı</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.License.LicenseDatabaseName + "</label></p>" +
      "<p class='popover-info'><label class='popover-info-title'>Veritabanı Adı</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.License.LicenseDatabaseVersion + "</label></p>" +
      "</fieldset>";
  }

  loadFirms() {
    this.baseService.authenticationService.getUserFirmListWithoutParams();
  }

  constructor(public baseService: BaseService) {
    super(baseService);

  }

  ngOnInit() {
  }

  logout() {
    this.baseService.authenticationService.logOut();
    this.baseService.router.navigateByUrl("/login");
  }

  userSettings() {
    this.baseService.router.navigateByUrl("/usersettings");
  }

}
