export interface IColumn {
    isActive: boolean;
    columnName: string[];
    columnDisplayName: string;
    type: string;
    placeholder: string;
    classes: string[];
    formatter?:any;
}