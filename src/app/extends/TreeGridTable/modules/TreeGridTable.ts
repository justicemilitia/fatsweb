import { IData } from '../models/interfaces/IData';
import { IColumn } from '../models/interfaces/IColumn';
import { Page } from '../models/Page';
import { TreeGridTableMethods } from './TreeGridTableMethods';
import * as $ from 'jquery';

export class TreeGridTable {

    //#region Variables

    public isLoading: boolean = true;

    /**
     * Store is filter active.
     */
    public isFilterActive: boolean = true;

    /**
     * Store is column offset active;
     */
    public isColumnOffsetActive: boolean = true;

    /**
     * Store is config open
     */
    public isConfigOpen: boolean = true;

    /**
     * Store the original list which was used in loadData method as paramter.
     */
    public originalSource: IData[] = [];

    /**
     * Store the items which is calculated parents and childs
     */
    public treeSource: IData[] = [];

    /**
     * Store the items which will render in table.
     */
    public dataSource: IData[] = [];

    /**
     * Table columns which will used to insert columns in to table
     */
    public dataColumns: IColumn[] = [];

    /**
     * Store filter values.
     * {Name:'',Description:''} is an example
     */
    public dataFilters: any = {};

    /**
     * Store previous fitler state.
     */
    public prevDataFilters: any = {};

    /**
     * Store the current order column.
     * {column:'',isDesc:false} is an example
     */
    public dataOrders: any = {};

    /**
     * Store the values which is count of rendered items in a page.
     */
    public perInPages: number[] = [5, 25, 50, 100, 250];

    /**
     * Pagination Items are here.
     */
    public pages: Page[] = [];

    //#region Getter And Setters

    /**
     * Store is paging active.
     */
    private _isPagingActive = true;

    /**
     * Set paging active status then set perInPage status all to show all the items.
     */
    public set isPagingActive(value: boolean) {
        if (value == true) {
            this._isPagingActive = value;
            this.perInPage = -1;
        } else {
            this._isPagingActive = value;
        }
    }

    /**
     * Return the current paging active status
     */
    public get isPagingActive() {
        return this._isPagingActive;
    }


    /**
     * Store per in page vale.
     */
    private _perInPage: number = 25;

    /**
     * Set count of items which will be rendered in page.
     * Html side sends data as string so we should cast it to number.
     */
    public set perInPage(value: any) {
        this._perInPage = Number(value);
        this.currentPage = 1;
    }

    /**
     *  Returns the count of items which will be rendered in a page.
     */
    public get perInPage() {
        return this._perInPage;
    }

    private _currentPage: number = 1;

    /**
     * Get Current Page
     */
    public get currentPage(): number {
        return this._currentPage;
    };

    /**
     * Set Current Page. Pagination will be recalculate.
     */
    public set currentPage(value: number) {
        this._currentPage = value;

        /* After we change current page it will recalculate pagination */
        this.TGT_calculatePages();
    }

    /**
     * Store the select all state.
     */
    private _selectAllState: boolean = false;

    /**
     * Select or deselect all items shown in table
     */
    public set selectAllState(value: boolean) {
        this._selectAllState = value;
        this.TGT_toggleSelectAll();
    }

    /**
     * Get Select or deselect value
     */
    public get selectAllState() {
        return this._selectAllState;
    }

    /**
     * Get Pages count.
     */
    public get totalPage() {
        /* The count of items which has no parent divide perinpage(5,25,50..) give us to total page */
        if (this.dataSource && this.dataSource.length > 0)
            return Math.ceil(this.dataSource.filter(x => !x.getParentId()).length / this._perInPage);

        return 1;
    }

    //#endregion

    //#endregion

    //#region Constructor

    /**
     * 
     * @param _dataColumns Column Values with IColumn interface
     * @param _dataFilters Filter values {} can be empty object
     * @param _dataOrders  Order columns
     */
    constructor(_dataColumns: IColumn[], _dataOrders: any) {

        this.dataColumns = _dataColumns;
        this.dataOrders.column = _dataColumns.find(x => JSON.stringify(x.columnName) == JSON.stringify(_dataOrders.column));
        this.dataOrders.isDesc = _dataOrders.isDesc;
        this.isLoading = true;

    }

    //#endregion

