import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule, NgControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { routes } from "./app-routing.module";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import {
  MatStepperModule,
  MatIconModule,
  MatButtonModule
} from "@angular/material";

import { LoginComponent } from "./components/login/login.component";

import { HeaderComponent } from "./components/layout/header/header.component";
import { FooterComponent } from "./components/layout/footer/footer.component";
import { CompanyComponent } from "./components/definitions/company/company.component";
import { UserComponent } from "./components/definitions/user/user.component";
import { DepartmentComponent } from "./components/definitions/department/department.component";
import { LocationComponent } from "./components/definitions/location/location.component";
import { FixedAssetCardComponent } from "./components/definitions/fixed-asset-card/fixed-asset-card.component";
import { FixedAssetCardCategoryComponent } from "./components/definitions/fixed-asset-card-category/fixed-asset-card-category.component";
import { AuthGuard } from "./services/authguard/auth.guard";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { CountryComponent } from "./components/definitions/country/country.component";
import { CityComponent } from "./components/definitions/city/city.component";
import { ExpenseCenterComponent } from "./components/definitions/expense-center/expense-center.component";
import { CheckOutReasonsComponent } from "./components/definitions/check-out-reasons/check-out-reasons.component";
import { RoleAuthorizationComponent } from "./components/definitions/role-authorization/role-authorization.component";
import { AgreementComponent } from "./components/definitions/agreement/agreement.component";
import { FixedAssetCardBrandComponent } from "./components/definitions/fixed-asset-card-brand/fixed-asset-card-brand.component";
import { FixedAssetCardModelComponent } from "./components/definitions/fixed-asset-card-model/fixed-asset-card-model.component";
import { FixedAssetCardPropertyComponent } from "./components/definitions/fixed-asset-card-property/fixed-asset-card-property.component";
import { TreeGridTablePage } from "./extends/TreeGridTable/pipes/TreeGridTablePage";
import { TreeGridTableComponent } from "./extends/TreeGridTable/components/tree-grid-table/tree-grid-table.component";
import { RoleComponent } from "./components/definitions/role/role.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ColorPickerModule } from "ngx-color-picker";
import { RoleUserComponent } from "./components/definitions/role-user/role-user.component";
import { FixedAssetComponent } from "./components/operations/fixed-asset/fixed-asset.component";
import { FixedAssetStatusComponent } from "./components/definitions/fixed-asset-status/fixed-asset-status.component";
import { FaCreateComponent } from "./components/operations/fixed-asset/fa-create/fa-create.component";
import { FaExitComponent } from "./components/operations/fixed-asset/fa-exit/fa-exit.component";
import { SuspensionComponent } from "./components/definitions/suspension/suspension.component";
import { FormWizardModule } from "angular-wizard-form";
import { SuspendedFixedAssetComponent } from "./components/operations/suspended-fixed-asset/suspended-fixed-asset.component";
import { LostFixedAssetComponent } from "./components/operations/lost-fixed-asset/lost-fixed-asset.component";
import { CheckoutFixedAssetComponent } from "./components/operations/checkout-fixed-asset/checkout-fixed-asset.component";
import { FaChangeBarcodeComponent } from "./components/operations/fixed-asset/fa-change-barcode/fa-change-barcode.component";
import { FaChangeLocationComponent } from "./components/operations/fixed-asset/fa-change-location/fa-change-location.component";
import { FaChangeDepartmentComponent } from "./components/operations/fixed-asset/fa-change-department/fa-change-department.component";
import { FaChangeFirmComponent } from "./components/operations/fixed-asset/fa-change-firm/fa-change-firm.component";
import { FaDeleteDebitComponent } from "./components/operations/fixed-asset/fa-delete-debit/fa-delete-debit.component";
import { FaChangeDebitComponent } from "./components/operations/fixed-asset/fa-change-debit/fa-change-debit.component";
import { FaSuspendComponent } from "./components/operations/fixed-asset/fa-suspend/fa-suspend.component";
import { FaLostComponent } from "./components/operations/fixed-asset/fa-lost/fa-lost.component";
import { FaChangeCollectiveParameterComponent } from "./components/operations/fixed-asset/fa-change-collective-parameter/fa-change-collective-parameter.component";
import { FaRelationshipComponent } from "./components/operations/fixed-asset/fa-relationship/fa-relationship.component";
import { FaFilterComponent } from "./components/operations/fixed-asset/fa-filter/fa-filter.component";
import { RelationshipFixedAssetComponent } from "./components/operations/relationship-fixed-asset/relationship-fixed-asset.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FileUploadModule } from "ng2-file-upload";
import { AlertInfosComponent } from "./extends/alert-infos/alert-infos/alert-infos.component";
import { InputTrimModule } from "ng2-trim-directive";
import { NgxMaskModule } from "ngx-mask";
import { TransactionListComponent } from "./components/operations/transaction-list/transaction-list.component";
import { UserSettingsComponent } from "./components/definitions/user-settings/user-settings.component";
import { DepreciationComponent } from "./components/depreciation/depreciation/depreciation.component";
import { MatTabsModule } from "@angular/material/tabs";
import { TreeGridDragDirective } from './extends/TreeGridTable/directives/tree-grid-drag.directive';
import { FaEditFileComponent } from './components/operations/fixed-asset/fa-edit-file/fa-edit-file.component';
import { CycleCountPlanComponent } from './components/operations/cycle-count/cycle-count-plan/cycle-count-plan.component';
import { CycleCountTerminalComponent } from './components/operations/cycle-count/cycle-count-terminal/cycle-count-terminal.component';
import { DepreciationDetailListComponent } from './components/depreciation/depreciation-detail-list/depreciation-detail-list.component';
import { ConsumableCardComponent } from './components/consumable/consumable-card/consumable-card.component';
import { ConsumableCategoryComponent } from './components/consumable/consumable-category/consumable-category.component';
import { ConsumableUnitComponent } from './components/consumable/consumable-unit/consumable-unit.component';
import { ConsumableListComponent } from './components/consumable/consumable-list/consumable-list.component';
import { ConsumableRequestListComponent } from './components/consumable/consumable-request-list/consumable-request-list.component';
import { ConsumableTransactionListComponent } from './components/consumable/consumable-transaction-list/consumable-transaction-list.component';
import { FaGeneralInformationComponent } from './components/operations/fixed-asset/fa-create/fa-general-information/fa-general-information.component';
import { FaPropertyInformationComponent } from './components/operations/fixed-asset/fa-create/fa-property-information/fa-property-information.component';
import { FaFinancialInformationComponent } from './components/operations/fixed-asset/fa-create/fa-financial-information/fa-financial-information.component';
import { PeriodicMaintenanceComponent } from './components/maintenance/periodic-maintenance/periodic-maintenance.component';
import { WorkOrderComponent } from './components/maintenance/work-order/work-order.component';
import { WorkOrderListComponent } from './components/maintenance/work-order-list/work-order-list.component';
import { FixBreakdownComponent } from './components/maintenance/fix-breakdown/fix-breakdown.component';
import { WorkOrderDetailComponent } from './components/maintenance/work-order-detail/work-order-detail.component';
import { ReportBreakdownComponent } from './components/maintenance/report-breakdown/report-breakdown.component';

