import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { FixedAsset } from './FixedAsset';
import { DepreciationCalculationType } from './DepreciationCalculationType';

export class DepreciationIFRS implements IData {
    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.DepreciationIFRSId;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    DepreciationIFRSId: number;
    // DecreciationCalculationTypeId: number;
    FixedAssetId: number;
    EndDate: number;
    Rate: number;
    Value: number;
    RevaluatedValue: number;
    NDDValue: number;
    CreationDate: Date;
    CreatorId: number;
    IsValid: boolean;
    DecreciationCalculationType: DepreciationCalculationType[];
    FixedAssets: FixedAsset[];
}
