export class TransactionLog {

    TransactionLogId : number;
    TransactionTypeId : number;
    FixedAssetIds : number[];
    UserId : number;
    FromStatus : number;
    ToStatus : number;
    ExistingBarcode : string;
    NewBarcode : string;
    CheckOutReasonId : number;
    CheckOutDescription : string;
    CheckOutToWhom : number;
    CheckOutPrice : number;
    CheckOutLocationId: number;
    CurrencyId:number;
    CheckInExpectedArrivalDate : Date;
    FromParentInventory: number;
    ToParentInverntory : number;
    TransactionDescription : string;
    TransactionDate: Date;
    // TransactionType: TransactionType;
}
