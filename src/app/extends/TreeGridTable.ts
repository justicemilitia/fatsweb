import { BaseComponent } from '../components/base/base.component';
import { NestedTreeControl } from '@angular/cdk/tree';
import { IData } from '../models/interfaces/IData';
import { MatTreeNestedDataSource } from '@angular/material';

export abstract class TreeGridTable extends BaseComponent {

    protected treeControl = new NestedTreeControl<IData>(node => node.getChildren());
    protected dataSource = new MatTreeNestedDataSource<IData>();

    protected doParentAndChild(datasource: IData[]):IData[] {
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

    protected searchInData(datasource:IData[],filter:{}):IData[] {
        
        let nDataSource:IData[] = [];
        
        datasource.forEach(x=> {
            if (x.filter(filter)) {
                nDataSource.push(x);
            }else {
                let foundItem = this.doSearchInChild(x.getChildren(),filter);
                if (foundItem) {
                    foundItem.forEach(e=> {
                        nDataSource.push(e);
                    });
                }
            }
        })        

        return nDataSource;
    }

    private doSearchInChild(data:IData[],filter:{}):IData[] {
        let foundItem = [];
        for (var ii = 0; ii < data.length; ii++) {
            var item = data[ii];
            if (item.filter(filter)) {
                foundItem.push(item);
            }else {
                let _foundItem = this.doSearchInChild(item.getChildren(),filter);
                if (_foundItem) {
                    _foundItem.forEach(e=> {
                        foundItem.push(e);
                    });
                }
            }
        }
        return foundItem;
    }

    protected hasChild = (_: number, data: IData) => data.getChildren().length > 0;

    loadData(dataSource:IData[]) {
        this.dataSource.data = dataSource;
    }

}