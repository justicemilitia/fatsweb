import { HttpErrorResponse } from '@angular/common/http';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export const getAnErrorResponse = (message: string): HttpErrorResponse => {
    let response: HttpErrorResponse = new HttpErrorResponse({
        status: 400,
        statusText: message == 'Unknown Error' ? 'Bağlantı Hatası' : message
    });
    return response;
}

/**
 * Convert date to ngb date
 * @param value 
 */
export const convertDateToNgbDate = (value: any):NgbDate => {
    
    if (value) {
        if (value.includes('/')) {
            value = value.substring(0, 10).split('/');
            value = new NgbDate(Number(value[2]),Number(value[0]),Number(value[1]));
            return value;
        }
        else if(value.includes('.')){
            value = value.substring(0, 10).split('.');
            value = new NgbDate(Number(value[2]),Number(value[1]),Number(value[0]));
            return value;
        }
        else {

            value = value.substring(0, 10).split('-');
            value = new NgbDate(Number(value[0]),Number(value[1]),Number(value[2]));
            return value;

        }
    }

    return null;
}

/**
 * Convert Ngb Boostrap Date To String
 * @param value 
 */
export const convertNgbDateToDateString = (value:NgbDate):any => {
    if (value) {
        return  value.year.toString() + "-" 
                + (value.month < 10 ? "0" + value.month.toString() : value.month.toString())  + "-" 
                + (value.day < 10 ? "0" + value.day.toString() : value.day.toString()) 
                + "T" + "00:00:00";
    }
    return null;
}

/**
 * Convert date to ngb date
 * @param value 
 */
export const getToday = ():NgbDate => {
   
    let today=new Date();
    return convertDateToNgbDate(today.toLocaleDateString("tr-TR"));
}