    //#region Base Methods

    /**
     * Toggle of select / unselect for all items
     */
    public TGT_toggleSelectAll() {
        this.dataSource.forEach(e => { e.isChecked = this._selectAllState; });
    }

    /**
     * Deselect All items
     */
    public TGT_deselectAllItems() {
        this.originalSource.forEach(e => e.isChecked = false);
        this.TGT_doFilter();
    }

    /**
     * Get selected items
     */
    public TGT_getSelectedItems(): IData[] {
        return this.originalSource.filter(x => x.isChecked == true);
    }


    /**
     * Change config div visibility
     */
    public TGT_toggleConfig() {
        this.isConfigOpen = !this.isConfigOpen;
        /* Change click event icon */
        $(".table-column-helper").animate({ width: 'toggle' }, "fast");
        if ($(".table-config-arrow").hasClass("typcn-chevron-left") == true) {
            $(".table-config-arrow").removeClass("typcn-chevron-left");
            $(".table-config-arrow").addClass("typcn-chevron-right");
        } else if ($(".table-config-arrow").hasClass("typcn-chevron-right") == true) {
            $(".table-config-arrow").removeClass("typcn-chevron-right");
            $(".table-config-arrow").addClass("typcn-chevron-left");
        }
    }

    /**
     * Change the current page.
     * @param page 
     */
    public TGT_goToPage(page: number) {
        this.currentPage = page;
    }

    /**
     * Calculate total page, active page, previous and next pages.
     */
    public TGT_calculatePages() {

        let items: Page[] = [];
        let totalPage = this.totalPage;

        /* if user in a diffrent page we will render throw the first page */
        if (this.currentPage > totalPage)
            this._currentPage = 1;
        else if (this.currentPage < 1)
            this._currentPage = 1

        /* We will always put first page in to pagination items */
        items.push({
            value: 1,
            display: '1',
            isDisabled: false,
            isActive: this.currentPage == 1 ? true : false
        });

        /* if the total page is 1 return the items no more need calculation */
        if (totalPage <= 1) {
            this.pages = items;
            return;
        }

        /* we will store the last inserted item */
        let lastInsertedItem = this.currentPage - 3;

        /* if current user far enough page we will show ... (you passed many page) */
        if (lastInsertedItem > 2) {
            items.push({
                value: 0,
                display: '...',
                isDisabled: true,
                isActive: false
            });
        }

        /* We loop all pages to add pagination items */
        for (let ii = this.currentPage - 3; ii < totalPage; ii++) {
            lastInsertedItem = ii;

            /* first pages ii may be minus so we should check ii is bigger 1 */
            if (ii > 1) {
                /* Insert pagination item */
                items.push({
                    value: ii,
                    display: ii.toString(),
                    isDisabled: false,
                    isActive: this.currentPage == ii ? true : false
                });
            }

            /* maximum item we will show is 7 */
            if (items.length > 7) {
                ii = totalPage;
                break;
            }
        }

        /* After calculation if we still far from totalpage we insert ... page item */
        if (lastInsertedItem < totalPage - 1 && lastInsertedItem > 0) {
            items.push({
                value: 0,
                display: '...',
                isDisabled: true,
                isActive: false
            });
        }

        /* We always push the last page to the pagination items */
        if (!items.find(x => x.value == totalPage)) {
            items.push({
                value: totalPage,
                display: totalPage.toString(),
                isDisabled: false,
                isActive: this.currentPage == totalPage ? true : false
            });
        }

        /* We set pages to new pagination items. */
        this.pages = items;

    }

    /**
     * Load array which is implemented with idata to datasource.
     * @param _datasource Array which is implemented with IData
     */
    public TGT_loadData(_datasource: IData[]) {
        /* if the datasource null or empty return */
        if (!_datasource || _datasource.length == 0)
            return;

        /* (Clone) Original source help us to visible,extend all items with easy way */
        this.originalSource = _datasource.slice(0);

        /* Converts array to tree */
        this.treeSource = this.TGT_convertDataToTree(_datasource);

        /* We order datasource with default order column */
        this.TGT_doOrder(this.dataOrders.column, false);

        /* We set data source to render result on table */
        this.dataSource = this.TGT_convertTreeToDataTable(this.treeSource);

        /* if current page is diffrent set it as 1 */
        if (this.currentPage != 1)
            this.currentPage = 1;

        /* We Stop Loading */
        this.isLoading = false;
    }

