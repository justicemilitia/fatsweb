import { IData } from '../models/interfaces/IData';
import { TreeGridTableMethods } from './TreeGridTableMethods';
import { IColumn } from '../models/interfaces/IColumn';
import * as $ from 'jquery';
import { Page } from '../models/Page';

export class TreeGridTable {

    //#region Variables

    public originalSource: IData[] = [];
    public treeSource: IData[] = [];
    public dataSource: IData[] = [];
    public dataColumns: IColumn[] = [];
    public dataFilters: any;
    public prevDataFilters: any;
    public dataOrders: any;
    public perInPages: number[] = [1, 5, 25, 50, 100, 250];
    public pages: Page[] = [];

    //#region Getter And Setters

    private _perInPage: number = 1;

    /**
     * _perInPage e bir setter ayarladık çünkü ngModel sadece string gönderir. Gelen stringi number a pars etmemiz gerekiyor.
     */
    public set perInPage(value: any) {
        this._perInPage = Number(value);
        this.currentPage = 1;
    }

    /**
     * perInPage değerini döner.
     */
    public get perInPage() {
        return this._perInPage;
    }

    private _currentPage: number = 1;

    public get currentPage(): number {
        return this._currentPage;
    };

    public set currentPage(value: number) {
        this._currentPage = value;
        this.TGT_calculatePages();
    }

    /**
     * get totalpage count.
     */
    public get totalPage() {
        return Math.ceil(this.dataSource.filter(x => !x.getParentId()).length / this._perInPage);
    }

    //#endregion

    //#endregion

    //#region Constructor

    constructor(_dataColumns: IColumn[], _dataFilters: any, _dataOrders: any) {

        this.dataColumns = _dataColumns;
        this.dataFilters = _dataFilters;
        this.dataOrders = _dataOrders;

    }

    //#endregion

    //#region Base Methods

    public TGT_goToPage(page: number) {
        this.currentPage = page;
    }

    public TGT_calculatePages() {

        let items: Page[] = [];
        let totalPage = this.totalPage;
        items.push({
            value: 1,
            display: '1',
            isDisabled: false,
            isActive: this.currentPage == 1 ? true : false
        });

        if (totalPage <= 1) {
            this.pages = items;
            return;
        }

        if (this.currentPage - 3 > 2) {
            items.push({
                value: 0,
                display: '...',
                isDisabled: true,
                isActive: false
            });
        }

        let lastItem = this.currentPage - 3;
        for (let ii = this.currentPage - 3; ii < totalPage; ii++) {
            lastItem = ii;

            if (ii > 1) {
                items.push({
                    value: ii,
                    display: ii.toString(),
                    isDisabled: ii == this.currentPage ? true : false,
                    isActive: this.currentPage == ii ? true : false
                });
            }
            if (items.length > 7) {
                ii = totalPage;
                break;
            }
        }

        if (lastItem < totalPage - 1 && lastItem > 0) {
            items.push({
                value: 0,
                display: '...',
                isDisabled: true,
                isActive: false
            });
        }

        if (!items.find(x => x.value == totalPage)) {
            items.push({
                value: totalPage,
                display: totalPage.toString(),
                isDisabled: this.currentPage == totalPage ? true : false,
                isActive: this.currentPage == totalPage ? true : false
            });
        }

        this.pages = items;
    }

    /**
     * Load IData[] to datasource.
     * @param _datasource 
     */
    public TGT_loadData(_datasource: IData[]) {
        this.originalSource = _datasource.slice(0);
        this.treeSource = this.TGT_convertDataToTree(_datasource);
        this.TGT_doOrder(this.dataOrders.column);
        this.dataSource = this.TGT_convertTreeToDataTable(this.treeSource);
        this.currentPage = 1;
    }

    /**
     * Do filter for given datasource
     * @param _datasource 
     */
    public TGT_doFilter() {

        let madeChanges = false;
        if (this.prevDataFilters) {
            Object.keys(this.dataFilters).forEach(e => {
                if (this.prevDataFilters[e] != this.dataFilters[e]) {
                    madeChanges = true;
                }
            });
        } else
            madeChanges = true;

        if (madeChanges == false)
            return;

        this.prevDataFilters = JSON.parse(JSON.stringify(this.dataFilters));

        this.TGT_doHiddenAll();
        this.TGT_doFilterInChildren(this.treeSource);

        this.dataSource = this.TGT_convertTreeToDataTable(this.treeSource);

        this.TGT_calculatePages();

        if (this.currentPage > this.totalPage)
            this.currentPage = 1;
        else if (this.currentPage < 1)
            this.currentPage = 1
    }

