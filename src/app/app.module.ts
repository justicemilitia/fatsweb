import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
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
import { FixedAssetCardComponent } from "./components/definitions/fixed-asset-card/fixed-asset-card.component";
import { FixedAssetCardCategoryComponent } from "./components/definitions/fixed-asset-card-category/fixed-asset-card-category.component";
import { AuthGuard } from "./services/authguard/auth.guard";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CountryComponent } from './components/definitions/country/country.component';
import { CityComponent } from './components/definitions/city/city.component';
import { ExpenseCenterComponent } from './components/definitions/expense-center/expense-center.component';
import { CheckOutReasonsComponent } from './components/definitions/check-out-reasons/check-out-reasons.component';
import { RoleAuthorizationComponent } from './components/definitions/role-authorization/role-authorization.component';
import { AgreementComponent } from './components/definitions/agreement/agreement.component';
import { FixedAssetCardBrandComponent } from './components/definitions/fixed-asset-card-brand/fixed-asset-card-brand.component';
import { FixedAssetCardModelComponent } from './components/definitions/fixed-asset-card-model/fixed-asset-card-model.component';
import { TreeGridTablePage } from './extends/TreeGridTable/pipes/TreeGridTablePage';
import { TreeGridTableComponent } from './extends/TreeGridTable/components/tree-grid-table/tree-grid-table.component';
import { RoleComponent } from './components/definitions/role/role.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    UserComponent,
    CompanyComponent,
    DepartmentComponent,
    LocationComponent,
    DashboardComponent,
    CountryComponent,
    CityComponent,
    DashboardComponent,
    ExpenseCenterComponent,
    CheckOutReasonsComponent,
    RoleAuthorizationComponent,
    FixedAssetCardComponent,
    FixedAssetCardCategoryComponent,
    DashboardComponent,
    AgreementComponent,
    FixedAssetCardBrandComponent,
    FixedAssetCardModelComponent,
    TreeGridTablePage,
    TreeGridTableComponent,
    RoleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpModule,
    CommonModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
