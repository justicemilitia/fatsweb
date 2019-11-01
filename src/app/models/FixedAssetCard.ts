import { FixedAssetCardCategory } from './FixedAssetCardCategory';
import { Inventory } from './Inventory';
import { FixedAssetCardProperty } from './FixedAssetCardProperty';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { WorkOrderFixedAssetCards } from './WorkOrderFixedAssetCards';

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

    childIndex: number;
    isChecked: boolean;
    isVisible: boolean;
    isExtended: boolean;
    
    FixedAssetCardId: number;
    FixedAssetCardCode: string;
    Name: string;
    FixedAssetCardCategoryId: number;
    Description: string;
    CreationDate: Date;
    CreatorId: number;
    ModifiedDate: Date;
    ModifiedId: number;
    IsValid: boolean;
    IsPeriodic:boolean;
    FixedAssetCardCategory: FixedAssetCardCategory;
    FixedAssetCardProperty:FixedAssetCardProperty[] = [];
    Inventories:Inventory[];
    WorkOrderFixedAssetCards:WorkOrderFixedAssetCards[];

}
