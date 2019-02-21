import { IData } from '../models/interfaces/IData';
import { TreeGridTableMethods } from './TreeGridTableMethods';
import { IColumn } from '../models/interfaces/IColumn';
import * as $ from 'jquery';

export class TreeGridTable {

    //#region Variables

    public treeSource: IData[] = [];
    public dataSource: IData[] = [];
    public dataColumns: IColumn[] = [];
    public dataFilters: any;
    public dataOrders: any;
    public currentPage: number = 1;
    public perInPages: number[] = [1, 5, 25, 50, 100, 250];
    private _perInPage: number = 5;

    //#region Getter And Setters

    /**
     * PerInPage e bir setter ayarladık çünkü ngModel sadece string gönderir. Gelen stringi number a pars etmemiz gerekiyor.
     */
    public set perInPage(value) {
        this._perInPage = Number(value);
        this.currentPage = 1;
    }

    /**
     * perInPage değerini döner.
     */
    public get perInPage() {
        return this._perInPage;
    }

    public get totalPage() {
        return Math.ceil(this.dataSource.filter(x => !x.getParentId()).length / this.perInPage);
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

    public TGT_goToPreviousPage() {
        if (this.currentPage > 1)
            this.currentPage--;
    }

    public TGT_goToNextPage() {
        if (this.currentPage < this.totalPage)
            this.currentPage++;
    }

    public TGT_setPerInPages(source: number[]) {
        this.perInPages.splice(0, this.perInPages.length);
        source.forEach(e => this.perInPages.push(e));
    }

    public TGT_getPaginationItems(): any {

        let items = [];

        items.push({
            value: 1,
            display: '1',
            isDisabled: false,
            isActive: this.currentPage == 1 ? true : false
        });

        if (this.totalPage <= 1)
            return items;

        if (this.currentPage - 3 > 2) {
            items.push({
                value: 0,
                display: '...',
                isDisabled: true,
                isActive: false
            });
        }

        let lastItem = this.currentPage - 3;
        for (let ii = this.currentPage - 3; ii < this.totalPage; ii++) {
            lastItem = ii;
            
            if (ii > 1) {
                items.push({
                    value: ii,
                    display: ii.toString(),
                    isDisabled: ii == this.currentPage ? true : false,
                    isActive: this.currentPage == ii ? true : false
                });
            }
            if (items.length > 6) {
                ii = this.totalPage;
                break;
            }
        }

        if (lastItem < this.totalPage - 1 && lastItem > 0) {
            items.push({
                value: 0,
                display: '...',
                isDisabled: true,
                isActive: false
            });
        }

        if (!items.find(x => x.value == this.totalPage)) {
            items.push({
                value: this.totalPage,
                display: this.totalPage.toString(),
                isDisabled: false,
                isActive: this.currentPage == this.totalPage ? true : false
            });
        }

        return items;

    }

    /**
     * Load IData[] to datasource.
     * @param _datasource 
     */
    public TGT_loadData(_datasource: IData[]) {
        this.dataSource = this.loadWithExtends(_datasource);
        this.treeSource = _datasource;
        this.TGT_doOrder(this.dataOrders.column);

    }

    /**
     * Refresh datasource with data tree.
     */
    public TGT_refreshData(_datasource: IData[]) {
        this.dataSource = this.loadWithExtends(_datasource);
    }

    /**
     * Do filter for given datasource
     * @param _datasource 
     */
    public TGT_doFilter() {

        let nDataSource: IData[] = [];

        this.treeSource.forEach(x => {
            if (TreeGridTableMethods.doSearch(x, this.dataFilters)) {
                nDataSource.push(x);
            } else {
                let foundItem = this.TGT_doFilterInChildren(x.getChildren());
                if (foundItem) {
                    foundItem.forEach(e => {
                        nDataSource.push(e);
                    });
                }
            }
        })

        this.TGT_refreshData(nDataSource);
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

        this.TGT_doFilter();
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
    }

    /**
     * Converts array to tree array and returns the new array. 
     * @param _datasource
     */
    public TGT_convertDataToTree(_datasource: IData[]): IData[] {
        let tree: IData[] = [];
        _datasource.forEach(x => {
            if (!x.getParentId())
                tree.push(x);
            else {
                let item = this.TGT_convertDataToTreeForChildren(tree, x.getParentId());
                if (item)
                    item.getChildren().push(x);
                else
                    tree.push(x);
            }
        });
        return tree;
    }

    //#endregion

    //#region Movement Between Nodes And Decisions Parents And Childs

    private TGT_convertDataToTreeForChildren(source: IData[], parentID: number): IData {
        var foundItem = null;

        for (var ii = 0; ii < source.length; ii++) {
            var item = source[ii];
            if (item.getId() == parentID) {
                foundItem = item;
                break;
            } else {
                foundItem = this.TGT_convertDataToTreeForChildren(item.getChildren(), parentID);
                if (foundItem) {
                    break;
                }
            }
        }

        return foundItem;
    }

    private loadWithExtends(_datasource: IData[], childIndex: number = 0): IData[] {
        let ds: IData[] = [];
        for (let ii = 0; ii < _datasource.length; ii++) {
            if (_datasource[ii].isExtended) {
                let children = this.loadWithExtends(_datasource[ii].getChildren(), childIndex + 1);
                ds.push(_datasource[ii]);
                children.forEach(e => ds.push(e));
            } else {
                _datasource[ii].childIndex = childIndex;
                ds.push(_datasource[ii]);
            }
        }
        return ds;
    }

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

    private TGT_doFilterInChildren(data: IData[]): IData[] {
        let foundItem = [];
        for (var ii = 0; ii < data.length; ii++) {
            var item = data[ii];
            if (TreeGridTableMethods.doSearch(item, this.dataFilters)) {
                foundItem.push(item);
            } else {
                let _foundItem = this.TGT_doFilterInChildren(item.getChildren());
                if (_foundItem) {
                    _foundItem.forEach(e => {
                        foundItem.push(e);
                    });
                }
            }
        }
        return foundItem;
    }

    //#endregion

}