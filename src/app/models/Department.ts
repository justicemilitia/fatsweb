import { IData } from './interfaces/IData';

export class Department implements IData {
    
    isVisible: boolean;
    isChecked: boolean;
    childIndex: number;
    isExtended: boolean;
     
    getChildren():IData[] {
        return this.InverseParentDepartment;
    };

    getId(): number {
        return this.DepartmentId;
    };

    getParent() {
        return this.ParentDepartment;
    }

    getParentId() {
        return this.ParentDepartmentId;
    }

    CreationDate: Date;
    CreatorId: number;
    DepartmentId: number;
    Description: string;
    IsActive: boolean;
    ModifiedDate: Date;
    ModifiedId: number;
    Name: string;
    ParentDepartment: Department;
    InverseParentDepartment: Department[];
    ParentDepartmentId: number;   

}
