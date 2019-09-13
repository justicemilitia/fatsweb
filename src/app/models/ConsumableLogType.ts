import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class ConsumableLogType implements IData {
    getParentId(): number {
        throw new Error("Method not implemented.");
    }    
    getChildren(): IData[] {
        throw new Error("Method not implemented.");
    }
    getId(): number {
        throw new Error("Method not implemented.");
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;


}
