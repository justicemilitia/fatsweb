import { IData } from "../extends/TreeGridTable/models/interfaces/IData";

export class Depreciation implements IData {
  getParentId(): number {
    return null;
  }
  getChildren(): IData[] {
    return [];
  }
  getId(): number {
    return this.DepreciationCalculationTypeId;
  }
  
  childIndex: number;
  isExtended: boolean;
  isChecked: boolean;
  isVisible: boolean;

  DepreciationCalculationTypeId: number;
  DepreciationCalculationTypeDescription: string;
  IsValid: boolean;
}
