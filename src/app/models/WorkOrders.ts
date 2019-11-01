import { WorkStep } from './WorkStep';

export class WorkOrders{
    WorkOrderId:number;
    FixedAssetCardId:number;
    WorkStepId:number;
    FixedAssetCardPeriodId:number;
    WorkOrderStatuId:number;    
    WorkOrderCode:number;
    Frequency:number;
    PeriodTypeId:number;

    WorkSteps: WorkStep[];
}