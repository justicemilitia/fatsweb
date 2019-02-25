import { IData } from './interfaces/IData';

export class FixedAssetCardModel implements IData{
    
    childIndex: number;
    isExtended: boolean;
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

    FixedAssetCardModelId: number;
    FixedAssetCardBrandId: number;
    Name: string;
    Description: string;
    FixedAssetCardModel: FixedAssetCardModel;
}
