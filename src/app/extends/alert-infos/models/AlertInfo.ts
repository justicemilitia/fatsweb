import { getInfoTitle } from '../extends/alert-info-values';
import { AlertInfoTypes } from './enums/AlertInfoTypes';

export class AlertInfo {

    messageType: AlertInfoTypes;
    message: string;
    title?: string;
    state: string;
    constructor(messageType: AlertInfoTypes, message: string, title: string = '') {
        this.messageType = messageType;
        this.message = message;
        this.state = 'enter';
        if (title == '')
            this.title = getInfoTitle(this.messageType);
    }

}

