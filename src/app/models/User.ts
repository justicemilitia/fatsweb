import { Department } from './Department';
import { Location } from './Location';
import { Firm } from './Firm';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { Role } from './Role';

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

    isExtended: boolean;
    UserId: number;
    UserMail: string;
    FirstName: string;
    LastName: string;
    DepartmentId: number;
    UserTitle: string;
    RoleId: number;
    Password: string;
    PhoneNumber: number;
    ParentUserId: number;
    Role: Role;
    ParentUser: User;
    Department: Department;
    InverseParentUser: User[];

    constructor() {
        this.Department = new Department();
        this.Role = new Role();
        this.InverseParentUser = [];
    }

}
