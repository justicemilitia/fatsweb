import { IData } from "../extends/TreeGridTable/models/interfaces/IData";

export class Menu implements IData {
  getParentId(): number {
    return null;
  }
  getChildren(): IData[] {
    return [];
  }
  getId(): number {
    return this.MenuId;
  }

  childIndex: number;
  isExtended: boolean;
  isChecked: boolean;
  isVisible: boolean;
  IsAuthorized: string;
  FirmId: number;
  Description: string;
  ParentMenuId: number;
  MenuId: number;
  Name: string;
  IsValid: boolean;
  ParentMenu: Menu;
  InverseParentMenu: Menu[];

  constructor() {
    this.InverseParentMenu = [];
  }


}
