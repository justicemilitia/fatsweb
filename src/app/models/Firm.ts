export class Firm {
            firmId: number;
            parentFirmId: number;
            name: string;
            countryId: number;
            cityId: number;
            address: string;
            taxNumber: number;
            taxOffice: string;
            phone:string;
            secondPhone:string;
            description:string;
            creationDate:Date;
            creatorId:number;
            modifiedDate:Date;
            modifiedId:number;
            isActive:boolean;
            country:string; //Country modeli eklenecek 
            parentFirm: Firm;
            agreements:string; //Agreement modeli eklenecek
            firmMenus: string; //FirmMenu modeli eklenecek
            inverseParentFirm: Firm[];
}
