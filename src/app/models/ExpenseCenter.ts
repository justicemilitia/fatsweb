import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class ExpenseCenter implements IData{
    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
    return this.ExpenseCenterId
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;
    ExpenseCenterId: number;
    FirmId:number;
    Name:string;
    ExpenseCenterCode:string; 
}