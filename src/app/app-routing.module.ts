import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CompanyComponent } from "./components/definitions/company/company.component";
import { LoginComponent } from "./components/login/login.component";
import { UserComponent } from "./components/definitions/user/user.component";
import { AuthGuard } from "./services/authguard/auth.guard";
import * as pages from "./declarations/page-values";
import { LOGIN } from "./declarations/service-values";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { pageKeyword: pages.MENU_LOGIN }
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
    data: { pageKeyword: pages.MENU_COMPANYDEFINITONS }
  },
  {
    path: "user",
    component: UserComponent,
    data: { pageKeyword: pages.MENU_USERDEFINITIONS }
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
