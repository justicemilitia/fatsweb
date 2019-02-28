import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { City } from './City';

export class Company implements IData {
  getParentId(): number {
    return null;
  }

  getChildren(): IData[] {
    return [];
  }

  getId(): number {
    return this.CompanyId;
  }

  childIndex: number;
  isExtended: boolean;
  isChecked: boolean;
  isVisible: boolean;

  CompanyId: number;
  Name: string;
  CityId: number;
  Email: string;
  Address: string;
  TaxNumber: number;
  TaxOffice: string;
  Phone: string;
  SecondPhone: string;
  Description: string;
  IsActive: boolean;
  ModifiedDate: Date;
  ModifiedId: number;
  CreationDate: Date;
  CreatorId: number;
  City: City;

}
