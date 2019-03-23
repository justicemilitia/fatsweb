import { Component, OnInit } from "@angular/core";
import { BaseService } from "../../services/base.service";
import * as pages from "../../declarations/page-values";
import { SystemLanguage } from 'src/app/models/SystemLanguage';
import * as XLSX from 'xlsx';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';

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

  public Firms = [{
    Name: 'Trinoks',
    Id: 1
  }, {
    Name: 'Vector',
    Id: 2
  }]

  public Firm: {};

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

  constructor(protected baseService: BaseService) {
    this.Firm = this.Firms[0];
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

  changeFirm(firmId: number) {
    this.Firm = this.Firms.find(x => x.Id == Number(firmId));
  }

  pageRoute(key: string) {
    return this.baseService.authenticationService.pageRoute(key);
  }

  redirectTo(page: string) {
    this.baseService.router.navigateByUrl(page);
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  public exportAsExcelFile(dt:TreeGridTable, excelFileName: string): void {
    
    /* Export values must be in an array */
    let data:any[] = [];

    let columns = dt.activeColumns;

    /* Load Column Display names */
    let cols:any[] = [];
    columns.forEach(e=> {
      cols.push(e.columnDisplayName);
    })

    /* Push columns to data array */
    data.push(cols);

    /* Push values */
    dt.dataSource.forEach(e=> {
      let items:any[] = [];
      columns.forEach(p => {
        items.push(dt.TGT_getDataValue(e,p));
      })
      data.push(items);
    })

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    /* generate workbook and add th<e worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    let filename:string = "FATS_" + new Date().toLocaleString().replace('_','').replace(', ','_').replace(' ','_');

    XLSX.writeFile(wb,filename + '.xlsx');
  }
}
