import { IData } from "../extends/TreeGridTable/models/interfaces/IData";

export class FixedAssetForm implements IData {
  getParentId(): number {
    return null;
  }
  getChildren(): IData[] {
    return [];
  }
  getId(): number {
    return this.FixedAssetFormId;
}
  childIndex: number;
  isExtended: boolean;
  isChecked: boolean;
  isVisible: boolean;
  
  FixedAssetFormId: number;
  UserId: number;
  FixedAssetFormCode: string;
}
