import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { CycleCountPlan } from './CycleCountPlan';

export class CycleCountResults implements IData{

    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.CycleCountResultId;
    }

    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;
    
    CycleCountResultId:number;
    CycleCountPlanId:number;   
    Barcode:string;
    DepartmentName:string;
    LocationName:string;
    LocationId:number;
    DepartmentId:number;
    PlanLocation:string;
    Barcodes:string[];
 
    UserId:number;
    CountDate:Date;
    NotFoundDuringTheCounting:boolean;
    ShowDifferentLocationsFixedAssets:boolean;
    UnKnownBarcodeList:boolean;
    Page:number;
    PerPage:number;
    TotalCount:number;
    ActivationDate:Date;

    CycleCountPlan:CycleCountPlan;
    Location:Location;
    IsValid:boolean;
    IsActive:boolean;
    IsLost:boolean;
    IsSuspended:boolean;
}