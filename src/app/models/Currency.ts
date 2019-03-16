import { IData } from "../extends/TreeGridTable/models/interfaces/IData";

export class Currency implements IData {
  getParentId(): number {
    return null;
  }
  getChildren(): IData[] {
    return [];
  }
  getId(): number {
    return this.CurrencyId;
  }
  childIndex: number;
  isExtended: boolean;
  isChecked: boolean;
  isVisible: boolean;
  CurrencyId: number;
  Name: string;
  Symbol: string;
  IsValid: boolean;
}
