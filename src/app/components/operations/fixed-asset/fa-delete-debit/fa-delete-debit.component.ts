import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from '../../../../services/base.service';
import { TreeGridTable } from '../../../../extends/TreeGridTable/modules/TreeGridTable';
import { FixedAsset } from '../../../../models/FixedAsset';
import { HttpErrorResponse } from '@angular/common/http';
import * as $ from "jquery";
import { User } from '../../../../models/LoginUser';
import { FixedAssetUser } from '../../../../models/FixedAssetUser';

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
  fixedAssetUser: FixedAssetUser= new FixedAssetUser();
  
  users: User[] = [];
  selectedUser: User[] = [];
  dropdownSettings = {};  

    
  constructor(baseService: BaseService) {
    super(baseService);
    // this.loadDropdownList();    
    this.loadUsers();    
  }
  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "UserId",
      textField: "UserMail",
      selectAllText: "Hepsini Seç",
      unSelectAllText: "Temizle",
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  async DeleteDebit(data: NgForm) {

    let deletedUserIds: number[]=[];
    
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    data.value.userIds.forEach(e => {
      deletedUserIds.push(e.UserId);
    });

    this.fixedAssetUser.UserIds = deletedUserIds;
    this.fixedAssetUser.FixedAssetId = this.faBarcode.FixedAssetId;

    let cloneItem=new FixedAssetUser();
    Object.assign(cloneItem, this.faBarcode);


    // cloneItem.userId=data.value.userIds;

     await this.baseService.fixedAssetService.DeleteDebit(
      cloneItem,
      (insertedItem: FixedAsset, message) => {
        /* Show success pop up */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Set inserted Item id to model */
        // this.faBarcode.Barcode = cloneItem.Barcode;

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
