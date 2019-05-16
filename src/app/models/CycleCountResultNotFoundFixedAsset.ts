import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class CycleCountResultNotFoundFixedAsset implements IData{
    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.FixedAssetId;
    }

    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    FixedAssetId:number;
    Barcode:string;
    DepartmentName:string;
    LocationName:string;
    LocationId:number;
    DepartmentId:number;
    IsValid:boolean;
    IsActive:boolean;
    IsLost:boolean;
    IsSuspended:boolean;
    ActivationDate:Date;
    TotalCount:number;
}