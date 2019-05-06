import { Department } from './Department';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import UserTitle from './UserTitle';
import { UserRole } from './UserRole';

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
        return this.UserId;
    }
    UserTitleId: number;
    isExtended: boolean;
    RegistrationNumber:string;
    UserId: number;
    UserMail: string;
    FirstName: string;
    LastName: string;
    DepartmentId: number;
    UserTitle: UserTitle;
    RoleId: number;
    Password: string;
    PhoneNumber: number;
    ParentUserId: number;
    UserRoles: UserRole[];
    ParentUser: User;
    Department: Department;
    InverseParentUser: User[];
    UserCode: string;
    LocationId: number;
    IsSystemUser: boolean;
    Description: string;
    /**
     * To Update Roles
     */
    
    LocationIds: any[];
    UserIds:any[];
    FixedassetCardCategoryIds:any[];
    FirmIds:any[];
    RoleIds: any[];

    constructor() {
        this.Department = new Department();
        this.UserRoles = [];
        this.RoleIds = [];
        this.UserTitle = new UserTitle();
        this.InverseParentUser = [];
    }

}