import { PopupComponent } from './components/popup/popup.component';
import { BaseComponent } from './components/base/base.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    UserComponent,
    CompanyComponent,
    DepartmentComponent,
    LocationComponent,
    DashboardComponent,
    CountryComponent,
    CityComponent,
    DashboardComponent,
    ExpenseCenterComponent,
    CheckOutReasonsComponent,
    RoleAuthorizationComponent,
    FixedAssetCardComponent,
    FixedAssetCardCategoryComponent,
    DashboardComponent,
    AgreementComponent,
    FaChangeBarcodeComponent,
    FixedAssetCardBrandComponent,
    FixedAssetCardModelComponent,
    TreeGridTablePage,
    TreeGridTableComponent,
    RoleComponent,
    RoleUserComponent,
    FixedAssetComponent,
    FixedAssetStatusComponent,
    FaCreateComponent,
    FaExitComponent,
    FaChangeLocationComponent,
    FaChangeDepartmentComponent,
    FaChangeBarcodeComponent,
    FaChangeFirmComponent,
    FaChangeDebitComponent,
    FaDeleteDebitComponent,
    FaChangeCollectiveParameterComponent,
    RelationshipFixedAssetComponent,
    FaSuspendComponent,
    FaLostComponent,
    FixedAssetCardPropertyComponent,
    FaRelationshipComponent,
    FaFilterComponent,
    SuspensionComponent,
    SuspendedFixedAssetComponent,
    LostFixedAssetComponent,
    CheckoutFixedAssetComponent,
    AlertInfosComponent,
    TransactionListComponent,
    UserSettingsComponent,
    TreeGridDragDirective,
    FaEditFileComponent,
    DepreciationComponent,
    CycleCountPlanComponent,
    CycleCountTerminalComponent,
    DepreciationDetailListComponent,
    ConsumableCardComponent,
    ConsumableCategoryComponent,
    ConsumableUnitComponent,
    ConsumableListComponent,
    ConsumableRequestListComponent,
    ConsumableTransactionListComponent,
    FaGeneralInformationComponent,
    FaPropertyInformationComponent,
    FaFinancialInformationComponent,
    PopupComponent,
    PeriodicMaintenanceComponent,
    WorkOrderComponent,
    WorkOrderListComponent,
    WorkOrderDetailComponent,
    FixBreakdownComponent,
    ReportBreakdownComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpModule,
    CommonModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    ColorPickerModule,
    NgbModule,
    FormWizardModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    BrowserAnimationsModule,
    FileUploadModule,
    ReactiveFormsModule,
    InputTrimModule,
    NgxMaskModule.forRoot(),
    MatTabsModule,

  ],
  providers: [AuthGuard, HashLocationStrategy],
  bootstrap: [AppComponent]
})
export class AppModule {}
