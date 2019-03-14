import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class CheckOutReason implements IData{
    getParentId(): number {
      return null;
    }
    getChildren(): IData[] {
     return [];
    }
    getId(): number {
       return this.CheckOutReasonId;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;
    CheckOutReasonId: number;
    Name: string;
    Description: string;
    isSuspended:boolean;
}