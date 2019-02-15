import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import{CommonModule} from '@angular/common';

import { routes } from "./app-routing.module";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";

import { LoginComponent } from "./components/login/login.component";
import { HeaderComponent } from "./components/layout/header/header.component";
import { FooterComponent } from "./components/layout/footer/footer.component";
import { LayoutComponent } from "./components/layout/layout.component";
import { CompanyComponent } from "./components/definitions/company/company.component";
import { UserComponent } from "./components/definitions/user/user.component";
import { AuthGuard } from "./services/authguard/auth.guard";
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    CompanyComponent,
    UserComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CommonModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
