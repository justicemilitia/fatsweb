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
import { RoleAuthorizationComponent } from './components/definitions/role-authorization/role-authorization.component';
import { CheckOutReasonsComponent } from './components/definitions/check-out-reasons/check-out-reasons.component';
import { FixedAssetCardCategoryComponent } from './components/definitions/fixed-asset-card-category/fixed-asset-card-category.component';
import { FixedAssetCardComponent } from './components/definitions/fixed-asset-card/fixed-asset-card.component';
import { AgreementComponent } from './components/definitions/agreement/agreement.component';
import { FixedAssetCardBrandComponent } from './components/definitions/fixed-asset-card-brand/fixed-asset-card-brand.component';
import { FixedAssetCardModelComponent } from './components/definitions/fixed-asset-card-model/fixed-asset-card-model.component';
import { RoleComponent } from './components/definitions/role/role.component';
import{ RoleUserComponent} from './components/definitions/role-user/role-user.component';
import { FixedAssetComponent } from './components/operations/fixed-asset/fixed-asset.component';
import { FixedAssetStatusComponent } from './components/definitions/fixed-asset-status/fixed-asset-status.component';
import { FixedAssetCardPropertyComponent } from './components/definitions/fixed-asset-card-property/fixed-asset-card-property.component';
import { SuspensionComponent } from './components/definitions/suspension/suspension.component';
import { SuspendedFixedAssetComponent } from './components/operations/suspended-fixed-asset/suspended-fixed-asset.component';
import { LostFixedAssetComponent } from './components/operations/lost-fixed-asset/lost-fixed-asset.component';
import { CheckoutFixedAssetComponent } from './components/operations/checkout-fixed-asset/checkout-fixed-asset.component';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
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
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_USERDEFINITIONS }
  },
  {
    path: "location",
    component: LocationComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_LOCATIONDEFINITIONS }
  },
  {
    path: "department",
    component: DepartmentComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_DEPARTMENTSDEFINITIONS }
  },
  {
    path: "fixedassetcard",
    component: FixedAssetCardComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDDEFINITIONS }
  },
  {
    path: "fixedassetcardcategory",
    component: FixedAssetCardCategoryComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDCATEGORYDEFINITIONS }
  },
  {
    path: "agreement",
    component: AgreementComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_AGREEMENTS }
  },
  {
    path: "fixedassetcardbrand",
    component: FixedAssetCardBrandComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDBRANDDEFINITIONS }
  },
  {
    path: "fixedassetcardmodel",
    component: FixedAssetCardModelComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDMODELS }
  },
  {
    path: "expensecenter",
    component: ExpenseCenterComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_EXPENSECENTERDEFINITIONS }
  },
  {
    path: "checkedoutreason",
    component: CheckOutReasonsComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_CHECKOUTREASONDEFINITIONS }
  },
  {
    path: "suspension",
    component: SuspensionComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_SUSPENSION }
  },
  {
    path: "status",
    component: FixedAssetStatusComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_STATUSLIST }
  },
  {
    path: "role",
    component: RoleComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_ROLEDEFINITIONS}
  },
  {
    path: "roleuser",
    component: RoleUserComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_ROLEDEFINITIONS}
  },
  {
    path: "roleauthorization",
    component: RoleAuthorizationComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_ROLEAUTHORIZATIONDEFINITIONS}
  },
  {
    path: "fixedassetcard",
    component: FixedAssetCardComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDDEFINITIONS}
  },
  {
    path: "fixedassetcardcategory",
    component: FixedAssetCardCategoryComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDCATEGORYDEFINITIONS}
  },
  {
    path: "fixedassetcardproperty",
    component: FixedAssetCardPropertyComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDPROPERTYDEFINITIONS}
  },
  {
    path: "fixedassetcardbrand",
    component: FixedAssetCardBrandComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDBRANDDEFINITIONS}
  },
  {
    path: "model",
    component: FixedAssetCardModelComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDMODELS}
  },
  {
    path: "fixedasset",
    component: FixedAssetComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSET}
    // //canActivate: [AuthGuard]
  },
  {
    path: "suspendedfixedasset",
    component: SuspendedFixedAssetComponent,
    data: { pageKeyword: pages.MENU_SUSPENDEDFIXEDASSET}
    // //canActivate: [AuthGuard]
  },
  {
    path: "lostfixedasset",
    component: LostFixedAssetComponent,
    data: { pageKeyword: pages.MENU_LOSTFIXEDASSET}
    // //canActivate: [AuthGuard]
  },
  {
    path: "checkoutfixedasset",
    component: CheckoutFixedAssetComponent,
    data: { pageKeyword: pages.MENU_CHECKOUTFIXEDASSET}
    // //canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
