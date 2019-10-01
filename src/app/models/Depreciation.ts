import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { FixedAsset } from './FixedAsset';
import { DepreciationCalculationType } from './DepreciationCalculationType';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export class Depreciation implements IData {
    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.DepreciationId;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    DepreciationId: number;
    DecreciationCalculationTypeId: number;
    FixedAssetId: number;
    EndDate: string;
    Rate: number;
    Value: number;
    AccumulatedValue: number;
    RevaluatedValue: number;
    Nddvalue: number;
    CreationDate: Date;
    CreatorId: number;
    IsValid: boolean;
    DecreciationCalculationType: DepreciationCalculationType[];
    FixedAssets: FixedAsset[];
    TargetDate: NgbDate;
}
