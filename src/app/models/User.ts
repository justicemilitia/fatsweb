import { Department } from './Department';
import { Location } from './Location';
import { Firm } from './Firm';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class User implements IData {
    childIndex: number;
    isChecked: boolean;
    isVisible: boolean;
    getParentId(): number {
        return this.ParentUserId;
    }
    getChildren(): IData[] {
        return this.InverseParentUser;
    }
    getId(): number {
        return this.ParentUserId;
    }
    
    isExtended: boolean;
    UserId:number;
    UserMail:string;
    FirstName:string;
    LastName:string;
    DepartmentId:number;
    LocationId:number;
    UserTitle:string;
    FirmId:number;
    RoleId:number;
    Password:string;
    PhoneNumber:number;
    ParentUserId:number;
    Department: Department;
    Location: Location;
    Firm: Firm;
    InverseParentUser: User[];
}
