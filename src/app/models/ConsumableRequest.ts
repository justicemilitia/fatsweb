import { ConsumableCard } from './ConsumableCard';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { FixedAssetPropertyDetails } from './FixedAssetPropertyDetails';
import { Consumable } from './Consumable';
import { User } from './User';
import { ConsumableCategory } from './ConsumableCategory';
import { Location } from './Location';
import { ConsumablePropertyLog } from './ConsumablePropertyLog';

export class ConsumableRequest  implements IData{

    getParentId(): number {
        return null;        
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
       return this.ConsumableLogId;
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
     ReceivedAmount: number;     
     RequestedAmountIn: number;
     RequestedAmountOut: number;
     ReceivedAmountIn: number;
     ReceivedAmountOut: number;
     FreeEnterAmountIn: number;
     FreeEnterAmountOut: number;
     FreeExitAmountIn: number;
     FreeExitAmountOut: number;
     NewAmount:  number;
     ConsumableUnitId: number;
     ConsumableLogDate: Date;
     IsSendMail: boolean;
     Description: string;
     DescriptionArray:string;
     ConsumableLogTypeDescription: string;
     DescriptionCanceledArray:string;     
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
     RequestedUserId: number;
     ConsumableCardCode: string;
     ConsumableCardIds: number[];
     ConsumableCategoryIds: number[];
     ReceivedDepartmentIds: number[];
     ConsumableLocationIds: number[];
     RequestedUserIds: number[];
     ReceivedUserIds: number[];
     ConsumableNumber: number;
     Page: Number;
     PerPage: Number;
     StartDate: string;
     EndDate: string;
     ConsumableLogTypeIds:number[];
     ConsumablePropertyLogs: ConsumablePropertyLog[];
     User:User;
     FixedAssetPropertyDetails: FixedAssetPropertyDetails[];
     FixedAssetPropertyArray: FixedAssetPropertyDetails[];
     Consumable:Consumable;
     ConsumableCategory:ConsumableCategory;
     ConsumableCard:ConsumableCard;
     ConsumableLocation:Location;
}
