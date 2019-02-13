export class Role {
    roleId: number;
    name: string;
    description: string;
    creationDate:Date;
    creatorId: number;
    modifiedDate: Date;
    modifiedId: number;
    isActive: boolean;
    roleAuthorizations: string; //RoleAuthorization nesnesi gelecek
    userRoles: string; // UserRole nesnesi gelecek
}
