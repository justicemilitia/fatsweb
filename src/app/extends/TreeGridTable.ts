import { BaseComponent } from '../components/base/base.component';
import { NestedTreeControl } from '@angular/cdk/tree';
import { IData } from '../models/interfaces/IData';
import { MatTreeNestedDataSource } from '@angular/material';
import { TreeGridMethods } from './TreeGridMethods';

export abstract class TreeGridTable extends BaseComponent {

    //#region Variables

    protected treeControl = new NestedTreeControl<IData>(node => node.getChildren());
    protected dataSource = new MatTreeNestedDataSource<IData>();

    //#endregion

    //#region Base Methods

    protected convertDataToNodes(_datasource:IData[]):IData[] {
        return this.doParentAndChild(_datasource);
    }

    protected loadDataToTree(_dataSource:IData[]) {
        this.dataSource.data = _dataSource;
    }

    protected doFilterInTree(_datasource:IData[],filter:any) {
        let filtered = this.doSearchInData(_datasource,filter);
        this.loadDataToTree(filtered);
    }
 
    protected doOrderInTree(_datasource:IData[],filter:any,column:string,isDesc:boolean) {
        
        if (isDesc)
            _datasource.sort((x,y)=> (x[column] > y[column]) ? -1 : ((y[column] > x[column]) ? 1 : 0));
        else
            _datasource.sort((x,y)=> (x[column] > y[column]) ? 1 : ((y[column] > x[column]) ? -1 : 0));

        this.doFilterInTree(_datasource,filter);
    }

    //#endregion

    
    //#region Movement Between Nodes And Decisions Parents And Childs

    private doParentAndChild(datasource: IData[]):IData[] {
        let tree: IData[] = [];
        datasource.forEach(x => {
            if (!x.getParentId())
                tree.push(x);
            else {
                let item = this.doParentAndChildRecursive(tree, x.getParentId());
                if (item)
                    item.getChildren().push(x);
                else
                    tree.push(x);
            }
        });
        return tree;
    }

    private doParentAndChildRecursive(source: IData[], parentID: number): IData {
        var foundItem = null;

        for (var ii = 0; ii < source.length; ii++) {
            var item = source[ii];
            if (item.getId() == parentID) {
                foundItem = item;
                break;
            } else {
                foundItem = this.doParentAndChildRecursive(item.getChildren(), parentID);
                if (foundItem) {
                    break;
                }
            }
        }

        return foundItem;
    }

    protected hasChild = (_: number, data: IData) => data.getChildren().length > 0;

    //#endregion

    //#region Do Recursive Search In Nodes

    protected doSearchInData(datasource:IData[],filter:{}):IData[] {
        
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