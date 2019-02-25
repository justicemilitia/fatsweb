import { Component, OnInit,NgModule } from '@angular/core';
import {
  NgForm,
  ReactiveFormsModule,
  FormGroup,
  NgModel
} from "@angular/forms";
import { BaseComponent } from '../../base/base.component';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-role-authorization',
  templateUrl: './role-authorization.component.html',
  styleUrls: ['./role-authorization.component.css']
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [RoleAuthorizationComponent],
  providers: [RoleAuthorizationComponent]
})

export class RoleAuthorizationComponent extends BaseComponent implements OnInit {

  constructor(protected baseService: BaseService) {
    super(baseService);
   }

  ngOnInit() {
  }

}
