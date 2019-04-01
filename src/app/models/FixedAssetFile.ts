import { FixedAsset } from './FixedAsset';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class FixedAssetFile implements IData{
    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.FixedAssetFileId;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;
    
    FixedAssetFileId:number;
    FixedAssetId:number; 
    FilePath:string;
    FileName:string;
    FixedAssets:FixedAsset;
}