import { ConsumableCard } from './ConsumableCard';
import { ConsumableCategory } from './ConsumableCategory';
import { ConsumableUnit } from './ConsumableUnit';
import { FixedAssetPropertyDetails } from './FixedAssetPropertyDetails';

export class Consumable{
    ConsumableId:number;
    ConsumableCardId: number;
    ConsumableParentId: number;  
    ConsumableModelId: number;
    CompanyId: number;
    ConsumableLocationId: number;
    ConsumableAmount: number;
    ConsumableCategoryId:number;
    Description:string;
    ConsumableCard:ConsumableCard;
    ConsumableCategory: ConsumableCategory;
    ConsumableUnits: ConsumableUnit;
    FixedAssetPropertyDetails: FixedAssetPropertyDetails;
}