    /**
     * Refresh the datatable
     */
    public TGT_refresh() {

        /* Convert treesource to datasource. Datasource is rendered in table */
        this.dataSource = this.TGT_convertTreeToDataTable(this.treeSource);

        /* After each calculating (Order,Filter, Refresh) we should recalculate pagination system */
        this.TGT_calculatePages();

    }

    /**
     * Update an item in datatable with compare their ids
     * @param data new item.
     */
    public TGT_updateData(data: IData) {
        let existsIndex = this.originalSource.findIndex(x => x.getId() == data.getId());
        if (existsIndex > -1) {
            this.originalSource.splice(existsIndex, 1);
            this.originalSource.push(data);
            this.TGT_loadData(this.originalSource);
        }
    }

    /**
     * Do filter for given datasource
     */
    public TGT_doFilter() {

        /* Check changes made */
        let madeChanges = false;
        if (this.prevDataFilters) {
            /* Each property of filter will be check with previous */
            Object.keys(this.dataFilters).forEach(e => {
                if (this.prevDataFilters[e] != this.dataFilters[e]) {
                    madeChanges = true;
                }
            });
        } else
            madeChanges = true;

        /* if not return to prevent refresh table */
        if (madeChanges == false)
            return;

        /* Update previous state to prevent filter for same filter settings */
        this.prevDataFilters = JSON.parse(JSON.stringify(this.dataFilters));

        /* First we do hidden all items */
        this.TGT_doHiddenAll();

        /* Do Filter with treesource set found items as visible */
        this.TGT_doFilterInChildren(this.treeSource);

        /* Convert treesource to datasource. Datasource is rendered in table */
        this.dataSource = this.TGT_convertTreeToDataTable(this.treeSource);

        /* After each calculating (Order,Filter, Refresh) we should recalculate pagination system */
        this.TGT_calculatePages();

    }

    /**
     * Order table with given order name
     * @param column column name like (Name,Description..)
     */
    public TGT_doOrder(column: IColumn, reverse: boolean = true) {

        /* Reverse current order */
        if (reverse == true)
            this.dataOrders.isDesc = !this.dataOrders.isDesc;

        /* Change current order column */
        this.dataOrders.column = column;

        /* Do Order treesource with treesource children */
        this.TGT_doOrderInChildren(this.treeSource);

        /* Then filter again to use rerender page with filtered items */
        this.prevDataFilters = null;

        /* We do filter and rerender table */
        this.TGT_doFilter();

    }

    /**
     * Get + or - sign for data. 
     * if data has child and it is expanded result will be "typcn icon-default typcn-minus"
     * if data has child and it is not expanded result will be "typcn icon-default typcn-plus"
     * if data has no child result will be ""
     * @param data The data which will search for.
     */
    public TGT_getSign(data: IData): string {

        /* Children count 0 return empty */
        if (data.getChildren().length == 0)
            return "";

        /* if data extended return minus icon */
        if (data.isExtended == true)
            return "typcn icon-default typcn-minus";

        /* otherwise return plus icon */
        return "typcn icon-default typcn-plus";
    }

    /**
     * Get order class of given column name.
     * if order is desc returns classes typcn typcn-arrow-sorted-down.
     * if order is asc returns classes typcn typcn-arrow-sorted-up.
     * @param column Column Name
     */
    public TGT_getOrderSign(column: IColumn): string {
        return 'typcn typcn-arrow-sorted-'
            + (this.dataOrders.isDesc ? 'down' : 'up') + " "
            + (this.dataOrders.column == column ? 'typcn-custom-active' : '');
    }

    /**
     * Get value of given column
     * @param data The data we will take value
     * @param column The column we will take
     */
    public TGT_getDataValue(data: IData, column: IColumn) {

        let item = null;

        /* We will go as deep as possible then we will get the column of given */
        column.columnName.forEach(e => {
            if (!item)
                item = data[e];
            else
                item = item[e];
        });

        return item;
    }

