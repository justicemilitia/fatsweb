import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class TransactionLog implements IData{
    getParentId(): number {
       return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.TransactionLogId;
    }
    
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

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
    CheckOutToWhom : string;
    CheckOutPrice : number;
    CheckOutLocationId: number;
    UndoSuspensionDate: NgbDate;
    CurrencyId:number;
    CheckInExpectedArrivalDate : Date;
    FromParentInventory: string;
    ToParentInverntory : string;
    TransactionDescription : string;
    TransactionDate: Date;
    Barcode: string;
    FromFirm: string;
    FromFirmId: number;
    ToFirm: string;
    ToFirmId: number;
    FromDepartment: string;
    FromDepartmentId: number;
    ToDepartment: string;
    ToDepartmentId: number;
    FromUserId: number;
    ToUserId: number;
    FromCompany: string;
    FromCompanyId: number;
    ToCompany: string;
    ToCompanyId: number;
    FromInsuranceCompany: string;
    FromInsuranceCompanyId: number;
    ToInsuranceCompany: string;
    ToInsuranceCompanyId: number;
    FromFixedAssetCardCategory: string;
    FromFixedAssetCardCategoryId: number;
    ToFixedAssetCardCategory: string;
    ToFixedAssetCardCategoryId: number;
    ToFixedAssetCard: string;
    ToFixedAssetCardId: number;
    FromFixedAssetCard: string;
    FromFixedAssetCardId: number;
    FromFixedAssetCardName: string;
    ToFixedAssetCardName: string;
    FromFixedAssetPropertyDetailValue: string;
    ToFixedAssetPropertyDetailValue: string;
    FromFixedAssetCardPropertyName: string;
    ToFixedAssetCardPropertyName: string;
    FromPrice: string;
    ToPrice: string;
    FromReceiptDate: Date;
    ToReceiptDate: Date;
    FromSerialNumber: string;
    ToSerialNumber: string;
    ToLocation: string;
    ToLocationId: number;
    FromLocation: string;
    FromLocationId: number;
    FromBrand: string;
    FromBrandId: number;
    ToBrand: string;
    ToBrandId: number;
    FromModelId: number;   
    ToModelId: number;
    //FromModel ??
    //ToModel ??
    CheckOutLocation: string; 
    Currency: number;
    FromExpenseCenterId: number;
    ToExpenseCenterId: number;
    //FromExpenseCenter
    //ToExpenseCenter
    FromInvoiceNo: string;
    ToInvoiceNo: string;
    FromInvoiceDate: Date;
    ToInvoiceDate: Date;
    FromGuaranteeStartDate: Date;
    ToGuaranteeStartDate: Date;
    FromGuaranteeEndDate: Date;
    ToGuaranteeEndDate: Date;
    FixedAssetIsActive: boolean;
    FixedAssetActivationDate: Date;
    Page:number;
    PerPage:number;
    StartDate:Date;
    EndDate:Date;
    IsCreateSuspendForm: boolean;
    IsCreateUndoSuspendForm: boolean;
    IsCreateExitForm: boolean;
    IsSendMail: boolean;
}
