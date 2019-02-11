import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { routes } from "./app-routing.module";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";

import { LoginComponent } from "./login/login.component";
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { LayoutComponent } from "./layout/layout.component";
import { CompanyComponent } from "./definitions/company/company.component";
import { UserComponent } from "./definitions/user/user.component";
import { AuthGuard } from "./Auth/auth.guard";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    CompanyComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
