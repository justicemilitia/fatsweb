import { IData } from "../extends/TreeGridTable/models/interfaces/IData";

export class Location implements IData {
  childIndex: number;
  isChecked: boolean;
  isVisible: boolean;

  getParentId(): number {
    return this.ParentLocationId;
  }
  getChildren(): IData[] {
    return this.InverseParentLocation;
  }
  getId(): number {
    return this.LocationId;
  }
  
  isExtended: boolean;
  LocationCode: number;
  LocationId: number;
  ParentLocationId: number;
  Name: string;
  Barcode: string;
  Coordinate: string;
  Address: string;
  Description: string;
  CreationDate: Date;
  CreatorId: number;
  ModifiedDate: Date;
  ModifiedId: number;
  IsActive: boolean;
  ParentLocation: Location;
  InverseParentLocation: Location[];

  constructor() {
    this.InverseParentLocation = [];
  }

}