    /**
     * Order given source for given column
     * @param _datasource datasource will be ordered.
     * @param column column name
     */
    public TGT_doOrder(column: string) {

        this.dataOrders.isDesc = !this.dataOrders.isDesc;
        this.dataOrders.column = column;

        this.TGT_doOrderInChildren(this.treeSource);

        this.dataSource = this.TGT_convertTreeToDataTable(this.treeSource);

        this.prevDataFilters = null;

    }

    /**
     * Get + or minus sign for data. 
     * if data has child and it is expanded result will be "typcn icon-default typcn-minus"
     * if data has child and it is not expanded result will be "typcn icon-default typcn-plus"
     * if data has no child result will be ""
     * @param data The data which will search for.
     */
    public TGT_getSign(data: IData): string {

        if (data.getChildren().length == 0)
            return "";

        if (data.isExtended == true)
            return "typcn icon-default typcn-minus";

        return "typcn icon-default typcn-plus";
    }

    /**
     * Get order class of given column.
     * if order is desc returns classes typcn typcn-arrow-sorted-down.
     * if order is asc returns classes typcn typcn-arrow-sorted-up.
     * @param column Column Name
     */
    public TGT_getOrderSign(column: string): string {
        return 'typcn typcn-arrow-sorted-' + (this.dataOrders.isDesc ? 'down' : 'up') + " " + (this.dataOrders.column == column ? 'typcn-custom-active' : '');
    }

    /**
     * Offset given column down or up
     * @param column Column object which will offset
     * @param isDown if offset will down set true otherwise set false
     */
    public TGT_offsetColumns(column: IColumn, isDown: boolean) {
        let index = this.dataColumns.findIndex(x => x.columnName == column.columnName);
        let item = this.dataColumns[index];
        if (index > -1) {
            if (isDown) {
                if (index < 0)
                    return;
                let downIndex = index + 1;
                let downItem = this.dataColumns[downIndex];
                if (downItem) {
                    /* Helper gridi güncelliyoruz */
                    this.dataColumns.splice(downIndex, 1);
                    this.dataColumns.splice(index, 1, downItem, item);

                    /* Header da kaydırma yapıyoruz */
                    /*let items = $(".tree-table > thead").children('th');
                    let zero = items.eq(index);
                    let first = items.eq(index+1);
                    let second = items.eq(index+2);
                    $(first).remove();
                    $(second).remove();
                    $(first).insertAfter(zero);
                    $(second).insertAfter(zero);*/

                    /* Body i kaydırıyoruz. */
                    let rows = $('.tree-table > tbody').children("tr");
                    rows.each(e => {
                        let zero_td = $(rows[e]).children("td").eq(index);
                        let first_td = $(rows[e]).children("td").eq(index + 1);
                        let second_td = $(rows[e]).children("td").eq(index + 2);
                        $(first_td).remove();
                        $(second_td).remove();
                        $(first_td).insertAfter(zero_td);
                        $(second_td).insertAfter(zero_td);
                    });
                }
            } else {
                if (index > this.dataColumns.length - 1)
                    return;

                let upIndex = index - 1;
                let upItem = this.dataColumns[upIndex];
                if (upItem) {

                    /* Helper gridi güncelliyoruz */
                    this.dataColumns.splice(index, 1);
                    this.dataColumns.splice(upIndex, 1, item, upItem);

                    /* Header da kaydırma yapıyoruz */
                    /*let items = $(".tree-table > thead").children('th');
                    let zero = items.eq(index-1);
                    let first = items.eq(index);
                    let second = items.eq(index+1);
                    $(first).remove();
                    $(second).remove();
                    $(first).insertAfter(zero);
                    $(second).insertAfter(zero);*/

                    /* Body i kaydırıyoruz. */
                    let rows = $('.tree-table > tbody').children("tr");
                    rows.each(e => {
                        let zero_td = $(rows[e]).children("td").eq(index - 1);
                        let first_td = $(rows[e]).children("td").eq(index);
                        let second_td = $(rows[e]).children("td").eq(index + 1);
                        $(first_td).remove();
                        $(second_td).remove();
                        $(first_td).insertAfter(zero_td);
                        $(second_td).insertAfter(zero_td);
                    });
                }
            }
        }
    }

    /**
     * Get given column display class
     * if visible returns "table-column-hidden value" otherwise return ""
     * @param column  Column Name
     */
    public TGT_getColumnVisibility(column: string): string {
        return this.dataColumns.find(x => x.columnName == column).isActive ? "" : "table-column-hidden";
    }

