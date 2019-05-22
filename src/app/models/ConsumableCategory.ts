import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { ConsumableCard } from './ConsumableCard';

export class ConsumableCategory implements IData {
    getParentId(): number {
    return this.ConsumableParentCategoryId;
    }
    getChildren(): IData[] {
    return this.InverseConsumableParentCategory;       
    }
    getId(): number {
    return this.ConsumableCategoryId;      
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    ConsumableCategoryId: number;
    ConsumableParentCategoryId: number;
    ConsumableCategoryCode: string;
    ConsumableCategoryName: string;
    CreationDate: Date;
    CreatorId: number;
    ModifiedDate: Date;
    ModifierId: number;
    IsValid: boolean;
    ConsumableCategoryIds: number[];
    ConsumableParentCategory: ConsumableCategory;
    ConsumableCards: ConsumableCard[]=[];
    InverseConsumableParentCategory: ConsumableCategory[] = [];
}
