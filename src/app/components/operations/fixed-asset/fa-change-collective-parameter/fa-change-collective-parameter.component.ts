import { Component, OnInit, Input, NgModule } from '@angular/core';
import { BaseComponent } from '../../../base/base.component';
import * as $ from 'jquery';
import { Department } from '../../../../models/Department';
import { Company } from '../../../../models/Company';
import { FixedAssetStatus } from '../../../../models/FixedAssetStatus';
import { FixedAssetCardBrand } from '../../../../models/FixedAssetCardBrand';
import { FixedAssetCardModel } from 'src/app/models/FixedAssetCardModel';
import { User } from '../../../../models/LoginUser';
import { ExpenseCenter } from '../../../../models/ExpenseCenter';
import { BaseService } from '../../../../services/base.service';
import { Firm } from '../../../../models/Firm';
import { HttpErrorResponse } from '@angular/common/http';
import { FixedAsset } from '../../../../models/FixedAsset';
import { ReactiveFormsModule, NgForm } from '@angular/forms';
import { TreeGridTable } from '../../../../extends/TreeGridTable/modules/TreeGridTable';
import { FirmService } from '../../../../services/firm-service/firm.service';

@Component({
  selector: 'app-fa-change-collective-parameter',
  templateUrl: './fa-change-collective-parameter.component.html',
  styleUrls: ['./fa-change-collective-parameter.component.css']
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaChangeCollectiveParameterComponent],
  providers: [FaChangeCollectiveParameterComponent]
})
export class FaChangeCollectiveParameterComponent extends BaseComponent implements OnInit {

  ngAfterViewInit(): void {
    $(".select2").trigger("click");
  }

  @Input() faBarcode: FixedAsset = new FixedAsset();  
  @Input() faDataTable: TreeGridTable;  
  firms: Firm[] = []; 
  companies: Company[] = [];   
  departments: Department[] = [];
  locations: Location[] = [];
  brands: FixedAssetCardBrand[] = [];
  models: FixedAssetCardModel[] = [];
  expensecenters: ExpenseCenter[] = [];
  statuses: FixedAssetStatus[] = [];  

  fixedAsset: FixedAsset = new FixedAsset();


  constructor(protected baseService: BaseService) {
    super(baseService);  
    this.loadDropdownList(); 
   }

  ngOnInit() {
  }
  loadDropdownList() {

    // FirmList
    this.baseService.userService.GetFirms(
      (firms: Firm[]) => {
        this.firms = firms;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

     // CompanyList
     this.baseService.companyService.GetCompanies(
      (companies: Company[]) => {
        this.companies = companies;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    // DepartmentList
    this.baseService.departmentService.GetDepartments(
      (departments: Department[]) => {
        this.departments = departments;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    // LocationList
    this.baseService.locationService.GetLocations(
      (locations: Location[]) => {
        this.locations = locations;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

      // ExpenseCenterList
      this.baseService.expenseCenterService.GetExpenseCenters(
        (expCenters: ExpenseCenter[]) => {
          this.expensecenters = expCenters;
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );

    // StatusList
    this.baseService.fixedAssetStatusService.GetStatus(
      (statuses: FixedAssetStatus[]) => {
        this.statuses = statuses;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );

    // BrandList
    this.baseService.fixedAssetCardBrandService.GetFixedAssetCardBrands(
      (brands: FixedAssetCardBrand[]) => {
        this.brands = brands;
      },
      (error: HttpErrorResponse) => {}
    );
  }

  loadModelByBrandId(event: any) {
    this.models = [];

    if (!event.target.value || event.target.value == "") {
      this.fixedAsset.FixedAssetCardModelId = null;
      this.fixedAsset.FixedAssetCardModel = new FixedAssetCardModel();
      return;
    }

    if (event.target.value) {
      this.baseService.fixedAssetCardModelService.GetFixedAssetsCardModelsByBrandId(
        <number>event.target.value,
        (models: FixedAssetCardModel[]) => {
          this.models = models;
        },
        (error: HttpErrorResponse) => {
          this.baseService.popupService.ShowErrorPopup(error);
        }
      );
    }
  }

  async ChangeCollectiveParameter(data: NgForm){
   
    let fixedAssetIds: number[]=[];
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    this.fixedAsset.FixedAssetIds = (<FixedAsset[]>(
      this.faDataTable.TGT_getSelectedItems()
    )).map(x => x.FixedAssetId);

    this.fixedAsset.FirmId = data.value.FirmId ;

    let cloneItem=new FixedAsset();
    Object.assign(cloneItem, this.fixedAsset);

    await this.baseService.fixedAssetService.ChangeCollectiveParameter(
      cloneItem,
      (insertedItem: FixedAsset, message) => {
        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);
      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

}
