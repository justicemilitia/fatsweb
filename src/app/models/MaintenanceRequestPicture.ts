import { IData } from '../extends/TreeGridTable/models/interfaces/IData';

export class MaintenanceRequestPicture implements IData {
    getParentId(): number {
        return null;
    }
    getChildren(): IData[] {
        return [];
    }
    getId(): number {
        return this.MaintenanceRequestPictureId;
    }

    childIndex: number;
    isExtended: boolean;
    isChecked: boolean;
    isVisible: boolean;
    
    MaintenanceRequestPictureId: number;
    MaintenanceListId: number;
    Picture: string;

}
