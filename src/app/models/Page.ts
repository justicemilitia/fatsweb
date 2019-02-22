import { IPage } from './interfaces/IPage';

export class Page implements IPage {
    value: number;
    display: string;
    isDisabled: boolean;
    isActive: boolean;
}