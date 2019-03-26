import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { BaseComponent } from '../../base/base.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent implements OnInit, AfterViewInit {
  
  ngAfterViewInit(): void {
    $(".az-navbar-two").trigger("click");
    this.loadFirms();
  }

  loadFirms() {
    this.baseService.authenticationService.getUserFirmListWithoutParams();
  }

  constructor(public baseService: BaseService) {
    super(baseService);
    
  }

  ngOnInit() {
  }

  logout() {
    this.baseService.authenticationService.logOut();
    this.baseService.router.navigateByUrl("/login");
  }

}
