import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { FixedAssetCard } from './FixedAssetCard';
import { MaintenanceTypes } from './MaintenanceTypes';
import { MaintenanceRequestPicture } from './MaintenanceRequestPicture';
import { User } from './User';
import { MaintenanceStatus } from './MaintenanceStatus';
import { FixedAsset } from './FixedAsset';
import { WorkOrders } from './WorkOrders';
import { MaintenanceUser } from './MaintenanceUser';
import { WorkStep } from './WorkStep';

export class Maintenance implements IData {
    getParentId(): number {
        return null;
    }    
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.MaintenanceListId;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    PerPage: number;
    Page: number;

    WorkStepId:number;
    RequestedUserId:number;
    RequestDate:Date;
    AttendantUserId:number;
    ModifiedUserId:number;
    ModifiedDate:Date;
    CompletionDate:Date;
    MaintenanceStatusId:number;
    MaintenanceTotalTime:number;
    MaintenanceTypeId:number;
    RequestDescription:string;
    CompletionDescription:string;
    RequestPictureId:number;

    MaintenanceListId:number;
    MaintenanceNumber:number;

    FixedAssetId:number;
    FirmId:number;
    MaintenanceStatusIds:number[];
    isCancelled: boolean;

    Hour: number;
    Minute: number;
    FixedAssetCard:FixedAssetCard;
    FixedAsset: FixedAsset;
    WorkOrder: WorkOrders;
    MaintenanceTypes:MaintenanceTypes;
    MaintenanceStatus:MaintenanceStatus;
    RequestedUser:User;
    AttendantUser:User;
    WorkSteps:WorkStep[];

    WorkOrderId:number;
    WorkStepsForMaintinancesProcess:WorkStep[];
    MaintenanceRequestPictures: MaintenanceRequestPicture[];
    MaintinanceUsers: MaintenanceUser[];
    constructor() {
        this.WorkSteps = [];
        // this.FixedAssetCard = new FixedAssetCard();
        // this.FixedAsset = new FixedAsset();
        // this.WorkOrder = new WorkOrders();
        // this.RequestedUser = new User();
        // this.AttendantUser = new User();
        this.WorkStepsForMaintinancesProcess=[];
      }
}