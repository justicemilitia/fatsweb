import { Role } from "./Role";
import { User } from "./User";
import { IData } from "../extends/TreeGridTable/models/interfaces/IData";

export class UserRole implements IData {
  getParentId(): number {
    return null;
  }
  getChildren(): IData[] {
    return [];
  }
  getId(): number {
    return this.UserRoleId;
  }
  childIndex: number;
  isExtended: boolean;
  isChecked: boolean;
  isVisible: boolean;

  UserRoleId: number;
  UserId: number;
  RoleId: number;
  Role: Role;
  User: User;
  
  constructor(){
    this.Role=new Role();
  }
}
