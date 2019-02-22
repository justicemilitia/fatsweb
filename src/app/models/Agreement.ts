import { IData } from './interfaces/IData';
import { Company } from './Company';

export class Agreement implements IData {
    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.AggrementId;
    }

    isExtended: boolean;    
    IsNotificationOn: boolean;
    AggrementId: number;
    CompanyId: number;
    Name: string;
    No: string;
    FirmId: number;
    StartDate: Date;
    EndDate: Date;
    Price: null;
    AgreementFile: string;
    Description:string;
    Company: Company;
}
