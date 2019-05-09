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

  searchDescription = '';

  ngAfterViewInit(): void {
    $(".az-navbar-two").trigger("click");
    this.loadFirms();
    this.loadSystemInformations();
  }

  loadSystemInformations() {
    this.applicationInfo = {
      Application: {
        ApplicationName: 'Fats Demirbaş Yönetim Sistemi',
        ApplicationVersion: this.Version,
        ApplicationCompany: 'Trinoks Yazılım A.Ş.',
        ApplicationContact: 'mailto:destek@trinoks.com',
        ApplicationContactName: 'destek@trinoks.com',
        ApplicationPhone:'0216 417 71 82'
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
    }, 500);

  }


  drawInfo() {

    if (!this.applicationInfo)
      return "";

    return "<fieldset class='popover-info-category'>" +
      "<legend class='popover-info-category-title'> Hakkında </legend>" +
      "<p class='popover-info'><label class='popover-info-content' style='margin-left: 0px'>"+ this.applicationInfo.Application.ApplicationCompany + "<sup class='trade' style='font-size: 12px;'>" + "©" + "</sup>" +"</label></p>" +
      "<p class='popover-info'><label class='popover-info-title'>Uygulama Adı</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.Application.ApplicationName + "</label></p>" +
      "<p class='popover-info'><label class='popover-info-title'>Versiyon</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.Application.ApplicationVersion + "</label></p>" +   
      "<p class='popover-info'><label class='popover-info-title'>İletişim</label>" +
      "<label class='popover-info-content'>" + "<a href = " + this.applicationInfo.Application.ApplicationContact + ">"+this.applicationInfo.Application.ApplicationContactName+"</a>" + "</label></p>" +
      "<p class='popover-info'><label class='popover-info-title'>Telefon</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.Application.ApplicationPhone+ "</label></p>" +
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
      "<p class='popover-info'><label class='popover-info-title'>Veritabanı Adı</label>" +
      "<label class='popover-info-content'>" + this.applicationInfo.License.LicenseDatabaseName + "</label></p>" +
      "</fieldset>";
  }

  loadFirms() {
    this.baseService.authenticationService.getUserFirmListWithoutParams();
  }

  // Execute a function when the user releases a key on the keyboard
  onDescriptionKeyUp(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      this.baseService.router.navigate(['/fixedasset'], {
        queryParams: {
          search: this.searchDescription
        }
      });
    }
  };

  onClickSearch() {
    this.baseService.router.navigate(['/fixedasset'], {
      queryParams: {
        search: this.searchDescription
      }
    });
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
