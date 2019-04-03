import { Component, OnInit, NgModule, Input, OnChanges } from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { User } from "../../../../models/User";
import { FixedAssetUser } from "../../../../models/FixedAssetUser";
import { SimpleChanges } from "@angular/core";

@Component({
  selector: "app-fa-delete-debit",
  templateUrl: "./fa-delete-debit.component.html",
  styleUrls: ["./fa-delete-debit.component.css"]
})
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FaDeleteDebitComponent],
  providers: [FaDeleteDebitComponent]
})
export class FaDeleteDebitComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() faBarcode: FixedAsset = new FixedAsset();

  users: User[] = [];
  UserIds: User[] = [];
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["faBarcode"].previousValue != changes["faBarcode"].currentValue) {
      if (this.faBarcode.FixedAssetUsers) {
        this.faBarcode.FixedAssetUsers.forEach((e: FixedAssetUser) => {
          let foundUser = this.users.find(x => x.UserId == e.User.UserId);
          if (foundUser)
            this.UserIds.push(foundUser);
        });
      }
    }
  }

  async DeleteDebit(data: NgForm) {

    let deletedUserIds: number[] = [];

    /* Is Form Valid */
    if (data.form.invalid == true) return;

    await this.baseService.popupService.ShowQuestionPopupForDebitDelete(
      (response: boolean) => {
        if (response == true) {

          this.faBarcode.FixedAssetUsers.forEach((e: FixedAssetUser) => {
            if (this.UserIds.find(x => x.UserId == e.User.UserId) == null)
              deletedUserIds.push(e.User.UserId);
          });

          let fixedAssetUser: FixedAssetUser = new FixedAssetUser();


          fixedAssetUser.UserIds = deletedUserIds;
          fixedAssetUser.FixedAssetId = this.faBarcode.FixedAssetId;

          this.baseService.fixedAssetService.DeleteDebit(
            fixedAssetUser,
            (insertedItem: FixedAsset, message) => {
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);

              /* Set inserted Item id to model */
              deletedUserIds.forEach(e => {
                let index = this.faBarcode.FixedAssetUsers.findIndex(x => x.UserId == e);
                if (index >= 0)
                  this.faBarcode.FixedAssetUsers.splice(index, 1);
              });

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
      users => {
        this.users = users;
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  resetForm(data: NgForm) {
    this.UserIds = [];
    this.faBarcode = null;
  }

}