    /**
     * Offset given column down or up
     * @param column Column object which will offset
     * @param isDown if offset will down set true otherwise set false
     */
    public TGT_offsetColumns(column: IColumn, isDown: boolean) {
        /* We find the column index in columns list */
        let index = this.dataColumns.findIndex(x => x.columnName == column.columnName);
        /* if column not exists return */
        if (index <= -1)
            return;

        if (isDown) {
            /* Get the one bottom item index */
            let downIndex = index + 1;
            /* if no more column at the bottom return */
            if (downIndex >= this.dataColumns.length)
                return;
            /* Get the one bottom item */
            let downItem = this.dataColumns[downIndex];

            /* Update helper grid */
            /* Remove column from array at the bottom */
            this.dataColumns.splice(downIndex, 1);
            /* Then add down column and offset column to column array */
            this.dataColumns.splice(index, 1, downItem, column);

            return;
        }

        /* isDown false mean user try to offset to top */
        /* We chech is there any column top of the current if not return */
        if (index > this.dataColumns.length - 1)
            return;

        /* if there is no one at the top of current column return */
        let upIndex = index - 1;
        if (upIndex < 0)
            return;

        /* Find the row at the top of current column */
        let upItem = this.dataColumns[upIndex];

        /* Remove the current column */
        this.dataColumns.splice(index, 1);

        /* then we remove at the top of the current column then add with new order */
        this.dataColumns.splice(upIndex, 1, column, upItem);

    }

    /**
     * Get given column display class
     * if visible returns "table-column-hidden value" otherwise return ""
     * @param columnName  Column Name
     */
    public TGT_getColumnVisibility(column: IColumn): string {

        /* if column active return empty to prevent hidden class */
        return column.isActive ? "" : "table-column-hidden";

    }

    /**
     * Show or Hide given Column
     * @param column Column name you want to toggle
     */
    public TGT_toggleColumns(column: IColumn) {
        /* Change column active status to its reverse */
        column.isActive = !column.isActive;
    }

    /**
     * Do Collapse or Do Extend.
     * @param _data 
     */
    public TGT_doCollapse(_data: IData) {

        /* Reverse extends status */
        _data.isExtended = !_data.isExtended;

        /* Refresh datasource with new extended item */
        this.dataSource = this.TGT_convertTreeToDataTable(this.treeSource);

    }

    /**
     * Converts array to tree array and returns the new array. 
     * @param _datasource Data array which is not designed as tree and implemented with IData
     */
    public TGT_convertDataToTree(_datasource: IData[]): IData[] {

        let tree: IData[] = [];

        /* We controll all datasource items for find their parent and children */
        for (var ii = 0; ii < _datasource.length; ii++) {
            /* We set item property with current item then set visible true to show on table */
            let item: IData = _datasource[ii];
            item.isVisible = true;

            /* if the current item has no parent set childIndex 0 and push it to array */
            if (!item.getParentId()) {
                item.childIndex = 0;
                tree.push(item);
                continue;
            }

            /* if the current item is a children then we find its parent in _datasoure */
            let parentInSource = _datasource.find(x => x.getId() == item.getParentId());

            /* We check if the parent found  */
            if (parentInSource) {

                /* We calculate child index the we push it to parent's children list */
                item.childIndex = this.TGT_getChildIndex(parentInSource) + 1;
                parentInSource.getChildren().push(item);

            }

        }

        return tree;
    }

    /**
     * Covert Tree to datatable to show in table
     * @param _datasource Datasource which is designed with parent and children.
     */
    public TGT_convertTreeToDataTable(_datasource: IData[]): IData[] {
        let items: IData[] = [];

        /* Loop in each tree to push them into datasource */
        for (let ii = 0; ii < _datasource.length; ii++) {
            let item = _datasource[ii];
            /* 
                Every time we push an item in to datasource we have to check its status 
                if item is extended means item has children so you have to put them into the array
                and every item (includes children) visibility must be true.
            */
            if (item.isExtended == true && item.isVisible == true) {

                /* We will always push the parent in to the array */
                items.push(item);

                /* if this parent has children then we will push children into array */
                if (item.getChildren().length > 0) {
                    let children = this.TGT_convertTreeToDataTable(item.getChildren());
                    children.forEach(e => items.push(e));
                }

                continue;

            }
            /* Some of parents cant be children so we have to also push them into array */
            if (item.isVisible == true)
                items.push(item);
        }

        return items;
    }


