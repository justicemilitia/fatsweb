import { Consumable } from './Consumable';

export class WorkStepConsumables{
    WorkStepConsumablesId:number;
    WorkStepId:number;
    ConsumableId:number;
    Quantity:number;

    Consumable:Consumable;

    constructor() {
        
        this.Consumable = new Consumable();

    }
}