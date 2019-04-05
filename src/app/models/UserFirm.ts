import { Firm } from './Firm';
import { User } from './User';

export class UserFirm {
  UserAuthorizedFirmId: number;
  UserId: number;
  FirmId: number;
  Firm:Firm[];
  User:User[];
}
