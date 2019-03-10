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
<<<<<<< HEAD
=======

    isExtended: boolean;
>>>>>>> 65e1aa60321c9bb1410477c9a904c20e5e3b1915
    UserId: number;
    UserMail: string;
    FirstName: string;
    LastName: string;
    DepartmentId: number;
    LocationId: number;
    UserTitle: string;
    FirmId: number;
    RoleId: number;
    Password: string;
    PhoneNumber: number;
    ParentUserId: number;
<<<<<<< HEAD
=======
    Role: Role;
    ParentUser: User;
>>>>>>> 65e1aa60321c9bb1410477c9a904c20e5e3b1915
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
