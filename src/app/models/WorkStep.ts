import { WorkStepConsumables } from './WorkStepConsumables';
import { Consumable } from './Consumable';

export class WorkStep{
    WorkStepId:number;
    WorkStepRowId:number;
    Description:string;
    IsConsumableUsed:boolean;
    Quantity:number;
    Picture:string;
    IsDone:boolean;

    WorkStepConsumables: WorkStepConsumables;
    Consumables: Consumable[];
}