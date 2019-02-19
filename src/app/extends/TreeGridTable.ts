import { BaseComponent } from '../components/base/base.component';
import { IData } from '../models/interfaces/IData';
import { TreeGridMethods } from './TreeGridMethods';
import { IColumn } from '../models/interfaces/IColumn';
import * as $ from 'jquery';

export abstract class TreeGridTable extends BaseComponent {

    //#region Variables

    protected dataSource: IData[] = [];
    protected dataColumns: IColumn[] = [];

    //#endregion

    //#region Base Methods

    protected TGT_loadData(_datasource: IData[]) {
        this.dataSource = this.loadWithExtends(_datasource);
    }

    protected TGT_doFilter(_datasource: IData[], filter: any) {
        let filtered = this.doSearchInData(_datasource, filter);
        this.TGT_loadData(filtered);
    }

    protected TGT_doOrder(_datasource: IData[], filter: any, order: any) {

        if (order.isDesc)
            _datasource.sort((x, y) => (x[order.column] > y[order.column]) ? -1 : ((y[order.column] > x[order.column]) ? 1 : 0));
        else
            _datasource.sort((x, y) => (x[order.column] > y[order.column]) ? 1 : ((y[order.column] > x[order.column]) ? -1 : 0));

        this.TGT_doFilter(_datasource, filter);
    }

    public TGT_getSign(data: IData): string {

        if (data.getChildren().length == 0)
            return "";

        if (data.isExtended == true)
            return "typcn icon-default typcn-minus";

        return "typcn icon-default typcn-plus";
    }

    public TGT_getOrderSign(order: any, column: string): string {
        return 'typcn typcn-arrow-sorted-' + (order.isDesc ? 'down' : 'up') + " " + (order.column == column ? 'typcn-custom-active' : '');
    }

    public TGT_loadColumns(columns: IColumn[]) {
        columns.forEach(e => {
            this.dataColumns.push(e);
        });
    }

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

    public TGT_getColumnVisibility(column: string): string {
        return this.dataColumns.find(x => x.columnName == column).isActive ? "" : "table-column-hidden";
    }

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

    //#endregion

    //#region Movement Between Nodes And Decisions Parents And Childs

    protected convertDataToTree(_datasource: IData[]): IData[] {
        let tree: IData[] = [];
        _datasource.forEach(x => {
            if (!x.getParentId())
                tree.push(x);
            else {
                let item = this.convertDataToTreeForChildren(tree, x.getParentId());
                if (item)
                    item.getChildren().push(x);
                else
                    tree.push(x);
            }
        });
        return tree;
    }

    private convertDataToTreeForChildren(source: IData[], parentID: number): IData {
        var foundItem = null;

        for (var ii = 0; ii < source.length; ii++) {
            var item = source[ii];
            if (item.getId() == parentID) {
                foundItem = item;
                break;
            } else {
                foundItem = this.convertDataToTreeForChildren(item.getChildren(), parentID);
                if (foundItem) {
                    break;
                }
            }
        }

        return foundItem;
    }

    private loadWithExtends(_datasource: IData[],childIndex:number = 0): IData[] {
        let ds: IData[] = [];
        for (let ii = 0; ii < _datasource.length; ii++) {
            if (_datasource[ii].isExtended) {
                let children = this.loadWithExtends(_datasource[ii].getChildren(),childIndex+1);
                ds.push(_datasource[ii]);
                children.forEach(e => ds.push(e));
            } else {
                _datasource[ii].childIndex = childIndex;
                ds.push(_datasource[ii]);
            }
        }
        return ds;
    }

    //#endregion

    //#region Do Recursive Search In Nodes

    private doSearchInData(datasource: IData[], filter: {}): IData[] {

        let nDataSource: IData[] = [];

        datasource.forEach(x => {
            if (TreeGridMethods.doSearch(x, filter)) {
                nDataSource.push(x);
            } else {
                let foundItem = this.doSearchInDataChild(x.getChildren(), filter);
                if (foundItem) {
                    foundItem.forEach(e => {
                        nDataSource.push(e);
                    });
                }
            }
        })

        return nDataSource;
    }

    private doSearchInDataChild(data: IData[], filter: {}): IData[] {
        let foundItem = [];
        for (var ii = 0; ii < data.length; ii++) {
            var item = data[ii];
            if (TreeGridMethods.doSearch(item, filter)) {
                foundItem.push(item);
            } else {
                let _foundItem = this.doSearchInDataChild(item.getChildren(), filter);
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