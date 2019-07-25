import { Component, OnInit, NgModule, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseService } from '../../services/base.service';
import { BaseComponent } from '../base/base.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/common'; 
import * as $ from "jquery";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [PopupComponent],
  providers: [PopupComponent]
})
export class PopupComponent extends BaseComponent implements OnInit {

  @Input() errorMessage: string ;
  error: string;
  
  constructor(public baseService: BaseService) {
    super(baseService);
    this.error=this.errorMessage;
  }

  ngOnInit() {
  }

}