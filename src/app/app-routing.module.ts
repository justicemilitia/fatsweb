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
import { RoleUserComponent } from './components/definitions/role-user/role-user.component';
import { FixedAssetComponent } from './components/operations/fixed-asset/fixed-asset.component';
import { FixedAssetStatusComponent } from './components/definitions/fixed-asset-status/fixed-asset-status.component';
import { FixedAssetCardPropertyComponent } from './components/definitions/fixed-asset-card-property/fixed-asset-card-property.component';
import { SuspensionComponent } from './components/definitions/suspension/suspension.component';
import { SuspendedFixedAssetComponent } from './components/operations/suspended-fixed-asset/suspended-fixed-asset.component';
import { LostFixedAssetComponent } from './components/operations/lost-fixed-asset/lost-fixed-asset.component';
import { CheckoutFixedAssetComponent } from './components/operations/checkout-fixed-asset/checkout-fixed-asset.component';
import { FixedAssetRelationship } from './models/FixedAssetRelationship';
import { RelationshipFixedAssetComponent } from './components/operations/relationship-fixed-asset/relationship-fixed-asset.component';
import { TransactionListComponent } from './components/operations/transaction-list/transaction-list.component';

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
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_COMPANYDEFINITIONS }
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
    data: { pageKeyword: pages.MENU_DEPARTMENTDEFINITIONS }
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
    data: { pageKeyword: pages.MENU_FIXEDASSETBRANDS }
  },
  {
    path: "fixedassetcardmodel",
    component: FixedAssetCardModelComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETMODELS }
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
    data: { pageKeyword: pages.MENU_CHECKOUTREASONLISTS }
  },
  {
    path: "suspension",
    component: SuspensionComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_CHECKOUTSUSPENDEDLIST }
  },
  {
    path: "status",
    component: FixedAssetStatusComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETSTATUS }
  },
  {
    path: "role",
    component: RoleComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_ROLEDEFINITIONS }
  },
  {
    path: "roleuser",
    component: RoleUserComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_ROLEDEFINITIONS }
  },
  {
    path: "roleauthorization",
    component: RoleAuthorizationComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_ROLEAUTHORIZATIONDEFINITIONS }
  },
  {
    path: "fixedassetcard",
    component: FixedAssetCardComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDS }
  },
  {
    path: "fixedassetcardcategory",
    component: FixedAssetCardCategoryComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETCATEGORYDEFINITIONS }
  },
  {
    path: "fixedassetcardproperty",
    component: FixedAssetCardPropertyComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_FIXEDASSETCARDPROPERTY }
  },
  {
    path: "fixedasset",
    component: FixedAssetComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSETOPERATIONS }
    // //canActivate: [AuthGuard]
  },
  {
    path: "suspendedfixedasset",
    component: SuspendedFixedAssetComponent,
    data: { pageKeyword: pages.MENU_SUSPENDEDFIXEDASSETS }
    // //canActivate: [AuthGuard]
  },
  {
    path: "lostfixedasset",
    component: LostFixedAssetComponent,
    data: { pageKeyword: pages.MENU_LOSTFIXEDASSETS }
    // //canActivate: [AuthGuard]
  },
  {
    path: "checkoutfixedasset",
    component: CheckoutFixedAssetComponent,
    data: { pageKeyword: pages.MENU_CHECKEDOUTFIXEDASSETS }
    // //canActivate: [AuthGuard]
  },
  {
    path: "relationshipfixedasset",
    component: RelationshipFixedAssetComponent,
    data: { pageKeyword: pages.MENU_FIXEDASSETRELATIONSHIP }
    // //canActivate: [AuthGuard]
  },
  {
    path: "transactionlist",
    component: TransactionListComponent,
    data: { pageKeyword: pages.MENU_TRANSACTIONLIST }
    // //canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
