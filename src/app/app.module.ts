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
import { DepartmentComponent } from "./components/definitions/department/department.component";
import { LocationComponent } from "./components/definitions/location/location.component";
import { FixedAssetComponent } from "./components/definitions/fixed-asset/fixed-asset.component";
import { FixedAssetCategoryComponent } from "./components/definitions/fixed-asset-category/fixed-asset-category.component";
import { AuthGuard } from "./services/authguard/auth.guard";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CountryComponent } from './components/definitions/country/country.component';
import { CityComponent } from './components/definitions/city/city.component';
import { TreeGridTablePage } from './pipes/TreeGridTablePage';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    CompanyComponent,
    UserComponent,
    DepartmentComponent,
    LocationComponent,
    DashboardComponent,
    CountryComponent,
    CityComponent,
    FixedAssetComponent,
    FixedAssetCategoryComponent,
    DashboardComponent,
    TreeGridTablePage
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
