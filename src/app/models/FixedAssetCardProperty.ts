import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { FixedAssetCardPropertyValue } from './FixedAssetCardPropertyValue';
<<<<<<< HEAD
import { FixedAssetCardPropertyType } from './FixedAssetCardPropertyType';
=======
>>>>>>> 2b1574ad456b40f5cc8251865cb77f4b720cbb1b

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
    FixedAssetPropertyValues: FixedAssetCardPropertyValue[];
    FixedAssetType: FixedAssetCardPropertyType;
    
}
