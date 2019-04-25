import { IColumn } from './interfaces/IColumn';
import { TreeGridDragDirective } from '../directives/tree-grid-drag.directive';

export class Column implements IColumn {

    isActive: boolean;
    columnName: string[];
    columnDisplayName: string;
    type: string;
    placeholder?: string;
    classes?: string[];
    formatter?: any;
    isEditable: boolean;
    directive?: TreeGridDragDirective;

    constructor() {
        this.classes = [];
        this.isEditable = false;
    }

}