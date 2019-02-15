import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent implements OnInit {
  

  constructor(protected baseService:BaseService) {
    super(baseService);
   }
   
  ngOnInit() {
  }

}
