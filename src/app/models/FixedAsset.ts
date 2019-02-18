import { FixedAssetCategory } from './FixedAssetCategory';
import { Inventory } from './Inventory';
import { FixedAssetProperty } from './FixedAssetProperty';

export class FixedAsset {
    FixedAssetId: number;
    Name: string;
    CategoryId: number;
    Description: string;
    CreationDate: Date;
    CreatorId: number;
    ModifiedDate: Date;
    ModifiedId: number;
    IsActive: boolean;
    Category: FixedAssetCategory;
    FixedAssetProperties:FixedAssetProperty[];
    Inventories:Inventory[];
}
