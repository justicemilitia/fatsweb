import { Role } from './Role';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { Menu } from './Menu';

export default class RoleAuthorization implements IData{
  getParentId(): number {
  return null;
  }
  getChildren(): IData[] {
   return [];
  }
  getId(): number {
    return this.RoleAuthorizationId;
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
    this.OutBrowse=false;
    this.OutDelete=false;
    this.OutUpdate=false;
    this.OutInsert=false;
  }
}
