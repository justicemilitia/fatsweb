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
import { FixedAssetCardComponent } from "./components/definitions/fixed-asset-card/fixed-asset-card.component";
import { FixedAssetCardCategoryComponent } from "./components/definitions/fixed-asset-card-category/fixed-asset-card-category.component";
import { AuthGuard } from "./services/authguard/auth.guard";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CountryComponent } from './components/definitions/country/country.component';
import { CityComponent } from './components/definitions/city/city.component';
import { AgreementComponent } from './components/definitions/agreement/agreement.component';
import { FixedAssetCardBrandComponent } from './components/definitions/fixed-asset-card-brand/fixed-asset-card-brand.component';
import { FixedAssetCardModelComponent } from './components/definitions/fixed-asset-card-model/fixed-asset-card-model.component';
import { TreeGridTablePage } from './pipes/TreeGridTablePage';
import { TreeGridTableComponent } from './components/tgt/tree-grid-table/tree-grid-table.component';
import { TreeGridTableHeaderComponent } from './components/tgt/tree-grid-table-header/tree-grid-table-header.component';
import { TreeGridTableBodyComponent } from './components/tgt/tree-grid-table-body/tree-grid-table-body.component';
import { TreeGridTablePaginationComponent } from './components/tgt/tree-grid-table-pagination/tree-grid-table-pagination.component';
import { TreeGridTableHelperComponent } from './components/tgt/tree-grid-table-helper/tree-grid-table-helper.component';


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
    FixedAssetCardComponent,
    FixedAssetCardCategoryComponent,
    DashboardComponent,
    AgreementComponent,
    FixedAssetCardBrandComponent,
    FixedAssetCardModelComponent,
    TreeGridTablePage,
    TreeGridTableComponent,
    TreeGridTableHeaderComponent,
    TreeGridTableBodyComponent,
    TreeGridTablePaginationComponent,
    TreeGridTableHelperComponent
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
