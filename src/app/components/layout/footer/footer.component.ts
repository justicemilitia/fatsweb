import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent extends BaseComponent implements OnInit {

  constructor(protected baseService:BaseService) {
    super(baseService);
   }

  ngOnInit() {
  }

}
