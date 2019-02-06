import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {FormsModule} from "@angular/forms";

import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import {LayoutComponent} from "./layout.component";


@NgModule({
  imports: [CommonModule,
  FormsModule],
  exports: [LayoutComponent],
  declarations: [HeaderComponent, FooterComponent,LayoutComponent  ]
})
export class LayoutModule {}
