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
    UserId: number;
    isExtended: boolean;
    UserMail: string;
    FirstName: string;
    LastName: string;
    DepartmentId: number;
    LocationId: number;
    UserTitle: string;
    FirmId: number;
    RoleId: number;
    Role: Role;
    Password: string;
    PhoneNumber: number;
    ParentUserId: number;
    ParentUser: User;
    Department: Department;
    Location: Location;
    Firm: Firm;
    InverseParentUser: User[];

    constructor() {
        this.Firm = new Firm();
        this.Department = new Department();
        this.Location = new Location();
        this.Role = new Role();
        this.InverseParentUser = [];
    }

}
