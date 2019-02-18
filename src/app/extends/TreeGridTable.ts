import { BaseComponent } from '../components/base/base.component';
import { IData } from '../models/interfaces/IData';
import { TreeGridMethods } from './TreeGridMethods';

export abstract class TreeGridTable extends BaseComponent {

    //#region Variables

    protected dataSource:IData[] = [];

    //#endregion

    //#region Base Methods

    protected TGT_loadData(_datasource:IData[]) {
        this.dataSource = this.loadWithExtends(_datasource);
    }

    protected TGT_doFilter(_datasource:IData[],filter:any) {
        let filtered = this.doSearchInData(_datasource,filter);
        this.TGT_loadData(filtered);
    }
 
    protected TGT_doOrder(_datasource:IData[],filter:any,order:any) {
        
        if (order.isDesc)
            _datasource.sort((x,y)=> (x[order.column] > y[order.column]) ? -1 : ((y[order.column] > x[order.column]) ? 1 : 0));
        else
            _datasource.sort((x,y)=> (x[order.column] > y[order.column]) ? 1 : ((y[order.column] > x[order.column]) ? -1 : 0));

        this.TGT_doFilter(_datasource,filter);
    }
 
    public TGT_getSign(data:IData):string {
        
        if (data.getChildren().length == 0)
            return "";
        
        if (data.isExtended == true) 
            return "typcn icon-default typcn-minus"; 

        return "typcn icon-default typcn-plus";
    }

    public TGT_getOrderSign(order:any,column:string):string {
        return 'typcn typcn-arrow-sorted-' + (order.isDesc ? 'down' : 'up') + " " + (order.column == column ? 'typcn-custom-active' : '');
    }

    //#endregion

    //#region Movement Between Nodes And Decisions Parents And Childs

    protected convertDataToTree(_datasource:IData[]):IData[] {
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

    private loadWithExtends(_datasource:IData[]):IData[] {
        let ds:IData[] = [];
        for(let ii = 0; ii < _datasource.length;ii++) {
            if (_datasource[ii].isExtended)
            {
                let children = this.loadWithExtends(_datasource[ii].getChildren());   
                ds.push(_datasource[ii]);
                children.forEach(e=> ds.push(e));
            }else
            ds.push(_datasource[ii]);
        }
        return ds;
    }

    //#endregion

    //#region Do Recursive Search In Nodes

    private doSearchInData(datasource:IData[],filter:{}):IData[] {
        
        let nDataSource:IData[] = [];
        
        datasource.forEach(x=> {
            if (TreeGridMethods.doSearch(x,filter)) {
                nDataSource.push(x);
            }else {
                let foundItem = this.doSearchInDataChild(x.getChildren(),filter);
                if (foundItem) {
                    foundItem.forEach(e=> {
                        nDataSource.push(e);
                    });
                }
            }
        })        

        return nDataSource;
    }

    private doSearchInDataChild(data:IData[],filter:{}):IData[] {
        let foundItem = [];
        for (var ii = 0; ii < data.length; ii++) {
            var item = data[ii];
            if (TreeGridMethods.doSearch(item,filter)) {
                foundItem.push(item);
            }else {
                let _foundItem = this.doSearchInDataChild(item.getChildren(),filter);
                if (_foundItem) {
                    _foundItem.forEach(e=> {
                        foundItem.push(e);
                    });
                }
            }
        }
        return foundItem;
    }

    //#endregion

}