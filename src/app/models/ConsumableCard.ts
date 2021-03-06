import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { ConsumableCategory } from './ConsumableCategory';
import { ConsumableUnit } from './ConsumableUnit';
import { FixedAssetPropertyDetails } from './FixedAssetPropertyDetails';

export class ConsumableCard implements IData{


    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.ConsumableCardId;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    ConsumableCardId: number;
    ConsumableCardCode: string;
    ConsumableCardName: string;
    FirmId: number;
    ConsumableCategoryId: number;
    ConsumableUnitId: number;
    MinimumStockLevel: number;
    Description: string;
    CreationDate: Date;
    CreatorId: number;
    ModifiedDate: Date;
    ModifierId: number;
    IsValid: boolean;
    ConsumableCategory: ConsumableCategory;
    ConsumableUnit: ConsumableUnit;
    ConsumableCardIds: number[];
    FixedAssetPropertyDetails: FixedAssetPropertyDetails[];
    // Consumables: Consumable[]= [];

    /**
     *
     */
    constructor() {
        this.FixedAssetPropertyDetails =[];

        this.ConsumableUnit = new ConsumableUnit();
    }
}
