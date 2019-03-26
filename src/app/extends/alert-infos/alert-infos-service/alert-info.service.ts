import { Injectable } from '@angular/core';
import { AlertInfo } from '../models/AlertInfo';
import { AlertInfoTypes } from '../models/enums/AlertInfoTypes';

@Injectable({
  providedIn: 'root'
})
export class AlertInfoService {

  constructor() { }

  infos: AlertInfo[] = [];

  push(type: AlertInfoTypes, message: string, title: string = '') {
    let alert = new AlertInfo(type, message);
    this.infos.push(alert);
  }

  pushInfo(message: string, title: string = '') {
    let alert = new AlertInfo(AlertInfoTypes.info, message);
    this.infos.push(alert);
  }

  pushWarning(message: string, title: string = '') {
    let alert = new AlertInfo(AlertInfoTypes.warning, message);
    this.infos.push(alert);
  }

  pushSuccess(message: string, title: string = '') {
    let alert = new AlertInfo(AlertInfoTypes.success, message);
    this.infos.push(alert);
  }

  pushDanger(message: string, title: string = '') {
    let alert = new AlertInfo(AlertInfoTypes.danger, message);
    this.infos.push(alert);
  }

  popInfo(info: AlertInfo) {
    let index = this.infos.indexOf(info);
    if (index > -1)
      this.infos.splice(index, 1);
  }

}
