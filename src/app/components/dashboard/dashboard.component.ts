import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  constructor(public baseService:BaseService) { 
    super(baseService);
  }

  ngOnInit() {
<<<<<<< HEAD
    
=======
>>>>>>> 6417d0c947e1c1c7df37bec11d8a1c780be5ce24
  }

}
