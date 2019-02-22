import { FixedAssetCardCategory } from './FixedAssetCardCategory';
import { Inventory } from './Inventory';
import { FixedAssetCardProperty } from './FixedAssetCardProperty';
import { IData } from './interfaces/IData';

export class FixedAssetCard implements IData {
    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.FixedAssetCardId;
    }
    isExtended: boolean;
    FixedAssetCardId: number;
    Name: string;
    CategoryId: number;
    Description: string;
    CreationDate: Date;
    CreatorId: number;
    ModifiedDate: Date;
    ModifiedId: number;
    IsValid: boolean;
    Category: FixedAssetCardCategory;
    FixedAssetCardProperties:FixedAssetCardProperty[];
    Inventories:Inventory[];
}
