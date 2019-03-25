import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from '../../../../services/base.service';
import { TreeGridTable } from '../../../../extends/TreeGridTable/modules/TreeGridTable';
import { FixedAsset } from '../../../../models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';
import * as $ from "jquery";
import { User } from '../../../../models/LoginUser';

@Component({
  selector: 'app-fa-delete-debit',
  templateUrl: './fa-delete-debit.component.html',
  styleUrls: ['./fa-delete-debit.component.css']
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaDeleteDebitComponent],
  providers: [FaDeleteDebitComponent]
})
export class FaDeleteDebitComponent extends BaseComponent implements OnInit {
  
  @Input() faBarcode: FixedAsset = new FixedAsset();
  newDebit: string = '';

    /* List Of Users */
    users: User[] = [];
  selectedUser: User[] = [];
    
  constructor(baseService: BaseService) {
    super(baseService);
    this.loadDropdownList();    
    this.loadUsers();    
  }
  ngOnInit() {
  }

  async DeleteDebit(data: NgForm) {

    /* Is Form Valid */
    if (data.form.invalid == true) return;
    let cloneItem=new FixedAsset();
    Object.assign(cloneItem, this.faBarcode);


    // cloneItem.userId=data.value.userIds;

     await this.baseService.fixedAssetService.ChangeLocation(
      cloneItem,
      (insertedItem: FixedAsset, message) => {
        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Set inserted Item id to model */
        this.faBarcode.Barcode = cloneItem.Barcode;

      },
      (error: HttpErrorResponse) => {
        /* Show alert message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  async loadDropdownList() {

    /* Load users to user dropdown */
    await this.baseService.userService.GetUsers(users => {
      this.users = users
    }, (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  async loadUsers() {

    /* Load users to user dropdown */
    await this.baseService.userService.GetUsers(users => {
      this.users = users
    }, (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }
  onItemSelect(item: User) {
    this.selectedUser.push(item);
  }

  onSelectAll(items: any) {
    this.selectedUser.push(items);
  }
}
