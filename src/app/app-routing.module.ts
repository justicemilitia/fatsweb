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
import { ExpenseCenterComponent } from './components/definitions/expense-center/expense-center.component';
import { CheckOutReason } from './models/CheckOutReason';
import RoleAuthorization from './models/RoleAuthorization';
import { RoleAuthorizationComponent } from './components/definitions/role-authorization/role-authorization.component';
import { CheckOutReasonsComponent } from './components/definitions/check-out-reasons/check-out-reasons.component';
import { FixedAssetCardCategoryComponent } from './components/definitions/fixed-asset-card-category/fixed-asset-card-category.component';
import { FixedAssetCardComponent } from './components/definitions/fixed-asset-card/fixed-asset-card.component';
import { AgreementComponent } from './components/definitions/agreement/agreement.component';
import { FixedAssetCardBrandComponent } from './components/definitions/fixed-asset-card-brand/fixed-asset-card-brand.component';
import { FixedAssetCardModelComponent } from './components/definitions/fixed-asset-card-model/fixed-asset-card-model.component';
import { RoleComponent } from './components/definitions/role/role.component';

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
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDBRANDDEFINITIONS }
    // canActivate: [AuthGuard]
  },
  {
    path: "fixedassetcardmodel",
    component: FixedAssetCardModelComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDMODELS }
    // canActivate: [AuthGuard]
  },
  {
    path: "expensecenter",
    component: ExpenseCenterComponent,
    data: { pageKeyword: pages.MENU_EXPENSECENTERDEFINITIONS }
    // canActivate: [AuthGuard]
  },
  {
    path: "checkedoutreason",
    component: CheckOutReasonsComponent,
    data: { pageKeyword: pages.MENU_CHECKOUTREASONDEFINITIONS }
    // canActivate: [AuthGuard]
  },
  {
    path: "role",
    component: RoleComponent,
    data: { pageKeyword: pages.MENU_ROLEDEFINITIONS}
    // canActivate: [AuthGuard]
  },
  {
    path: "roleauthorization",
    component: RoleAuthorizationComponent,
    data: { pageKeyword: pages.MENU_ROLEAUTHORIZATIONDEFINITIONS}
    // canActivate: [AuthGuard]
  },
  {
    path: "fixedassetcard",
    component: FixedAssetCardComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDDEFINITIONS}
    // canActivate: [AuthGuard]
  },
  {
    path: "fixedassetcardcategory",
    component: FixedAssetCardCategoryComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDCATEGORYDEFINITIONS}
    // canActivate: [AuthGuard]
  },
  {
    path: "fixedassetcardbrand",
    component: FixedAssetCardBrandComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDBRANDDEFINITIONS}
    // canActivate: [AuthGuard]
  },
  {
    path: "model",
    component: FixedAssetCardModelComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDMODELS}
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
