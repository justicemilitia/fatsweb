import { IColumn } from './interfaces/IColumn';

export class Column implements IColumn {

    isActive: boolean;
    columnName: string[];
    columnDisplayName: string;
    type: string;
    placeholder?: string;
    classes?: string[];
    formatter?: any;
    isEditable: boolean;

    constructor() {
        this.classes = [];
        this.isEditable = false;
    }

}