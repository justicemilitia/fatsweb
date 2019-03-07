import { IData } from "../extends/TreeGridTable/models/interfaces/IData";
import { Company } from "./Company";

export class Agreement implements IData {
  childIndex: number;
  isChecked: boolean;
  isVisible: boolean;
  getParentId(): number {
    return null;
  }
  getChildren(): IData[] {
    return [];
  }
  getId(): number {
    return this.AgreementId;
  }

  isExtended: boolean;
  IsNotificationOn: boolean;
  AgreementId: number;
  AgreementCode: string;
  CompanyId: number;
  Name: string;
  No: string;
  FirmId: number;
  StartDate: Date;
  EndDate: Date;
  Price: number;
  AgreementFile: string;
  Description: string;
  Company: Company;

  constructor() {
    this.Company = new Company();
  }
}
