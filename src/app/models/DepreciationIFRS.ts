import { IData } from '../extends/TreeGridTable/models/interfaces/IData';
import { FixedAsset } from './FixedAsset';
import { DepreciationCalculationType } from './DepreciationCalculationType';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export class DepreciationIFRS implements IData {
    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.DepreciationIfrsid;
    }
    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;

    DepreciationIfrsid: number;
    // DecreciationCalculationTypeId: number;
    FixedAssetId: number;
    EndDate: NgbDate;
    Rate: number;
    Value: number;
    RevaluatedValue: number;
    UsefulMonths: number;
    Nddvalue: number;
    CreationDate: Date;
    CreatorId: number;
    IsValid: boolean;
    // DecreciationCalculationType: DepreciationCalculationType[];
    FixedAssets: FixedAsset[];
    TargetDate: NgbDate;    
}
