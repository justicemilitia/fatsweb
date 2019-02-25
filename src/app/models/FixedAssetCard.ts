import { FixedAssetCardCategory } from './FixedAssetCardCategory';
import { Inventory } from './Inventory';
import { FixedAssetCardProperty } from './FixedAssetCardProperty';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class FixedAssetCard implements IData {
    childIndex: number;
    isChecked: boolean;
    isVisible: boolean;
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
    FixedAssetCardCode: string;
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
