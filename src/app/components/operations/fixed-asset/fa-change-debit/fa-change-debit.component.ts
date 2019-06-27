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
import { Router } from '@angular/router';
import { DOCUMENT_URL } from '../../../../declarations/service-values';

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
  @Input() faComponent: FixedAssetComponent;
  selectedIds: number[];

  /* List Of Users */
  users: User[] = [];
  selectedUser: User[] = [];
  selectedFixedAssetId: number;
  fixedAssetUser:FixedAssetUser=new FixedAssetUser();
  fixedAssetUsers: FixedAssetUser[] = [];
  private router: Router;  

  AllUsersWithoutDebitUser: number[] = [];

  IsCreateDebitForm:boolean=false;

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
            return value.RegistrationNumber == null ? value.FirstName + " " + value.LastName : value.RegistrationNumber + " - " + value.FirstName + " " + value.LastName;
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
          if (value) {
            return value.RegistrationNumber == null ? value.FirstName + " " + value.LastName : value.RegistrationNumber + " - " + value.FirstName + " " + value.LastName;
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
    //this.loadDebitUserList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["faBarcode"].previousValue != changes["faBarcode"].currentValue) {

      if (this.faBarcode.FixedAssetUsers) {
        this.faBarcode.FixedAssetUsers.forEach((e: any) => {
          this.selectedUser.push(e.User);
        });
      }

      if (this.faBarcode.FixedAssetId) {
        this.selectedFixedAssetId = this.faBarcode.FixedAssetId;
        this.loadUserList();
        //this.loadDebitUserListByFixedAssetId();
      }

    }
  }

  ngOnInit() {
  }

  async ChangeDebit() {
    let insertedUserIds: number[] = [];

    await this.baseService.popupService.ShowQuestionPopupForDebitUpdate(
      (response: boolean) => {
        if (response == true) {
          this.dataTableOldDebit.TGT_copySource().forEach(e => {
            insertedUserIds.push(e.getId());
          });

          this.baseService.spinner.show();

          let fixedAssetUser: FixedAssetUser = new FixedAssetUser();

          fixedAssetUser.UserIds = insertedUserIds;
          fixedAssetUser.FixedAssetId = this.faBarcode.FixedAssetId;
          //fixedAssetUser.IsCreateDebitForm = this.IsCreateDebitForm;

          this.baseService.fixedAssetService.ChangeDebit(
            fixedAssetUser,
            (formList: any[], message) => {

              this.baseService.spinner.hide();
              /* Show success pop up */
              this.baseService.popupService.ShowSuccessPopup(message);
              if(this.IsCreateDebitForm==true){
              for(let i=0;i<formList.length;i++){
                this.PressDebitForm(formList[0].FixedAsset.FixedAssetForms[i].FixedAssetFormCode);
              }

              // if(formList != null){
              // formList[0].FixedAsset.FixedAssetForms.forEach(e => 
              //   { 
              //       if(e != null){
              //         this.PressDebitForm(e.FixedAssetFormCode);                  
              //       }
              //   }
              // );
              // }
            }
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
              
              this.baseService.spinner.hide();

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
      (users: User[]) => {

        this.users = users;

        this.users.forEach(e => {
          e.ParentUserId = null;
        });

        this.dataTableOldDebit.TGT_clearData();

        this.selectedUser.forEach((e: User) => {
          let foundUser = users.find(x => x.UserId == e.UserId);
          if (foundUser) {
            let foundUserId = foundUser.UserId;
            this.AllUsersWithoutDebitUser.push(foundUserId);
            this.dataTableOldDebit.TGT_insertData(foundUser);
          }

        });

        this.dataTableDebit.TGT_loadData(this.users);
        this.dataTableDebit.TGT_removeItemsByIds(this.AllUsersWithoutDebitUser);

      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  /*loadDebitUserList() {
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
  }*/

  loadDebitUserListByFixedAssetId() {
    this.baseService.fixedAssetService.GetDebitUserListById(
      this.selectedFixedAssetId,
      (faUsers: FixedAssetUser[]) => {

        let userList: User[] = [];

        faUsers.forEach(e => {
          let user: User = new User();
          Object.assign(user, e.User);
          userList.push(user);
        });

        this.dataTableOldDebit.TGT_loadData(userList);

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

  AddDebitUser() {
    let selectedUsers = <User[]>this.dataTableDebit.TGT_getSelectedItems();

    // let oldDebitUser = <User[]>this.dataTableOldDebit.TGT_copySource();
    this.dataTableOldDebit.TGT_insertDatas(selectedUsers);
    this.dataTableDebit.TGT_removeItemsByIds(selectedUsers.map(x => x.UserId));
    this.dataTableOldDebit.TGT_deselectAllItems();

  }

  DeleteDebitUser() {
    let selectedUsers = <User[]>this.dataTableOldDebit.TGT_getSelectedItems();

    // let oldDebitUser = <User[]>this.dataTableOldDebit.TGT_copySource();
    this.dataTableDebit.TGT_insertDatas(selectedUsers);
    this.dataTableOldDebit.TGT_removeItemsByIds(selectedUsers.map(x => x.UserId));
    this.dataTableDebit.TGT_deselectAllItems();

  }

  isCreateDebitForm(event){
    if(event.target.checked == true){
      this.IsCreateDebitForm = true;
    }
    else {
      this.IsCreateDebitForm = false;
    }
  }

  PressDebitForm(formName: string){
    let url:string;
    url=DOCUMENT_URL + formName + ".pdf";
    // this.router.navigate([url]); 
    window.open(url,"_blank");    
  }
}
