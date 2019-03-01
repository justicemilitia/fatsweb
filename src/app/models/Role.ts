import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class Role implements IData {
    getParentId(): number {
       return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.RoleId;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;
    RoleId: number;
    Name: string;
    Description: string;
    CreationDate:Date;
    CreatorId: number;
    ModifiedDate: Date;
    ModifiedId: number;
    IsActive: boolean;
    RoleAuthorizations: string; //RoleAuthorization nesnesi gelecek
    UserRoles: string; // UserRole nesnesi gelecek
}
