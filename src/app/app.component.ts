import { Component, SimpleChanges, DoCheck } from "@angular/core";
import { BaseService } from './services/base.service';
import { BaseComponent } from './components/base/base.component';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent extends BaseComponent implements DoCheck {

  ngDoCheck(): void {
    if (!this.isLogged() && this.baseService.authenticationService.getToken()) {
      this.baseService.authenticationService.logOut();
    }
  }

  constructor(public baseService: BaseService) {
    super(baseService);
  }

  title = "fats-web-spa";
}
