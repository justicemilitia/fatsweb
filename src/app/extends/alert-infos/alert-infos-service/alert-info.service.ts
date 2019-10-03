import { Injectable } from '@angular/core';
import { AlertInfo } from '../models/AlertInfo';
import { AlertInfoTypes } from '../models/enums/AlertInfoTypes';
import { BaseService } from '../../../services/base.service';

@Injectable({
  providedIn: 'root'
})
export class AlertInfoService {

  constructor() {}

  infos: AlertInfo[] = [];


  push(culture: string, type: AlertInfoTypes, message: string, title: string = '') {
    let alert = new AlertInfo(culture, type, message);
    this.infos.push(alert);
  }

  pushInfo(culture: string, message: string, title: string = '') {
    let alert = new AlertInfo(culture, AlertInfoTypes.info, message,);
    this.infos.push(alert);
  }

  pushWarning(culture: string, message: string, title: string = '') {
    let alert = new AlertInfo(culture, AlertInfoTypes.warning, message);
    this.infos.push(alert);
  }

  pushSuccess(culture: string, message: string, title: string = '') {
    let alert = new AlertInfo(culture, AlertInfoTypes.success, message);
    this.infos.push(alert);
  }

  pushDanger(culture: string, message: string, title: string = '') {
    let alert = new AlertInfo(culture, AlertInfoTypes.danger, message);
    this.infos.push(alert);
  }

  popInfo(info: AlertInfo) {
    let index = this.infos.indexOf(info);
    if (index > -1)
      this.infos.splice(index, 1);
  }

}
