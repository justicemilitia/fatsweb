import { Firm } from './Firm';

export class UserLogin {
    UserMail: string;
    Password: string;
    FirmId: number;
    Firm: Firm;

    constructor() {
        this.Firm = new Firm();
        this.FirmId = -1;
    }

}