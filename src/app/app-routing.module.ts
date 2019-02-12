import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CompanyComponent } from "./definitions/company/company.component";
import { LoginComponent } from "./login/login.component";
import { UserComponent } from "./definitions/user/user.component";
import { AuthGuard } from "./Auth/auth.guard";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { pageID: -1 }
  },
  {
    path: "company",
    component: CompanyComponent,
    canActivate: [AuthGuard],
    data: { pageID: 7 }
  },
  {
    path: "user",
    component: UserComponent,
    data: { pageID: 5 },
    canActivate: [AuthGuard]
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
    canActivate: [AuthGuard],
    data: { pageID: -1 }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
