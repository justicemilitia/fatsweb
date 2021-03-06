import { ConsumableCard } from './ConsumableCard';
import { ConsumableCategory } from './ConsumableCategory';
import { ConsumableUnit } from './ConsumableUnit';
import { FixedAssetPropertyDetails } from './FixedAssetPropertyDetails';
import { FixedAssetCardModel } from './FixedAssetCardModel';
import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { User } from './User';

export class Consumable implements IData{
    getParentId(): number {
        return this.ConsumableParentId;
    }
    getChildren(): IData[] {
        return this.InverseConsumableParent;
    }
    getId(): number {
        return this.ConsumableId;
    }

    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    ConsumableId:number;
    ConsumableCardId: number;
    ConsumableParentId: number;  
    ConsumableModelId: number;
    CompanyId: number;
    ConsumableLocationId: number;
    ConsumableAmount: number;
    ConsumableCategoryId:number;
    Number:number;
    ReceivedUserId:number;
    ReceivedDepartmentId:number;
    FreeExitAmount:number;
    NewAmount:number;
    ConsumableCard:ConsumableCard;
    ConsumableCategory: ConsumableCategory;
    ConsumableUnits: ConsumableUnit;
    FixedAssetCardModel:FixedAssetCardModel;
    ConsumableParent:Consumable;
    InverseConsumableParent : Consumable[];    
    FixedAssetPropertyDetails: FixedAssetPropertyDetails[];
    User: User;
    Description:string;
    Page:number;
    PerPage:number;
    

    ConsumableCategoryIds:number[];
    ConsumableCardIds:number[];
    ConsumableLocationIds:number[];
    FixedAssetPropertyArray:FixedAssetPropertyDetails[];


    constructor(){
        this.InverseConsumableParent = [];

        this.FixedAssetPropertyDetails=[];

        this.ConsumableCard=new ConsumableCard();
        
    }
}