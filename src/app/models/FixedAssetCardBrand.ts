import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class FixedAssetCardBrand implements IData {
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
        return this.FixedAssetCardBrandId;
    }

    isExtended: boolean;
    FixedAssetCardBrandId: number;

    FixedAssetCardBrandCode:string;
    Name: string;
    Description: string;
    CreationDate: Date;
    CreatorId: number;
    ModifiedDate: Date;
    ModifierId: number;
    IsValid: boolean;
}
