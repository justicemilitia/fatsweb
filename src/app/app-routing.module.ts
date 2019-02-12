import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CompanyComponent} from './definitions/company/company.component'
import{LoginComponent} from './login/login.component';
import { UserComponent } from './definitions/user/user.component';
import { AuthGuard } from './Auth/auth.guard';


export const routes: Routes = [
 {path:"company" , component:CompanyComponent, canActivate:[AuthGuard]},
 {path:"login", component:LoginComponent},
 {path:"user",component:UserComponent},
 {path:"",redirectTo:"login",pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
