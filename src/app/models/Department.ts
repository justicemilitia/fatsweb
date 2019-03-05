import { IData } from "../extends/TreeGridTable/models/interfaces/IData";
import { Location } from "./Location";

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

  DeparmtentCode: string;
  CreationDate: Date;
  CreatorId: number;
  DepartmentId: number;
  Description: string;
  FirmId: number;
  IsActive: boolean;
  ModifiedDate: Date;
  ModifiedId: number;
  Name: string;
  LocationId: number;
  ParentDepartment: Department;
  Location: Location;
  InverseParentDepartment: Department[];
  ParentDepartmentId: number;

constructor() {

  this.Location = new Location();
}

}
