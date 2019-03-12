import { IData } from "../extends/TreeGridTable/models/interfaces/IData";
import { ExpenseCenter } from "./ExpenseCenter";
import { FixedAssetCard } from "./FixedAssetCard";
import { FixedAssetCardModel } from "./FixedAssetCardModel";
import { FixedAssetCardCategory } from './FixedAssetCardCategory';
import { FixedAssetCardBrand } from './FixedAssetCardBrand';
import { FixedAssetStatus } from './FixedAssetStatus';

export class FixedAsset implements IData {
  getParentId(): number {
    return null;
  }
  getChildren(): IData[] {
    return [];
  }
  getId(): number {
    return this.FixedAssetId;
  }
  childIndex: number;
  isExtended: boolean;
  isChecked: boolean;
  isVisible: boolean;

  FixedAssetId: number;
  FixedAssetParentId: number;
  FixedAssetCardCategoryId: number;
  Barcode: string;
  SerialNumber: string;
  FixedAssetCardId: number;
  FixedAssetCardModelId: number;
  FixedAssetCardBrandId: number;
  StatusId: number;
  FirmId: number;
  Price: string;
  HasMaintanence: boolean;
  ReceiptDate: Date;
  CurrencyId: number;
  ExpenseCenterId: number;
  InvoiceNo: string;
  InvoiceDate: Date;
  WillDepreciationBeCalculated: boolean;
  DepreciationCalculationTypeID: number;
  DepreciationPeriod: number;
  Ifrsprice: number;
  WillIfrsbeCalculated: boolean;
  Ifrsperiod: number;
  HasInflationIndexation: boolean;
  GuaranteeStartDate: Date;
  GuaranteeEndDate: Date;
  ActivationDate: Date;
  CreationDate: Date;
  CreatorId: number;
  ModifiedDate: Date;
  ModifierId: number;
  IsSuspended: boolean;
  IsLost: boolean;
  IsActive: boolean;
  IsValid: boolean;
  Currency: number;
  ExpenseCenter: ExpenseCenter;
  FixedAssetCard: FixedAssetCard;
  FixedAssetCardModel: FixedAssetCardModel;
  Status: number;
  FixedAssetCardCategory:FixedAssetCardCategory;
  FixedAssetCardBrand:FixedAssetCardBrand;
  FixedAssetStatus:FixedAssetStatus;
  
}
