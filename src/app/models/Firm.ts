import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class Firm implements IData{
    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.FirmId;
    }

    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;
    
    FirmId: number;
    ParentFirmId: number;
    Name: string;
    CountryId: number;
    CityId: number;
    Address: string;
    TaxNumber: number;
    TaxOffice: string;
    Phone:string;
    SecondPhone:string;
    Description:string;
    CreationDate:Date;
    CreatorId:number;
    ModifiedDate:Date;
    ModifiedId:number;
    IsActive:boolean;
    Country:string; //Country modeli eklenecek 
    ParentFirm: Firm;
    Agreements:string; //Agreement modeli eklenecek
    FirmMenus: string; //FirmMenu modeli eklenecek
    InverseParentFirm: Firm[];
}
