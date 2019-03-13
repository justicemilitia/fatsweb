import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class FixedAssetCardProperty implements IData {
    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.FixedAssetCardPropertyId;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    FixedAssetCardPropertyId:number;
    FixedAssetCardPropertyCode:string;
    FixedAssetCardPropertyTypeId: number;
    FixedAssetTypeId: number;
    Name: string;
    IsUnique: boolean;
}
