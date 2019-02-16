export interface IData {

    getParentId():number;
    getChildren():IData[];
    getId():number;
    filter(_filter:{}):boolean;
} 