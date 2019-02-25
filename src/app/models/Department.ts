import { IData } from "../extends/TreeGridTable/models/interfaces/IData";

export class Department implements IData {

  isVisible: boolean;
  isChecked: boolean;
  childIndex: number;
  isExtended: boolean;


  getChildren(): IData[] {
    return this.InverseParentDepartment;
  }

  getParent() {
    return this.ParentDepartment;
  }

  getParentId() {
    return this.ParentDepartmentId;
  }
  getId(): number {
    return this.DepartmentId;
  }

  CreationDate: Date;
  CreatorId: number;
  DepartmentId: number;
  Description: string;
  IsActive: boolean;
  ModifiedDate: Date;
  ModifiedId: number;
  Name: string;
  LocationId: number;
  ParentDepartment: Department;
  InverseParentDepartment: Department[];
  ParentDepartmentId: number;
}