    /**
     * Show or Hide given Column
     * @param column 
     */
    public TGT_toggleColumns(column: IColumn) {
        column.isActive = !column.isActive;
        this.dataColumns.forEach(col => {
            let index = this.dataColumns.findIndex(x => x.columnName == col.columnName);
            if (index > -1) {
                /* Header da kaydırma yapıyoruz */
                let items = $(".tree-table > thead").children('th');
                let item = items.eq(index + 1);
                $(item).css("display", col.isActive ? "table-cell" : "none");

                /* Body i kaydırıyoruz. */
                /*let rows = $('.tree-table > tbody').children("tr");
                rows.each(e=> {
                    let item_td = $(rows[e]).children("td").eq(index + 1);
                    $(item_td).css("display",col.isActive ? "table-cell" : "none");
                });*/
            }
        })
    }

    /**
     * Do Collapse or Do Extend.
     * @param _data 
     */
    public TGT_doCollapse(_data: IData) {
        _data.isExtended = !_data.isExtended;
        this.dataSource = this.TGT_convertTreeToDataTable(this.treeSource);
    }

    /**
     * Converts array to tree array and returns the new array. 
     * @param _datasource
     */
    public TGT_convertDataToTree(_datasource: IData[]): IData[] {
        let tree: IData[] = [];

        for (var ii = 0; ii < _datasource.length; ii++) {
            let item: IData = _datasource[ii];
            item.isVisible = true;
            if (!item.getParentId()) {
                item.childIndex = 0;
                tree.push(item);
            } else {
                let parentInSource = _datasource.find(x => x.getId() == item.getParentId());
                if (parentInSource) {
                    item.childIndex = this.TGT_getChildIndex(parentInSource) + 1;
                    parentInSource.getChildren().push(item);
                }
            }
        }

        return tree;
    }

    public TGT_convertTreeToDataTable(_datasource: IData[]): IData[] {
        let items: IData[] = [];

        for (let ii = 0; ii < _datasource.length; ii++) {
            if (_datasource[ii].isExtended == true && _datasource[ii].isVisible == true) {
                let children = this.TGT_convertTreeToDataTable(_datasource[ii].getChildren());
                items.push(_datasource[ii]);
                children.forEach(e => items.push(e));
            } else if (_datasource[ii].isVisible == true) {
                items.push(_datasource[ii]);
            }
        }

        return items;
    }

    //#endregion

    //#region Movement Between Nodes And Decisions Parents And Childs

    private TGT_doOrderInChildren(_datasource: IData[]) {

        if (this.dataOrders.isDesc)
            _datasource.sort((x, y) => { return TreeGridTableMethods.doOrder(x[this.dataOrders.column], y[this.dataOrders.column]); });
        else
            _datasource.sort((y, x) => { return TreeGridTableMethods.doOrder(x[this.dataOrders.column], y[this.dataOrders.column]); });

        _datasource.forEach(e => {
            if (e.getChildren().length > 0) {
                this.TGT_doOrderInChildren(e.getChildren());
            }
        });

    }

    private TGT_doFilterInChildren(data: IData[]) {
        for (let ii = 0; ii < data.length; ii++) {
            let item: IData = data[ii];

            if (TreeGridTableMethods.doSearch(item, this.dataFilters)) {
                this.TGT_doVisibleWithParents(item);
                this.TGT_doVisibleWithChilds(item);
            }
            this.TGT_doFilterInChildren(item.getChildren());
        }
    }

    private TGT_getChildIndex(item: IData): number {
        let childIndex = 0;
        while (item.getParentId()) {
            childIndex++;
            item = this.originalSource.find(x => x.getId() == item.getParentId());
        }
        return childIndex;
    }

    private TGT_doVisibleWithParents(item: IData) {
        item.isVisible = true;
        item.isExtended = false;
        item = this.originalSource.find(x => x.getId() == item.getParentId());

        while (item) {
            item.isVisible = true;
            if (item && this.TGT_isFilterClean() == true)
                item.isExtended = false;
            else
                item.isExtended = true;

            item = this.originalSource.find(x => x.getId() == item.getParentId());
        }

    }

    private TGT_doVisibleWithChilds(item: IData) {
        item.getChildren().forEach(e => {
            e.isVisible = true;
            this.TGT_doVisibleWithChilds(e);
        })
    }

    private TGT_doHiddenAll() {
        this.originalSource.forEach(e => e.isVisible = false);
    }

    private TGT_isFilterClean(): boolean {
        let result = true;

        Object.keys(this.dataFilters).forEach(e => {
            if ((<string>this.dataFilters[e]).trim() !== '')
                result = false;
        });

        return result;
    }

    //#endregion

}