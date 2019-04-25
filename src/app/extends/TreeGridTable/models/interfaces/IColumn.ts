import { TreeGridDragDirective } from '../../directives/tree-grid-drag.directive';

export interface IColumn {
    isActive: boolean;
    columnName: string[];
    columnDisplayName: string;
    type: string;
    placeholder?: string;
    classes?: string[];
    formatter?: any;
    isEditable?: boolean;
    directive?: TreeGridDragDirective;
}