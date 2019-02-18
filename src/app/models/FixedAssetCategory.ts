import { FixedAsset } from './FixedAsset';

export class FixedAssetCategory {
  FixedAssetCategoriesId: number;
  ParentCategoryId: number;
  Name: string;
  CreationDate: Date;
  CreatorId: number;
  ModifiedDate: Date;
  ModifiedId: number;
  IsActive: boolean;
  ParentCategory: FixedAssetCategory;
  FixedAssets: FixedAsset[];
  InverseParentCategory: FixedAssetCategory[];
}
