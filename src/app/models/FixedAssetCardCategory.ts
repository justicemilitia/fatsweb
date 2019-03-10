import { FixedAssetCard } from './FixedAssetCard';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class FixedAssetCardCategory implements IData {

  childIndex: number;
  isChecked: boolean;
  isVisible: boolean;
  isExtended: boolean;

  getParentId(): number {
    return this.ParentFixedAssetCardCategoryId;
  }

  getChildren(): IData[] {
    return this.InverseParentFixedAssetCardCategory;
  }

  getId(): number {
    return this.FixedAssetCardCategoryId;
  }

  FixedAssetCardCategoryId: number;
  FixedAssetCardCategoryCode: string;
  ParentFixedAssetCardCategoryId: number;
  Name: string;
  CreationDate: Date;
  CreatorId: number;
  ModifiedDate: Date;
  ModifiedId: number;
  IsActive: boolean;
  ParentCategory: FixedAssetCardCategory;
  FixedAssets: FixedAssetCard[];
  InverseParentFixedAssetCardCategory: FixedAssetCardCategory[];
}
