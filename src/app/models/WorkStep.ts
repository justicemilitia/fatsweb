import { WorkStepConsumables } from './WorkStepConsumables';
import { Consumable } from './Consumable';
import { ConsumableProperties } from './ConsumableProperties';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class WorkStep implements IData{

    getParentId(): number {
       return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
       return this.WorkStepId;
    }

    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;
    WorkStepId:number;
    WorkStepRowId:number;
    Description:string;
    IsConsumableUsed:boolean;
    Quantity:number;
    Picture:string;
    IsDone:boolean;
    ConsumableCardId:number;

    WorkStepConsumables: WorkStepConsumables[];
    
    ConsumableProperties:ConsumableProperties[];    
    Consumables: Consumable[];
}
