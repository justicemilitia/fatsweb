import { IData } from "./interfaces/IData";

export class Location implements IData {

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
  LocationId: number;
  ParentLocationId: number;
  Name: string;
  Barcode: string;
  Coordinate: Coordinates;
  Description: string;
  CreationDate: Date;
  CreatorId: number;
  ModifiedDate: Date;
  ModifiedId: number;
  IsActive: boolean;
  ParentLocation: Location;
  InverseParentLocation: Location[];
}
