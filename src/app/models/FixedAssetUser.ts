import { FixedAsset } from './FixedAsset';
import { User } from './LoginUser';

export class FixedAssetUser {
  FixedAssetUserId: number;
  UserId: number;
  FixedAssetId: number;
  FixedAssets: FixedAsset;
  Users: User;
  UserIds : number[];  
}
