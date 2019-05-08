import { CycleCountStatus } from './CycleCountStatus';

export class CycleCountPlan{
    CycleCountPlanNo:string;
    TaskName:string;
    FirmId:number;
    CycleCountStatusId:number;
    StartTime:Date;
    EndTime:Date;
    Description:string;
    CycleCountStatu: CycleCountStatus;
}