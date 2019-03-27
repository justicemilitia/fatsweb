import { Department } from './Department';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { Role } from './Role';
import UserTitle from './UserTitle';

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
    UserTitleId:number;
    isExtended: boolean;
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
    UserRoles: Role[];
    ParentUser: User;
    Department: Department;
    InverseParentUser: User[];
    UserCode: string;
    LocationId: number;
    constructor() {
        this.Department = new Department();
        this.UserRoles = [];
        this.UserTitle = new UserTitle();
        this.InverseParentUser = [];
    }

}
