import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FaGeneralInformationComponent } from '../fa-general-information/fa-general-information.component';
import { FaCreateComponent } from '../fa-create.component';

@Component({
  selector: 'app-fa-reset-form',
  templateUrl: './fa-reset-form.component.html',
  styleUrls: ['./fa-reset-form.component.css']
})
export class FaResetFormComponent implements OnInit {

  @ViewChild(FaGeneralInformationComponent) resetGeneral:FaGeneralInformationComponent;
  @Input() faCreate:FaCreateComponent;
  @Input() faGeneral:FaGeneralInformationComponent;
  
  constructor() { }

  ngOnInit() {
  }

  resetForm(){

    //this.faCreate.resetForm();

    this.resetGeneral.resetForm();
  }
}
