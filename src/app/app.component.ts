import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseComponent } from './components/base/base.component';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(private httpClient: HttpClient) {

   
  }
  title = "fats-web-spa";
  
}
