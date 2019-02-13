import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from './services/base.service';
import { BaseComponent } from './components/base/base.component';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent extends BaseComponent {
  constructor(private httpClient: HttpClient,public baseService:BaseService) {
    super(baseService);
  }

  title = "fats-web-spa";
}
