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

  getParentId() {
    return this.ParentDepartmentId;
  }
  getId(): number {
    return this.DepartmentId;
  }

  DepartmentCode: string;
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
  ParentDepartment: any;
  Location: Location;
  InverseParentDepartment: Department[];
  ParentDepartmentId: number;

  constructor() {
    this.Location = new Location();
    this.InverseParentDepartment = [];
    this.ParentDepartment = null;
  }

}
