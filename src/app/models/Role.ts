export class Role {
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
