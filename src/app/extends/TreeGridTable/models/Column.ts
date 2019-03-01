import { IColumn } from './interfaces/IColumn';

export class Column implements IColumn {
    isActive: boolean;
    columnName: string[];
    columnDisplayName: string;
    type: string;
    placeholder: string;
    classes: string[];
}