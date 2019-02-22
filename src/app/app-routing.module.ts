import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CompanyComponent } from "./components/definitions/company/company.component";
import { LoginComponent } from "./components/login/login.component";
import { UserComponent } from "./components/definitions/user/user.component";
import { AuthGuard } from "./services/authguard/auth.guard";
import * as pages from "./declarations/page-values";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DepartmentComponent } from './components/definitions/department/department.component';
import { LocationComponent } from './components/definitions/location/location.component';
import { FixedAssetCardCategoryComponent } from './components/definitions/fixed-asset-card-category/fixed-asset-card-category.component';
import { FixedAssetCardComponent } from './components/definitions/fixed-asset-card/fixed-asset-card.component';
import { AgreementComponent } from './components/definitions/agreement/agreement.component';
import { FixedAssetCardBrandComponent } from './components/definitions/fixed-asset-card-brand/fixed-asset-card-brand.component';
import { FixedAssetCardModelComponent } from './components/definitions/fixed-asset-card-model/fixed-asset-card-model.component';

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_LOGIN },
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_DASHBOARD }
  },
  {
    path: "company",
    component: CompanyComponent,
    //canActivate: [AuthGuard],    
    data: { pageKeyword: pages.MENU_COMPANYDEFINITONS }
  },
  {
    path: "user",
    component: UserComponent,
    data: { pageKeyword: pages.MENU_USERDEFINITIONS }
    // canActivate: [AuthGuard]
  },
  {
    path: "location",
    component: LocationComponent,
    data: { pageKeyword: pages.MENU_LOCATIONDEFINITIONS }
    // canActivate: [AuthGuard]
  },
  {
    path: "department",
    component: DepartmentComponent,
    data: { pageKeyword: pages.MENU_DEPARTMENTSDEFINITIONS }
    // canActivate: [AuthGuard]
  },
  {
    path: "fixedassetcard",
    component: FixedAssetCardComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDDEFINITIONS }
    // canActivate: [AuthGuard]
  },
  {
    path: "fixedassetcardcategory",
    component: FixedAssetCardCategoryComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDCATEGORYDEFINITIONS }
    // canActivate: [AuthGuard]
  },
  {
    path: "agreement",
    component: AgreementComponent,
    data: { pageKeyword: pages.MENU_AGREEMENTS }
    // canActivate: [AuthGuard]
  },
  {
    path: "fixedassetcardbrand",
    component: FixedAssetCardBrandComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDBRANDS }
    // canActivate: [AuthGuard]
  },
  {
    path: "fixedassetcardmodel",
    component: FixedAssetCardModelComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDMODELS }
    // canActivate: [AuthGuard]
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
