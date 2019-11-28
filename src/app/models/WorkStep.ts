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
    IsCompleted:boolean;
    ConsumableCardId:number;
    imageName:string;

    WorkStepConsumables: WorkStepConsumables[];
    WorkStepConsumablesWithProperty:ConsumableProperties[];
    ConsumableId:number;
    
    Consumable:Consumable;
    
    ConsumableProperties:ConsumableProperties[];  

    Consumables: Consumable[];
    ConsumableProcess:WorkStepConsumables[];

    /**
     *
     */
    constructor() {
        this.WorkStepConsumables=[];
        this.ConsumableProperties=[];
        this.Consumables =[];      
        this.WorkStepConsumablesWithProperty= [];
        this.ConsumableProcess=[];
        this.Consumable = new Consumable();
    }
}
