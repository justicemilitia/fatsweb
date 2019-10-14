import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { FixedAssetCard } from './FixedAssetCard';
import { MaintenanceTypes } from './MaintenanceTypes';
import { MaintenanceRequestPicture } from './MaintenanceRequestPicture';
import { User } from './User';
import { MaintenanceStatus } from './MaintenanceStatus';

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

    FixedAssetCard:FixedAssetCard;
    MaintenanceTypes:MaintenanceTypes;
    MaintenanceStatus:MaintenanceStatus;
    MaintenanceRequestPicture:MaintenanceRequestPicture;
    RequestedUser:User;
    AttendantUser:User;

    BreakdownPictures: string;
}