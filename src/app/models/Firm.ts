export class Firm {
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
