import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { FixedAssetCard } from './FixedAssetCard';
import { MaintenanceTypes } from './MaintenanceTypes';
import { MaintenanceRequestPicture } from './MaintenanceRequestPicture';
import { User } from './User';
import { MaintenanceStatus } from './MaintenanceStatus';
import { FixedAsset } from './FixedAsset';
import { WorkOrders } from './WorkOrders';
import { MaintenanceUser } from './MaintenanceUser';

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
    MaintenanceTime:number;
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

    FixedAssetCard:FixedAssetCard;
    FixedAsset: FixedAsset;
    WorkOrder: WorkOrders;
    MaintenanceTypes:MaintenanceTypes;
    MaintenanceStatus:MaintenanceStatus;
    RequestedUser:User;
    AttendantUser:User;

    MaintenanceRequestPictures: MaintenanceRequestPicture[];
    MaintinanceUsers: MaintenanceUser[];
    constructor() {
        // this.FixedAssetCard = new FixedAssetCard();
        // this.FixedAsset = new FixedAsset();
        // this.WorkOrder = new WorkOrders();
        // this.RequestedUser = new User();
        // this.AttendantUser = new User();
      }
}