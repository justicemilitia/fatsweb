import { CycleCountStatus } from './CycleCountStatus';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class CycleCountPlan implements IData{

    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.CycleCountPlanId;
    }

    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    CycleCountPlanId:number;
    CycleCountPlanNo:string;
    TaskName:string;
    FirmId:number;
    CycleCountStatusId:number;
    StartTime:Date;
    EndTime:Date;
    Description:string;
    CycleCountStatu: CycleCountStatus;
}