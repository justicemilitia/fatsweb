import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { FixedAssetCard } from "../../../models/FixedAssetCard";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardCategory } from '../../../models/FixedAssetCardCategory';
import { HttpErrorResponse } from '@angular/common/http';
import { IData } from 'src/app/extends/TreeGridTable/models/interfaces/IData';

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
implements OnInit, DoCheck {
  insertingFixedAssetCard: any = {};
  fixedAssetCards: FixedAssetCard[] = [];  
  fixedAssetCardCategoryInAdd: FixedAssetCard[] = [];
  fixedAssetCardCategories: FixedAssetCardCategory[] = [];

  filter: any = {
    Name: "",
    FixedAssetCategoryName:"",
    Description: ""
  };

  order: any = {
    isDesc: false,
    column: "Name"
  };

  constructor(public baseService: BaseService) { 
    super(baseService);
    this.loadFixedAssetCards();
  }
  
  ngOnInit() {}

  ngDoCheck(): void {
    this.doFilter();
  }

//#region Grid Methods

doFilter() {
  //this.TGT_doFilter(this.fixedAssetCards, this.filter);
}

doOrder(column: string) {
  this.order.isDesc = !this.order.isDesc;
  this.order.column = column;
  //this.TGT_doOrder(this.fixedAssetCards, this.filter, this.order);
}

doCollapse(data: IData) {
  data.isExtended = !data.isExtended;
  //this.TGT_loadData(this.fixedAssetCards);
}

//#endregion


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
        //this.fixedAssetCards = <FixedAssetCard[]>this.convertDataToTree(facs);
        //this.TGT_loadData(this.fixedAssetCards);
      },
      (error: HttpErrorResponse) => {
        //this.errorManager(error);
      }
    );
  }

  loadDropdownList() {
    this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(fixedAssetCategories => {
      this.fixedAssetCardCategories = fixedAssetCategories;},
      (error: HttpErrorResponse) => {
        //this.errorManager(error);
      } );
  }
}
