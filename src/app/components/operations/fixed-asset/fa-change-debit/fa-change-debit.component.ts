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
  selector: 'app-fa-change-debit',
  templateUrl: './fa-change-debit.component.html',
  styleUrls: ['./fa-change-debit.component.css']
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaChangeDebitComponent],
  providers: [FaChangeDebitComponent]
})
export class FaChangeDebitComponent extends BaseComponent implements OnInit {

  @Input() faBarcode: FixedAsset = new FixedAsset();
  fixedAssetUser: FixedAssetUser= new FixedAssetUser();

  /* List Of Users */
  users: User[] = [];
  selectedUser: User[] = [];
  dropdownSettings = {};  

  constructor(baseService: BaseService) {
    super(baseService);
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

  async ChangeDebit(data: NgForm) {

    let insertedUserIds: number[]=[];
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    data.value.userIds.forEach(e => {
      insertedUserIds.push(e.UserId);
    });

    this.fixedAssetUser.UserIds = insertedUserIds;
    this.fixedAssetUser.FixedAssetId = this.faBarcode.FixedAssetId;

    let cloneItem=new FixedAssetUser();
    Object.assign(cloneItem, this.fixedAssetUser);


    // cloneItem.userId=data.value.userIds;

     await this.baseService.fixedAssetService.ChangeDebit(
      cloneItem,
      (insertedItem: FixedAssetUser, message) => {
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

  async loadUsers() {

    /* Load users to user dropdown */
    await this.baseService.userService.GetUsers(
      (users: User[]) => {
        this.users = users;
      },
      (error: HttpErrorResponse) => {
      this.baseService.popupService.ShowErrorPopup(error);
    });
  }

  // async loadUsers() {
  //   await this.baseService.userService.GetUsers(
  //     (users: User[]) => {
  //       this.users = users;
  //     },
  //     (error: HttpErrorResponse) => {
  //       this.baseService.popupService.ShowErrorPopup(error);
  //     }
  //   );
  // }

  onItemSelect(item: User) {
    this.selectedUser.push(item);
  }

  onSelectAll(items: any) {
    this.selectedUser.push(items);
  }
}
