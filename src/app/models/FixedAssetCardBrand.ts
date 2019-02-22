import { IData } from './interfaces/IData';

export class FixedAssetCardBrand implements IData {
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
    Name: string;
    Description: string;
}
