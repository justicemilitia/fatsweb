export interface IData {

    getParentId():number;
    getChildren():IData[];
    getId():number;
    childIndex:number;
    isExtended:boolean;
    isChecked:boolean;
} 