import { IData } from "../extends/TreeGridTable/models/interfaces/IData";
import { Company } from "./Company";
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

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
  StartDate: NgbDate;
  EndDate: NgbDate;
  Price: number;
  AgreementFile: string;
  Description: string;
  Company: Company;

  constructor() {
    this.Company = new Company();
  }
}
