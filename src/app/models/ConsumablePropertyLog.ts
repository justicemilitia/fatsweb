import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { ConsumableRequest } from './ConsumableRequest';
import { FixedAssetCardProperty } from './FixedAssetCardProperty';
import { Consumable } from './Consumable';

export class ConsumablePropertyLog implements IData {
    getParentId(): number {
        return null;        
    }    
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
       return this.ConsumablePropertyLogId;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    ConsumablePropertyLogId: number;
    ConsumablePropertyId: number;
    ConsumableLogId: number;
    ConsumableId: number;
    ConsumableParentId: number;
    Value: string;
    ConsumableLogDate: Date;

    Consumable: Consumable;
    ConsumableLog: ConsumableRequest;
    ConsumableProperty: FixedAssetCardProperty;
}
