import { ConsumableCard } from './ConsumableCard';
import { ConsumableCategory } from './ConsumableCategory';
import { ConsumableUnit } from './ConsumableUnit';
import { FixedAssetPropertyDetails } from './FixedAssetPropertyDetails';
import { FixedAssetCardModel } from './FixedAssetCardModel';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class Consumable implements IData{
    getParentId(): number {
        return this.ConsumableParentId;
    }
    getChildren(): IData[] {
        return this.InverseConsumableParent;
    }
    getId(): number {
        return this.ConsumableId;
    }

    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    ConsumableId:number;
    ConsumableCardId: number;
    ConsumableParentId: number;  
    ConsumableModelId: number;
    CompanyId: number;
    ConsumableLocationId: number;
    ConsumableAmount: number;
    ConsumableCategoryId:number;
    ConsumableCard:ConsumableCard;
    ConsumableCategory: ConsumableCategory;
    ConsumableUnits: ConsumableUnit;
    FixedAssetCardModel:FixedAssetCardModel;
    ParentConsumable:Consumable;
    InverseConsumableParent : Consumable[];
    FixedAssetPropertyDetails: FixedAssetPropertyDetails[];

    constructor(){
        this.InverseConsumableParent = [];
    }
}