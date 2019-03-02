import { Component, OnInit, NgModule, DoCheck } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { FixedAssetCard } from "../../../models/FixedAssetCard";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { FixedAssetCardCategory } from '../../../models/FixedAssetCardCategory';
import { HttpErrorResponse } from '@angular/common/http';
import { TreeGridTable } from '../../../extends/TreeGridTable/modules/TreeGridTable';
import * as $ from "jquery";

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
  fixedAssetCard: FixedAssetCard=new FixedAssetCard();

  public dataTable: TreeGridTable = new TreeGridTable(
    [
      {
        columnDisplayName: 'İsim',
        columnName: ['Name'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Kod',
        columnName: ['FixedAssetCardCode'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Kategori',
        columnName: ['FixedAssetCardCategory','Name'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      },
      {
        columnDisplayName: 'Açıklama',
        columnName: ['Description'],
        isActive: true,
        classes: [],
        placeholder: '',
        type: 'text'
      }
    ],
    {
      isDesc: false,
      column: ['Name']
    }
  );
  
  constructor(public baseService: BaseService) { 
    super(baseService);
    this.loadFixedAssetCards();
  }
  
  ngOnInit() {}

  loadFixedAssetCards() {
    debugger;
    this.baseService.fixedAssetCardService.GetFixedAssetCard(
      (facs: FixedAssetCard[]) => {
      this.fixedAssetCards = facs;
      this.dataTable.TGT_loadData(this.fixedAssetCards);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  resetForm() {
    this.fixedAssetCard = new FixedAssetCard();
  }

  OnSubmit(data: NgForm) {
    if (data.value.FixedAssetCardId == null)
      this.insertFixedAssetCard(data);
    else this.updateFixedAssetCard(data);
  }

  insertFixedAssetCard(data: NgForm) {
    if (data.form.invalid == true)
    return;
  this.fixedAssetCard = <FixedAssetCard>data.value;
  this.baseService.fixedAssetCardService.InsertFixedAssetCard(
    this.fixedAssetCard,
    (data: FixedAssetCard, message) => {
      this.baseService.popupService.ShowSuccessPopup(message);
      this.fixedAssetCards.push(data);
      this.dataTable.TGT_loadData(this.fixedAssetCards);
    },
    (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    }
  );
  }

  updateFixedAssetCard(data: NgForm) {
    this.fixedAssetCard = <FixedAssetCard>data.value;
    this.baseService.popupService.ShowQuestionPopupForUpdate(response => {
      if (response == true) {
        this.baseService.fixedAssetCardService.UpdateFixedAssetCard(
          this.fixedAssetCard,
          (company, message) => {
            this.baseService.popupService.ShowSuccessPopup(message);
            this.dataTable.TGT_updateData(company);
          },
          (error: HttpErrorResponse) => {
            this.baseService.popupService.ShowErrorPopup(error);

          }
        );
      }
    });
  }

  // loadDropdownList() {
  //   this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(fixedAssetCategories => {
  //     this.fixedAssetCardCategories = fixedAssetCategories;},
  //     (error: HttpErrorResponse) => {
  //       this.baseService.popupService.ShowErrorPopup(error);
  //     });
  // }

  onDoubleClickItem(item: FixedAssetCard) {
    this.baseService.fixedAssetCardService.GetFixedAssetCardById(item.FixedAssetCardId, result => {
      this.fixedAssetCard = result;
    }, (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });
    $("#btnAddFixedAssetCard").trigger("click");
    $("#btnInsertOrUpdateFixedAssetCard").html("Güncelle");
  }
}
