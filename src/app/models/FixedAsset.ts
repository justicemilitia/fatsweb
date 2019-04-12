import { IData } from "../extends/TreeGridTable/models/interfaces/IData";
import { ExpenseCenter } from "./ExpenseCenter";
import { FixedAssetCard } from "./FixedAssetCard";
import { FixedAssetCardModel } from "./FixedAssetCardModel";
import { FixedAssetCardCategory } from './FixedAssetCardCategory';
import { FixedAssetCardBrand } from './FixedAssetCardBrand';
import { FixedAssetStatus } from './FixedAssetStatus';
import { Department } from './Department';
import { Currency } from './Currency';
import { FixedAssetPropertyDetails } from './FixedAssetPropertyDetails';
import { FixedAssetFile } from './FixedAssetFile';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Location } from './Location';
import { FixedAssetUser } from './FixedAssetUser';

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

  BarcodeIds: [];
  FixedAssetId: number;
  FixedAssetParentId: number;
  FixedAssetCardCategoryId: number;
  Barcode: string;
  SerialNumber: string;
  LocationId: number;
  DepartmentId: number;
  FixedAssetCardId: number;
  FixedAssetCardModelId: number;
  FixedAssetCardBrandId: number;
  StatusId: number;
  FirmId: number;
  CompanyId: number;
  Price: string;
  HasMaintanence: boolean;
  ReceiptDate: NgbDate;
  CurrencyId: number;
  ExpenseCenterId: number;
  InvoiceNo: string;
  InvoiceDate: NgbDate;
  WillDepreciationBeCalculated: boolean;
  DepreciationCalculationTypeID: number;
  DepreciationPeriod: number;
  Ifrsprice: number;
  WillIfrsbeCalculated: boolean;
  Ifrsperiod: number;
  IFRSCurrecyId: number;
  HasInflationIndexation: boolean;
  GuaranteeStartDate: NgbDate;
  GuaranteeEndDate: NgbDate;
  ActivationDate: NgbDate;
  Picture: string;
  UserId: number;
  CreationDate: Date;
  CreatorId: number;
  ModifiedDate: Date;
  ModifierId: number;
  IsSuspended: boolean;
  IsLost: boolean;
  IsActive: boolean;
  IsValid: boolean;
  Currency: Currency;
  Department: Department;
  Location: Location;
  ExpenseCenter: ExpenseCenter;
  FixedAssetCard: FixedAssetCard;
  FixedAssetCardModel: FixedAssetCardModel;
  FixedAssetCardCategory: FixedAssetCardCategory;
  FixedAssetCardBrand: FixedAssetCardBrand;
  FixedAssetStatus: FixedAssetStatus;
  FixedAssetPropertyDetails: FixedAssetPropertyDetails[];
  FixedAssetIds: number[];
  FixedAssetFiles: FixedAssetFile[];
  willDisplay: boolean = false;
  InsuranceCompanyId: number;
  FixedAssetUsers: FixedAssetUser[];
  IsBarcodeManual: boolean = false;
  Quantity: number;
  Tablename:string;  
  StartDate: string;
  EndDate: NgbDate;
  IsCalculatedDepreciation:boolean;
  IsCalculatedIFRSDepreciation: boolean;
  IsGuaranteed: boolean;

  constructor() {
    this.FixedAssetCard = new FixedAssetCard();
    this.FixedAssetCardBrand = new FixedAssetCardBrand();
    this.FixedAssetCardModel = new FixedAssetCardModel();
    this.FixedAssetStatus = new FixedAssetStatus();
    this.ExpenseCenter = new ExpenseCenter();
    this.FixedAssetCardCategory = new FixedAssetCardCategory();
    this.Location = new Location();
    this.Currency = new Currency();
  }
}