    /**
     * Calculates the child index 0 is master ...
     * @param item item which will calculate child index
     */
    public TGT_getChildIndex(item: IData): number {

        let childIndex = 0;

        /* check if parentid exists means it should be a parent */
        while (item.getParentId()) {

            /* We increase if parent exists */
            childIndex++;

            /* We find parent the current item and then check the new parent item parent */
            item = this.originalSource.find(x => x.getId() == item.getParentId());

        }

        return childIndex;

    }

    /**
     * Set visible true with its parents
     * @param item item which will be visible with parent
     */
    public TGT_doVisibleWithParents(item: IData) {

        /* 
            While doing an item visible with parent we set extended as false.
            Because of search method. We will just extend when the search item found.
         */
        item.isVisible = true;
        item.isExtended = false;

        /* In original source we look for parent object to make it visible */
        item = this.originalSource.find(x => x.getId() == item.getParentId());

        /* if parent exists we do visible it */
        while (item) {

            /* set item visiblity as true */
            item.isVisible = true;

            /* if filter clean we have to set item extends as false */
            if (item && this.TGT_isFilterClean() == true)
                item.isExtended = false;
            else
                item.isExtended = true;

            /* Then find parent item's parent */
            item = this.originalSource.find(x => x.getId() == item.getParentId());

        }

    }

    /**
     * Do Visible with children
     * @param item item which will force to visible
     */
    public TGT_doVisibleWithChildren(item: IData) {
        /* First we do visible current item then we do visible its children */
        item.isVisible = true;
        item.getChildren().forEach(e => {
            e.isVisible = true;
            /* Do also visible all children of children */
            this.TGT_doVisibleWithChildren(e);
        })
    }

    /**
     * Set All items hidden
     */
    public TGT_doHiddenAll() {
        this.originalSource.forEach(e => e.isVisible = false);
    }

    /**
     * Collapse all items
     */
    public TGT_doCollapseAll() {
        this.originalSource.forEach(e => e.isExtended = false);
    }

    /**
     * Extends all items
     */
    public TGT_doExtendAll() {
        this.originalSource.forEach(e => e.isExtended = true);
    }

    /**
     * Returns true if filter clean
     */
    public TGT_isFilterClean(): boolean {
        let result = true;
        /* Check for each key of datafilter if not empty any of the values return false */
        Object.keys(this.dataFilters).forEach(e => {
            if ((<string>this.dataFilters[e]).trim() !== '')
                result = false;
        });

        return result;
    }

    /**
     * Do Order for each item and their children
     * @param _datasource The tree source to order them related children or parents  
     */
    public TGT_doOrderInChildren(_datasource: IData[]) {

        /* if the current order is descending */
        if (this.dataOrders.isDesc)
            _datasource.sort((x, y) => { return TreeGridTableMethods.doOrder(this.TGT_getDataValue(x, this.dataOrders.column), this.TGT_getDataValue(y, this.dataOrders.column)); });
        else
            _datasource.sort((y, x) => { return TreeGridTableMethods.doOrder(this.TGT_getDataValue(x, this.dataOrders.column), this.TGT_getDataValue(y, this.dataOrders.column)); });

        /* Do Order for all children */
        _datasource.forEach(e => {
            if (e.getChildren().length > 0) {
                this.TGT_doOrderInChildren(e.getChildren());
            }
        });

    }

    /**
     * Do Filter in each item and their children
     * @param _datasource Treesource array to search recursively 
     */
    public TGT_doFilterInChildren(_datasource: IData[]) {

        /* Check each data in source with recursivly */
        for (let ii = 0; ii < _datasource.length; ii++) {
            /* Each item for we will do search with datafilter */
            let item: IData = _datasource[ii];

            /* if item contains given data then do its parent and their children visible (not extended) */
            if (TreeGridTableMethods.doSearch(item, this.dataFilters)) {
                this.TGT_doVisibleWithParents(item);
                this.TGT_doVisibleWithChildren(item);
            }
            /* Do Filter in all children */
            if (item.getChildren().length > 0)
                this.TGT_doFilterInChildren(item.getChildren());
        }
    }

    //#endregion

}