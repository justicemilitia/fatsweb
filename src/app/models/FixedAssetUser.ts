import { FixedAsset } from './FixedAsset';
import { User } from './User';

export class FixedAssetUser {
  FixedAssetUserId: number;
  UserId: number;
  FixedAssetId: number;
  FixedAssets: FixedAsset;
  User: User;
  UserIds : number[];  
  IsCreateDebitForm: boolean;
}
