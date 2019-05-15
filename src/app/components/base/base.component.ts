import { Component, OnInit } from "@angular/core";
import { BaseService } from "../../services/base.service";
import * as pages from "../../declarations/page-values";
import { SystemLanguage } from 'src/app/models/SystemLanguage';
import * as XLSX from 'xlsx';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: "app-base",
  template: `
    <p>
      base works!
    </p>
  `,
  styleUrls: ["./base.component.css"]
})
export abstract class BaseComponent implements OnInit {

  protected readonly PAGES = pages;

  public Version: string = "6.0.100";

  public Languages: SystemLanguage[] = [{
    Culture: 'tr',
    ImageUrl: '../../../assets/img/tr.png',
    Name: 'Türkçe'
  }, {
    Culture: 'en',
    ImageUrl: '../../../assets/img/en.png',
    Name: 'English'
  }];

  public get Language() {
    return this.Languages.find(x => x.Culture == this.baseService.languageService.language);
  }

  public IsAuthForEdit: boolean = false;
  public IsAuthForDelete: boolean = false;
  public IsAuthForInsert: boolean = false;

  constructor(protected baseService: BaseService) {

    /* Okuma / Yazma / Silme Yetkisi açılan sayfa için burada kontrol edilecek. */
    if (this.baseService.router.routerState.root.firstChild != null) {
      let keyword = this.baseService.router.routerState.root.firstChild.snapshot.data["pageKeyword"];
      let menus = this.baseService.authenticationService.getRoleMenus();
      if (menus && menus.length > 0) {
        let pageItem = menus.find(x => x.MenuCaption == keyword);
        if (pageItem) {
          this.IsAuthForInsert = pageItem.OutInsert;
          this.IsAuthForEdit = pageItem.OutUpdate;
          this.IsAuthForDelete = pageItem.OutDelete;
        } else {
          this.IsAuthForDelete = false;
          this.IsAuthForInsert = false;
          this.IsAuthForEdit = false;
        }
      }
    }

  }

  ngOnInit() { }

  getLanguageValue(key: string) {
    return this.baseService.languageService.getValue(key);
  }

  changeLanguage(language: string) {
    this.baseService.languageService.setCulture(language);
  }

  isLogged() {
    return this.baseService.authenticationService.isLoggedIn();
  }

  isMenuAccessable(pageKeyword: string) {
    return this.baseService.authenticationService.isMenuAccessable(pageKeyword);
  }

  isTerminalOperator(pageKeyword:string){
    if(pageKeyword == 'cyclecountterminal')
      return false;
    return true;
  }

  changeFirm(firmId: number) {
    let firm = this.baseService.authenticationService.Firms.find(x => x.FirmId == Number(firmId));
    if (firm) {
      this.baseService.authenticationService.changeFirm(firmId,
        () => {

          $('.btn-refresh-custom').trigger('click');

        }, (error: HttpErrorResponse) => {

          /* if error show pop up */
          this.baseService.popupService.ShowErrorPopup(error);

        });
    }
  }

  pageRoute(key: string) {
    return this.baseService.authenticationService.pageRoute(key);
  }

  redirectTo(page: string) {
    this.baseService.router.navigateByUrl(page);
  }

  redirectToTerminal(page: string) {
    this.baseService.router.navigateByUrl(page);
    this.isTerminalOperator(page);
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  exportAsExcelFile(dt: TreeGridTable): void {

    /* Export values must be in an array */
    let data: any[] = [];

    let columns = dt.activeColumns;

    /* Load Column Display names */
    let cols: any[] = [];
    columns.forEach(e => {
      cols.push(e.columnDisplayName);
    })

    /* Push columns to data array */
    data.push(cols);

    /* Push values */
    dt.dataSource.forEach(e => {
      let items: any[] = [];
      columns.forEach(p => {

        if (p.type == "checkbox") {
          let value = dt.TGT_getDataValue(e, p);
          items.push(value == true ? "EVET" : "HAYIR");
        } else {
          items.push(dt.TGT_getDataValue(e, p));
        }
      })
      data.push(items);
    })

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    /* generate workbook and add th<e worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    let filename: string = "FATS_" + new Date().toLocaleString().replace('_', '').replace(', ', '_').replace(' ', '_');

    XLSX.writeFile(wb, filename + '.xlsx');
  }


}
