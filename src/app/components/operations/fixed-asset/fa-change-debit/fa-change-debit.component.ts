import {
  Component,
  OnInit,
  NgModule,
  Input,
  SimpleChanges,
  OnChanges
} from "@angular/core";
import { ReactiveFormsModule, NgForm } from "@angular/forms";
import { BaseComponent } from "../../../base/base.component";
import { BaseService } from "../../../../services/base.service";
import { FixedAsset } from "../../../../models/FixedAsset";
import { HttpErrorResponse } from "@angular/common/http";
import { User } from "../../../../models/User";
import { FixedAssetUser } from "../../../../models/FixedAssetUser";
import { TreeGridTable } from "src/app/extends/TreeGridTable/modules/TreeGridTable";
import { FixedAssetComponent } from "../fixed-asset.component";

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
export class FaChangeDebitComponent extends BaseComponent
  implements OnInit, OnChanges {
  @Input() faBarcode: FixedAsset = new FixedAsset();
  @Input() faComponent: FixedAssetComponent;
  selectedIds: number[];

  /* List Of Users */
  users: User[] = [];
  selectedUser: User[] = [];
  selectedFixedAssetId: number;
  fixedAssetUsers: FixedAssetUser[] = [];
  dropdownSettings = {};

  /* All Users Data Table */
  public dataTableDebit: TreeGridTable = new TreeGridTable(
    "allUsers",
    [
      {
        columnDisplayName: "Kullanıcı Listesi",
        columnName: ["|FirstNameAndLastName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          if (value) {
            return value.FirstName + " " + value.LastName;
          } else {
            return "";
          }
        }
      }
    ],
    {
      isDesc: false,
      column: ["|FirstNameAndLastName"]
    }
  );

  /* Debit Users Data Table */
  public dataTableOldDebit: TreeGridTable = new TreeGridTable(
    "debitUsers",
    [
      {
        columnDisplayName: "Zimmetli Personel",
        columnName: ["|FirstNameAndLastNameOld"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          if (value && value.User) {
            return value.User.FirstName + " " + value.User.LastName;
          } else {
            return "";
          }
        }
      }
    ],
    {
      isDesc: false,
      column: ["|FirstNameAndLastNameOld"]
    }
  );

  constructor(baseService: BaseService) {
    super(baseService);

    //Tüm Kullanıcılar
    this.dataTableDebit.isConfigOpen = false;
    this.dataTableDebit.isLoading = false;
    this.dataTableDebit.isPagingActive = false;
    this.dataTableDebit.isTableEditable = false;
    this.dataTableDebit.isDeleteable = false;
    this.dataTableDebit.isColumnOffsetActive = false;

    //Zimmetli Personel
    this.dataTableOldDebit.isConfigOpen = false;
    this.dataTableOldDebit.isLoading = false;
    this.dataTableOldDebit.isPagingActive = false;
    this.dataTableOldDebit.isTableEditable = false;
    this.dataTableOldDebit.isColumnOffsetActive = false;

    this.loadUserList();
    this.loadDebitUserList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["faBarcode"].previousValue != changes["faBarcode"].currentValue
    ) {
      if (this.faBarcode.FixedAssetUsers) {
        this.faBarcode.FixedAssetUsers.forEach((e: any) => {
          this.selectedUser.push(e.User);
        });

        if (this.faBarcode.FixedAssetId) {
          this.selectedFixedAssetId = this.faBarcode.FixedAssetId;
          this.loadDebitUserListByFixedAssetId();
        }
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
                  let exists = this.faBarcode.FixedAssetUsers.find(
                    x => x.UserId == user.UserId
                  );
                  if (!exists) {
                    let auser = new FixedAssetUser();
                    auser.UserId = user.UserId;
                    auser.User = user;
                    this.faBarcode.FixedAssetUsers.push(auser);
                  }
                }
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

  loadUserList() {
    this.baseService.userService.GetUsers(
      users => {
        this.users = users;
        this.users.forEach(e => {
          e.ParentUserId = null;
        });
        this.dataTableDebit.TGT_loadData(this.users);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  loadDebitUserList() {
    this.baseService.userService.GetDebitUsers(
      (faUsers: FixedAssetUser[]) => {
        this.fixedAssetUsers = faUsers;
        this.dataTableOldDebit.TGT_loadData(this.users);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.dataTableOldDebit.isLoading = false;
      }
    );
  }

  loadDebitUserListByFixedAssetId() {
    this.baseService.fixedAssetService.GetDebitUserListById(
      this.selectedFixedAssetId,
      (faUsers: FixedAssetUser[]) => {
        this.fixedAssetUsers = faUsers;
        this.dataTableOldDebit.TGT_loadData(this.fixedAssetUsers);
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.dataTableOldDebit.isLoading = false;
      }
    );
  }

  resetForm(data: NgForm) {
    this.selectedUser = [];
  }
}
