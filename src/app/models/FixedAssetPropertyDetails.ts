import { FixedAsset } from './FixedAsset';
import { FixedAssetCardProperty } from './FixedAssetCardProperty';
import { FixedAssetCardPropertyValue } from './FixedAssetCardPropertyValue';
import { FixedAssetCardPropertyType } from './FixedAssetCardPropertyType';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { Consumable } from './Consumable';

export class FixedAssetPropertyDetails implements IData{
    
    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.FixedAssetPropertyDetailId; 
    }

    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    FixedAssetPropertyDetailId: number;
    Value: string;
    FixedAssetCardPropertyId: number;
    FixedAssetId: number;
    FixedAssetPropertyTypeId: number;
    CreationDate: Date;
    CreatorId: number;
    ModifiedDate: Date;
    ModifierId: number;
    IsValid: boolean;
    ConsumableId: number;
    FixedAsset: FixedAsset;
    FixedAssetCardProperty:FixedAssetCardProperty;
    FixedAssetPropertyValues:FixedAssetCardPropertyValue;
    FixedAssetPropertyType:FixedAssetCardPropertyType;
    Consumable:Consumable;
}