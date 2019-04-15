import { FixedAsset } from './FixedAsset';
import { User } from './User';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class FixedAssetUser implements IData {
  getParentId(): number {
    return null;
  }
  getChildren(): IData[] {
    return [];   
  }
  getId(): number {
    return this.FixedAssetUserId;
  }
  childIndex: number;
  isExtended: boolean;
  isChecked: boolean;
  isVisible: boolean;
  FixedAssetUserId: number;
  UserId: number;
  FixedAssetId: number;
  FixedAssets: FixedAsset;
  User: User;
  UserIds : number[];  
  IsCreateDebitForm: boolean;
}
