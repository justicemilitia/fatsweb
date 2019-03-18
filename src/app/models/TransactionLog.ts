export class TransactionLog {

    TransactionLogId : number;
    TransactionTypeId : number;
    Barcode : string;
    UserId : number;
    FromStatus : number;
    ToStatus : number;
    ExistingBarcode : string;
    NewBarcode : string;
    CheckOutReasonId : number;
    CheckOutDescription : string;
    CheckOutToWhom : number;
    CheckOutPrice : number;
    CurrencyId:number;
    CheckInExpectedArrivalDate : Date;
    FromParentInventory: number;
    ToParentInverntory : number;
    TransactionDescription : string;
    TransactionDate: Date;
    // TransactionType: TransactionType;
}
