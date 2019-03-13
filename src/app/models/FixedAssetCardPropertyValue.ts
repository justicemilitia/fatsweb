import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class FixedAssetCardPropertyValue implements IData{
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
        return this.FixedAssetPropertyValueId;
    }

    FixedAssetPropertyValueId: number;
    Name: string;
}
