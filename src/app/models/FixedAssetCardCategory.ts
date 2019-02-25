import { FixedAssetCard } from './FixedAssetCard';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class FixedAssetCardCategory implements IData {
  childIndex: number;
  isChecked: boolean;
  isVisible: boolean;
  getParentId(): number {
    return this.ParentCategoryId;
  }
  getChildren(): IData[] {
    return this.InverseParentCategory;
  }
  getId(): number {
    return this.FixedAssetCardCategoryId;
  }
  isExtended: boolean;
  FixedAssetCardCategoryId: number;
  FixedAssetCardCategoryCode: string;
  ParentCategoryId: number;
  Name: string;
  CreationDate: Date;
  CreatorId: number;
  ModifiedDate: Date;
  ModifiedId: number;
  IsActive: boolean;
  ParentCategory: FixedAssetCardCategory;
  FixedAssets: FixedAssetCard[];
  InverseParentCategory: FixedAssetCardCategory[];
}
