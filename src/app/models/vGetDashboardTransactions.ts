export default class vGetDashboardTransactions {
    TType:number;
    TId:number;
    TTId:number;
    TTitle:string;
    TUser:string;
    TDate:number; // as minute

    get getDate():string {
        if (this.TDate) {
            if (this.TDate >= 60)
                return Math.floor(this.TDate / 60) + 'sa önce';
            else
                return this.TDate + 'dk önce';
        }else {
            return 'az önce';
        }
    }

}