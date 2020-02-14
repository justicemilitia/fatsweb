import { IData } from '../extends/TreeGridTable/models/interfaces/IData';


export class UserFilterModel implements IData {
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

    UserCode: string;
    FirstName: string;
    LastName: string;
    LocationId: number;
    DepartmentId: number;
    RoleId: number;
    PageNumber: number;
    PageSize: number;

    constructor() {
        this.UserCode = '';
        this.FirstName = '';
        this.LastName = '';
        this.LocationId = -1;
        this.DepartmentId = -1;
        this.RoleId = -1;
        this.PageNumber = 1;
        this.PageSize = 100;
    }
}