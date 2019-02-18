import { Component, OnInit, NgModule } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { BaseService } from 'src/app/services/base.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})

@NgModule({
  imports:[FormsModule,ReactiveFormsModule],
  declarations:[CityComponent],
  providers:[CityComponent]
})

export class CityComponent extends BaseComponent implements OnInit {

  constructor(protected baseService:BaseService) {
    super(baseService);
   }

  ngOnInit() {
  }

  onChangeCountry(countryId:number){
    if(countryId){
      this.baseService.cityService.GetCityList(countryId);
    }
  }
}
