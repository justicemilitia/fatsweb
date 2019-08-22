import { ConsumableCard } from './ConsumableCard';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { FixedAssetPropertyDetails } from './FixedAssetPropertyDetails';
import { Consumable } from './Consumable';
import { User } from './User';
import { ConsumableCategory } from './ConsumableCategory';
import { Location } from './Location';

export class ConsumableRequest  implements IData{

    getParentId(): number {
        return null;        
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
       return this.ConsumableUnitId;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

     ConsumableLogId: number;
     ConsumableLogTypeId: number;
     ConsumableId: number;
     ConsumableParentId: number;
     ConsumableCategoryId: number;
     ConsumableCardId: number;
     ConsumableLocationId: number;
     ConsumableDepartmentId: number;
     Number: number;
     UserId: number;
     FirmId: number;
     CompanyId: number;
     OldAmount: number;
     RequestedAmount: number;
     RecievedAmount: number;
     FreeEnterAmount: number;
     FreeExitAmount: number;
     NewAmount:  number;
     ConsumableUnitId: number;
     ConsumableLogDate: Date;
     IsSendMail: boolean;
     Description: string;
     ConsumableLogTypeDescription: string;
     ConsumableCardName: string;
     DepartmentName: string;
     UserMail: string;
     LastName: string;
     FirstName: string;
     ConsumableCategoryName: string;
     LocationName: string;
     TotalCount: number;
     IsValid: boolean;
     ReceivedUserId: number;

     User:User;
     FixedAssetPropertyDetails: FixedAssetPropertyDetails[];
     Consumable:Consumable;
     ConsumableCategory:ConsumableCategory;
     ConsumableCard:ConsumableCard;
     ConsumableLocation:Location;
}
