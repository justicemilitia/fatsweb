import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { FixedAssetCard } from './FixedAssetCard';
import { MaintenanceTypes } from './MaintenanceTypes';
import { MaintenanceRequestPicture } from './MaintenanceRequestPicture';

export class Maintenance implements IData {
    getParentId(): number {
        throw new Error("Method not implemented.");
    }    
    getChildren(): IData[] {
        throw new Error("Method not implemented.");
    }
    getId(): number {
        throw new Error("Method not implemented.");
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;
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


    FixedAssetCard:FixedAssetCard;
    MaintenanceTypes:MaintenanceTypes;
    MaintenanceRequestPicture:MaintenanceRequestPicture;
}