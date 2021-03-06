import { Component, SimpleChanges, DoCheck, AfterViewInit, enableProdMode } from "@angular/core"; enableProdMode();
import { BaseService } from './services/base.service';
import { BaseComponent } from './components/base/base.component';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent extends BaseComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    if (!this.isLogged() && this.baseService.authenticationService.getToken()) {
      this.baseService.authenticationService.logOut();
    }
  }


  constructor(public baseService: BaseService) {
    super(baseService);  
    
  }

  title = "fats-web-spa";
}
