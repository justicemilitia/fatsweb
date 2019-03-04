import { HttpErrorResponse } from '@angular/common/http';

export const getAnErrorResponse = (message: string): HttpErrorResponse => {
    let response: HttpErrorResponse = new HttpErrorResponse({
        status: 400,
        statusText: message
    });
    return response;
}