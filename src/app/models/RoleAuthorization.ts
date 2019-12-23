import { Role } from './Role';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { Menu } from './Menu';

export default class RoleAuthorization implements IData{
  getParentId(): number {
  return this.Menu.ParentMenuId;
  }
  getChildren(): IData[] {
   return this.Menu.InverseParentMenu;
  }
  getId(): number {
    return this.MenuId;
  }
  childIndex: number;
  isExtended: boolean;
  isChecked: boolean;
  isVisible: boolean;
  UserId: number;
  RoleId: number;
  
  RoleAuthorizationId:number;
  OutBrowse: boolean=false;
  OutUpdate: boolean=false;
  OutInsert: boolean=false;
  OutDelete: boolean=false;
  FirmId: number;
  MenuId: number;
  MenuCaption:string;
  Role:Role;
  Menu:Menu;


  constructor(){  
    this.Role=new Role();
  }
}
