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
    
    Barcode:string;
    FixedAssetFileId:number;
    FixedAssetId:number; 
    FilePath:string;
    FileName:string;
    FixedAssetFileIds:number[];
    FixedAssets:FixedAsset;
    size:string;
    name:string;
    
}