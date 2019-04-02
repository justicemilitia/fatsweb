import { Component, OnInit, NgModule, Input, SimpleChanges, OnChanges } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { User } from "../../../../models/User";
import { FixedAssetUser } from "../../../../models/FixedAssetUser";

@Component({
  selector: "app-fa-change-debit",
  templateUrl: "./fa-change-debit.component.html",
  styleUrls: ["./fa-change-debit.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaChangeDebitComponent],
  providers: [FaChangeDebitComponent]
})
export class FaChangeDebitComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() faBarcode: FixedAsset = new FixedAsset();

  /* List Of Users */
  users: User[] = [];
  selectedUser: User[] = [];
  dropdownSettings = {};

  constructor(baseService: BaseService) {
    super(baseService);
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["faBarcode"].previousValue != changes["faBarcode"].currentValue) {
      if (this.faBarcode.FixedAssetUsers) {
        this.faBarcode.FixedAssetUsers.forEach((e: any) => {
          this.selectedUser.push(e.User);
        });
      }
    }
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
    let insertedUserIds: number[] = [];
    /* Is Form Valid */
    if (data.form.invalid == true) return;

    await this.baseService.popupService.ShowQuestionPopupForDebitUpdate(
      (response: boolean) => {
        if (response == true) {
          data.value.userIds.forEach(e => {
            insertedUserIds.push(e.UserId);
          });

          let fixedAssetUser: FixedAssetUser = new FixedAssetUser();

          fixedAssetUser.UserIds = insertedUserIds;
          fixedAssetUser.FixedAssetId = this.faBarcode.FixedAssetId;
          // cloneItem.userId=data.value.userIds;

          this.baseService.fixedAssetService.ChangeDebit(
            fixedAssetUser,
            (insertedItem: FixedAssetUser, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              /* Set inserted Item id to model */
              // this.faBarcode.Barcode = cloneItem.Barcode;
              insertedUserIds.forEach(e => {
                let user = this.users.find(x => x.UserId == e);
                if (user) {
                  let exists = this.faBarcode.FixedAssetUsers.find(x => x.UserId == user.UserId);
                  if (!exists) {
                    let auser = new FixedAssetUser();
                    auser.UserId = user.UserId;
                    auser.User = user;
                    this.faBarcode.FixedAssetUsers.push(auser);
                  }
                }
              })

            },
            (error: HttpErrorResponse) => {
              /* Show alert message */
              this.baseService.popupService.ShowErrorPopup(error);
            }
          );
        }
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
      }
    );
  }


  resetForm(data: NgForm) {
    this.selectedUser = [];
  }
}
