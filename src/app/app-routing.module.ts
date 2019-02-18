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
import { FixedAssetCategoryComponent } from './components/definitions/fixed-asset-category/fixed-asset-category.component';
import { FixedAssetComponent } from './components/definitions/fixed-asset/fixed-asset.component';

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
    data: { pageKeyword: pages.MENU_DEPARTMENTSDEFINITION }
    // canActivate: [AuthGuard]
  },
  {
    path: "fixedassetcategory",
    component: FixedAssetComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSETDEFINITIONS }
    // canActivate: [AuthGuard]
  },
  {
    path: "fixedasset",
    component: FixedAssetCategoryComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSETCATEGORYDEFINITIONS }
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
