import { IData } from './interfaces/IData';
import { DataTable } from '../extends/DataTable';

export class Department implements IData {
    
    filter(_filter:any): boolean {
        
        if (!DataTable.filter(this.Name,_filter.Name))
            return false;
        
        if (!DataTable.filter(this.Description,_filter.Description))
            return false;

        return true;
    }
    
    getChildren():IData[] {
        return this.InverseParentDepartment;
    };

    getId(): number {
        return this.DepartmentId;
    };

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
