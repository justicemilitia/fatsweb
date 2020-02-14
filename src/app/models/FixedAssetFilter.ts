import { IData } from "../extends/TreeGridTable/models/interfaces/IData";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { FixedAssetPropertyDetails } from './FixedAssetPropertyDetails';

export class FixedAssetFilter implements IData {
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
  IsSearchRequest: boolean;
  Page:number;
  PerPage: number;
  Barcodes: string[];
  FixedAssetCardName: number[];
  FixedAssetCardCategoryName: number[];
  StartDate: string;
  EndDate: string;
  Departments: number[];
  Brands: number[];
  Statuses: number[];
  Locations: number[];
  Models: number[];
  Users: number[];
  IsGuaranteed: boolean;
  IsCalculatedDepreciation: boolean;
  IsCalculatedIFRSDepreciation: boolean;
  FixedAssetPropertyArray: FixedAssetPropertyDetails[];
  WillDepreciationBeCalculated:boolean;
  WillIfrsbeCalculated: boolean;
  DepreciationCalculationTypeID: number;
  IsFilter: boolean;
  IsValid: boolean;
  IsExitFixedAsset: boolean;
  Date: NgbDate;
  RecordStatus: boolean;
  IsPassive:boolean;
  IsActive:boolean;
  Barcode:string;
  
  constructor() {
    this.FixedAssetPropertyArray = [];
    this.Barcodes=[];
    this.FixedAssetCardName=[];
    this.FixedAssetCardCategoryName=[];
    this.Departments=[];
    this.Brands=[];
    this.Statuses=[];
    this.Locations=[];
    this.Models=[];
    this.Users=[];
    this.RecordStatus = null;
  }
}
