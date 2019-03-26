import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AlertInfo } from '../models/AlertInfo';
import { AlertInfoTypes } from '../models/enums/AlertInfoTypes';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { AlertInfoService } from '../alert-infos-service/alert-info.service';

@Component({
  selector: 'app-alert-infos',
  templateUrl: './alert-infos.component.html',
  styleUrls: ['./alert-infos.component.css'],
  animations: [
    trigger('openClose', [
      state('enter', style({ transform: 'translateX(0)' })),
      state('in', style({})),
      state('leave', style({ transform: 'translateX(130%)' })),
      transition('* => enter', [
        animate('500ms')
      ]),
      transition('enter => in', [
        animate('8s')
      ]),
      transition('in => leave', [
        animate('500ms')
      ])
    ])
  ]
})

export class AlertInfosComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
  }

  infos: AlertInfo[] = [];

  constructor(private alertInfoService: AlertInfoService) {
  }

  ngOnInit() {

  }

  animationStarted(event, info: AlertInfo) {
    // For Now empty
  }

  animationDone(event, info: AlertInfo) {
    if (event.toState == 'enter') {
      info.state = 'in';
    } else if (event.toState == 'in') {
      info.state = 'leave';
    } else if (event.toState == 'leave') {
      this.alertInfoService.popInfo(info);
    }
  }

}
