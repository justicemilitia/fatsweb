import { ConsumableCard } from './ConsumableCard';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class ConsumableUnit  implements IData{

    getParentId(): number {
        return null;        
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
       return this.ConsumableUnitId;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    ConsumableUnitId : number;
    ConsumableUnitName : string;
    ConsumableUnitShortName : string;
    CreationDate : Date;
    CreatorId : number;
    ModifiedDate : Date;
    ModifierId : number;
    IsValid : boolean;
    ConsumableCards: ConsumableCard[] = [];
}
