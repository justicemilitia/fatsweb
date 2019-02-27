import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { FixedAssetCard } from "../../../models/FixedAssetCard";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardCategory } from '../../../models/FixedAssetCardCategory';
import { HttpErrorResponse } from '@angular/common/http';
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';

@Component({
  selector: 'app-fixed-asset-card',
  templateUrl: './fixed-asset-card.component.html',
  styleUrls: ['./fixed-asset-card.component.css']
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [FixedAssetCardComponent],
  providers: [FixedAssetCardComponent]
})
export class FixedAssetCardComponent extends BaseComponent
implements OnInit {

  insertingFixedAssetCard: any = {};
  fixedAssetCards: FixedAssetCard[] = [];  
  fixedAssetCardCategories: FixedAssetCardCategory[] = [];

  public dataTable: TreeGridTable = new TreeGridTable(
    [
      {
        columnDisplayName: 'İsim',
        columnName: 'Name',
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Kod',
        columnName: 'FixedAssetCardCode',
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Kategori',
        columnName: 'FixedAssetCardCategory.Name',
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Açıklama',
        columnName: 'Description',
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      }
    ],
    {
      Name: '',
      Description: '',
      FixedAssetCardCategory:'',
      FixedAssetCardProperty:''
    },
    {
      isDesc: false,
      column: 'Name'
    }
  );
  
  constructor(public baseService: BaseService) { 
    super(baseService);
    this.loadFixedAssetCards();
  }
  
  ngOnInit() {}

  insertFixedAssetCard(data: NgForm) {
    this.insertingFixedAssetCard = <FixedAssetCard>data.value;
    this.baseService.fixedAssetCardService.InsertFixedAssetCard(
      this.insertingFixedAssetCard
    );
  }

  loadFixedAssetCards() {
    debugger;
    this.baseService.fixedAssetCardService.GetFixedAssetCard(
      (facs: FixedAssetCard[]) => {
        
      this.fixedAssetCards = facs;
      this.dataTable.TGT_loadData(this.fixedAssetCards);

      },
      (error: HttpErrorResponse) => {
        this.errorManager(error);
      }
    );
  }

  loadDropdownList() {
    this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(fixedAssetCategories => {
      this.fixedAssetCardCategories = fixedAssetCategories;},
      (error: HttpErrorResponse) => {
        this.errorManager(error);
      });
  }

  onDoubleClickItem(item: any) {
    console.log(item);
  }

}
