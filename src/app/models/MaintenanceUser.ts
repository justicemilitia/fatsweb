import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { Maintenance } from './Maintenance';
import { MaintenanceStatus } from './MaintenanceStatus';
import { User } from 'src/app/models/User';

export class  MaintenanceUser implements IData {
    getParentId(): number {
        return null;
    }    
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.MaintinanceUserId;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    MaintinanceUserId: number;
    MaintinanceListId: number;
    UserId: number;
    MaintinanceTime: number;
    Hour: number;
    Minute: number;
    MaintinanceDate: Date;
    MaintinanceStatuId:number;

    MaintinanceList: Maintenance[];
    MaintinanceStatu: MaintenanceStatus;
    User: User;
}
