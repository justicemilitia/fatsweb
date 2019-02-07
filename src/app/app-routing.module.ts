import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CompanyComponent} from './definitions/company/company.component'
import{LoginComponent} from './login/login.component';
import { UserComponent } from './definitions/user/user.component';


export const routes: Routes = [
 {path:"company" , component:CompanyComponent},
 {path:"login", component:LoginComponent},
 {path:"user",component:UserComponent},
 {path:"**",redirectTo:"login",pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
