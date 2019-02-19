import { Department } from './Department';
import { Location } from './Location';
import { Firm } from './Firm';

export class User {
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
}
