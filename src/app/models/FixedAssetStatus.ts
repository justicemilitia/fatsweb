import { FixedAsset } from './FixedAsset';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class FixedAssetStatus implements IData{
    getParentId(): number {
      return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.FixedAssetStatusId;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;
    
    FixedAssetStatuCode:string;
    FixedAssetStatusId:number;
    Name:string;
    Color:string;
    FixedAssets:FixedAsset;
}