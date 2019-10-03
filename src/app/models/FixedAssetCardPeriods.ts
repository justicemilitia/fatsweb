import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { FixedAssetCard } from './FixedAssetCard';
import { PeriodTypes } from './PeriodTypes';

export class FixedAssetCardPeriods implements IData{
    getParentId(): number {
        throw new Error("Method not implemented.");
    }    getChildren(): IData[] {
        throw new Error("Method not implemented.");
    }
    getId(): number {
        throw new Error("Method not implemented.");
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    FixedAssetCardPeriodId:number;
    FixedAssetCardId:number;
    PeriodTypeId:number;
    Frequency:number;
    IsValid:boolean;

    FixedAssetCard:FixedAssetCard;
    PeriodTypes:PeriodTypes;

}