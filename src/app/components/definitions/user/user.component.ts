import { Component, OnInit, NgModule, ViewChild, SimpleChanges } from "@angular/core";
import { FormsModule, ReactiveFormsModule, NgForm, FormControl } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { BaseService } from "../../../services/base.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Department } from "../../../models/Department";
import { Role } from "../../../models/Role";
import { User } from "../../../models/User";
import { Location } from "../../../models/Location";
import { TreeGridTable } from "../../../extends/TreeGridTable/modules/TreeGridTable";
import UserTitle from "src/app/models/UserTitle";
import { NotDeletedItem } from 'src/app/models/NotDeletedItem';
import { MatStepper } from '@angular/material';
import { FixedAssetCardCategory } from 'src/app/models/FixedAssetCardCategory';
import { Firm } from 'src/app/models/Firm';
import { Page } from 'src/app/extends/TreeGridTable/models/Page';
import { UserFilterModel } from 'src/app/models/UserFilterModel';

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  declarations: [UserComponent],
  providers: [UserComponent]
})
export class UserComponent extends BaseComponent implements OnInit {

  isLocationDropdownOpen: boolean = false;

  isUserDropdownOpen: boolean = false;

  isFirmDropdownOpen: boolean = false;

  isFaCardCategoryDropdownOpen: boolean = false;

  visibleInsertButton: boolean = true;

  /* Is Request send and waiting for response ? */
  isWaitingInsertOrUpdate: boolean = false;

  visibleUpdateButton: boolean = false;

  /* Is Table Refreshing */
  isTableRefreshing: boolean = false;

  /* Is Table Exporting */
  isTableExporting: boolean = false;

  /* Store the current edit user */
  currentUser: User = new User();

  /* search the user list*/
  userFilterModel: UserFilterModel = new UserFilterModel();

  /* Store all the table users */
  users: User[] = [];

  dropdownUsers: User[] = [];

  /* Store the departments to inser users */
  departments: Department[] = [];

  /* Store the locations to insert users */
  locations: Location[] = [];

  /* Store the categories to insert users */
  categories: FixedAssetCardCategory[] = [];

  /* Store the roles to insert users */
  roles: Role[] = [];

  /* Store the firms to insert users */
  firms: Firm[] = [];

  /* Store user titles to insert users */
  userTitles: UserTitle[] = [];

  currentUserRoles: Role[] = [];

  dropdownSettings = {};

  checkedSystemUser: boolean = false;

  checkedSystemUserUpdate: boolean = false;

  isInsertOrUpdate: boolean = false;

  CategoryIds: number[] = [];

  FirmIds: number[] = [];

  LocationIds: number[] = [];

  UserIds: number[] = [];

  isUpdate: boolean = false;

  notDeletedBarcode: string = '';

  selectedItems: User[] = [];

  @ViewChild("stepper") stepper: MatStepper;

  currentPage: number = 1;
  perInPage: number = 100;
  totalPage: number = 1;
  pages: Page[] = [];
  totalRecords: number = 0;

  countOfParentItems: number;
  endDisplayCount: number;
  totalDisplayItem: number;

  pagingInfo: string = '';

  searchUser: string = '';

  /* Data Table instance */

  //#region DataTable
  public dataTable: TreeGridTable = new TreeGridTable(
    "user",
    [
      {
        columnDisplayName: this.getLanguageValue('User_Code'),
        columnName: ["UserCode"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('User_First_Name'),
        columnName: ["FirstName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('User_Last_Name'),
        columnName: ["LastName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('User_Title'),
        columnName: ["UserTitle", "Title"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('User_Registration_Number'),
        columnName: ["RegistrationNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Department'),
        columnName: ["Department", "Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Phone'),
        columnName: ["PhoneNumber"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('eMail'),
        columnName: ["UserMail"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('Parent_User'),
        columnName: ["|User"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: value => {
          if (value) {
            return value.ParentUser
              ? value.ParentUser.FirstName + " " + value.ParentUser.LastName
              : "";
          } else {
            return "";
          }
        }
      },
      {
        columnDisplayName: this.getLanguageValue('Description'),
        columnName: ["Description"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      },
      {
        columnDisplayName: this.getLanguageValue('System_User'),
        columnName: ["IsSystemUser"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "checkbox"
      }
    ],
    {
      isDesc: false,
      column: ["FirstName"]
    }
  );

  public dataTableLocation: TreeGridTable = new TreeGridTable(
    "location",
    [
      {
        columnDisplayName: this.getLanguageValue('Location'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  public dataTableFixedAssetCategory: TreeGridTable = new TreeGridTable(
    "fixedassetcategory",
    [
      {
        columnDisplayName: this.getLanguageValue('Fixed_Asset_Category_Name'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  public dataTableUser: TreeGridTable = new TreeGridTable(
    "user",
    [
      {
        columnDisplayName: "Kullanıcı",
        columnName: ["FirstName"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text",
        formatter: (value) => {
          if (value) {
            return value != null ? value.FirstName + ' ' + value.LastName : '';
          }
          else {
            return '';
          }
        }
      }
    ],
    {
      isDesc: false,
      column: ["FirstName"]
    }
  );

  public dataTableFirm: TreeGridTable = new TreeGridTable(
    "firm",
    [
      {
        columnDisplayName: this.getLanguageValue('Firm'),
        columnName: ["Name"],
        isActive: true,
        classes: [],
        placeholder: "",
        type: "text"
      }
    ],
    {
      isDesc: false,
      column: ["Name"]
    }
  );

  //#endregion

  constructor(public baseService: BaseService) {
    super(baseService);

    this.dropdownSettings = {
      singleSelection: false,
      idField: "RoleId",
      textField: "Name",
      selectAllText: this.getLanguageValue('Select_All'),
      unSelectAllText: this.getLanguageValue('Clear'),
      itemsShowLimit: 2,
      allowSearchFilter: true
    };

    this.loadUsers();
    this.loadDropdownList();

    this.dataTable.isPagingActive = false;
    this.dataTable.isFilterActive = false;

    //#region DataTable Property
    this.dataTableLocation.isPagingActive = false;
    this.dataTableLocation.isColumnOffsetActive = false;
    this.dataTableLocation.isDeleteable = false;
    this.dataTableLocation.isLoading = false;
    this.dataTableLocation.isScrollActive = false;
    this.dataTableLocation.isSelectAllWithChildrenActive = true;
    this.dataTableLocation.isMultipleSelectedActive = true;

    this.dataTableFixedAssetCategory.isPagingActive = false;
    this.dataTableFixedAssetCategory.isColumnOffsetActive = false;
    this.dataTableFixedAssetCategory.isDeleteable = false;
    this.dataTableFixedAssetCategory.isLoading = false;
    this.dataTableFixedAssetCategory.isScrollActive = false;
    this.dataTableFixedAssetCategory.isSelectAllWithChildrenActive = true;
    this.dataTableFixedAssetCategory.isMultipleSelectedActive = true;


    this.dataTableFirm.isPagingActive = false;
    this.dataTableFirm.isColumnOffsetActive = false;
    this.dataTableFirm.isDeleteable = false;
    this.dataTableFirm.isLoading = false;
    this.dataTableFirm.isScrollActive = false;
    this.dataTableFirm.isSelectAllWithChildrenActive = true;
    this.dataTableFirm.isMultipleSelectedActive = true;

    this.dataTableUser.isPagingActive = false;
    this.dataTableUser.isColumnOffsetActive = false;
    this.dataTableUser.isDeleteable = false;
    this.dataTableUser.isLoading = false;
    this.dataTableUser.isScrollActive = false;
    this.dataTableUser.isSelectAllWithChildrenActive = true;
    this.dataTableUser.isMultipleSelectedActive = true;
    //#endregion

    $(document).on("click", e => {
      if (
        $(e.target).closest(".custom-dropdown").length == 0 &&
        $(e.target).closest("#btnLocation").length == 0 && $(e.target).closest("#btnUser").length == 0
        && $(e.target).closest("#btnFaCategory").length == 0 && $(e.target).closest("#btnFirm").length == 0
      ) {
        this.isLocationDropdownOpen = false;
        this.isUserDropdownOpen = false;
        this.isFaCardCategoryDropdownOpen = false;
        this.isFirmDropdownOpen = false;
      }
    });
  }

  async  TGT_calculatePages() {

    let items: Page[] = [];
    let totalPage = this.totalPage;

    /* if user in a diffrent page we will render throw the first page */
    if (this.currentPage > totalPage)
      this.currentPage = 1;
    else if (this.currentPage < 1)
      this.currentPage = 1

    /* We will always put first page in to pagination items */
    items.push({
      value: 1,
      display: '1',
      isDisabled: false,
      isActive: this.currentPage == 1 ? true : false
    });

    /* if the total page is 1 return the items no more need calculation */
    if (totalPage <= 1) {
      this.pages = items;
      return;
    }

    /* we will store the last inserted item */
    let lastInsertedItem = this.currentPage - 3;

    /* if current user far enough page we will show ... (you passed many page) */
    if (lastInsertedItem > 2) {
      items.push({
        value: 0,
        display: '...',
        isDisabled: true,
        isActive: false
      });
    }

    /* We loop all pages to add pagination items */
    for (let ii = this.currentPage - 3; ii < totalPage; ii++) {
      lastInsertedItem = ii;

      /* first pages ii may be minus so we should check ii is bigger 1 */
      if (ii > 1) {
        /* Insert pagination item */
        items.push({
          value: ii,
          display: ii.toString(),
          isDisabled: false,
          isActive: this.currentPage == ii ? true : false
        });
      }

      /* maximum item we will show is 7 */
      if (items.length > 7) {
        ii = totalPage;
        break;
      }
    }

    /* After calculation if we still far from totalpage we insert ... page item */
    if (lastInsertedItem < totalPage - 1 && lastInsertedItem > 0) {
      items.push({
        value: 0,
        display: '...',
        isDisabled: true,
        isActive: false
      });
    }

    /* We always push the last page to the pagination items */
    if (!items.find(x => x.value == totalPage)) {
      items.push({
        value: totalPage,
        display: totalPage.toString(),
        isDisabled: false,
        isActive: this.currentPage == totalPage ? true : false
      });
    }

    /* We set pages to new pagination items. */
    this.pages = items;

  }

  ngOnInit() { }

  toggleDropdown(key: string) {

    switch (key) {
      case "location":
        //this.loadDropdownLocations();
        this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
        this.isFaCardCategoryDropdownOpen = false;
        this.isFirmDropdownOpen = false;
        this.isUserDropdownOpen = false;
        break;

      case "user":
        this.isUserDropdownOpen = !this.isUserDropdownOpen;
        this.isFirmDropdownOpen = false;
        this.isFaCardCategoryDropdownOpen = false;
        this.isLocationDropdownOpen = false;
        break;

      case "firm":
        this.isFirmDropdownOpen = !this.isFirmDropdownOpen;
        this.isLocationDropdownOpen = false;
        this.isUserDropdownOpen = false;
        this.isFaCardCategoryDropdownOpen = false;
        break;

      case "category":
        this.isFaCardCategoryDropdownOpen = !this.isFaCardCategoryDropdownOpen;
        this.isLocationDropdownOpen = false;
        this.isFirmDropdownOpen = false;
        this.isUserDropdownOpen = false;
        break;
    }
  }

  loadDropdownLocations() {
    this.baseService.locationService.GetLocations((location: Location[]) => {
      this.locations = location;
      this.dataTableLocation.TGT_loadData(this.locations);
    }, (error: HttpErrorResponse) => { })
  }

  resetForm(data: NgForm, isNewItem: boolean) {
    /* Reset modal form then reload lists */
    data.resetForm(this.currentUser);

    this.currentUserRoles = [];

    this.isUpdate = false;

    this.dataTableFirm.TGT_clearData();

    this.dataTableFixedAssetCategory.TGT_clearData();

    this.dataTableLocation.TGT_clearData();

    this.dataTableUser.TGT_clearData();

    this.loadDropdownList();

    this.stepper.reset();

    if (isNewItem == true) {
      this.currentUser = new User();
    }
  }

  next(event, data: NgForm) {
    if (this.currentUser.LastName == "")
      this.currentUser.LastName = null;

    if (this.currentUser.FirstName && this.currentUser.LastName != null && this.currentUser.UserCode
      && this.currentUser.LocationId && this.currentUser.DepartmentId && this.currentUser.UserTitleId && this.currentUser.UserMail) {
      this.stepper.next();
    } else {
      data.onSubmit(event);
      return;
    }
  }

  previous() {
    this.stepper.previous();
  }

  onSubmit(data: NgForm) {
    /* Form Validation */
    if (data.form.invalid == true) return;

    if (this.checkedSystemUser == true) {
      /* are Roles selected */
      if (!this.currentUserRoles || this.currentUserRoles.length == 0) {
        return;
      }
    }
    /* if company id exists means update it otherwise insert it */
    if (this.currentUser.UserId == null) {
      this.insertUser(data);
      this.isInsertOrUpdate = false;
    } else {
      // this.updateUser(data);
      this.popupComponent.ShowModal('#modalShowQuestionPopupForUser');
      this.popupComponent.CloseModal('#modalUser');
      this.isInsertOrUpdate = true;
    }
  }

  async insertUser(data: NgForm) {
    /* Say user to wait */
    this.isWaitingInsertOrUpdate = true;

    this.currentUser.RoleIds = this.currentUserRoles.map(x => x.RoleId);
    this.currentUser.LocationIds = <[]>this.dataTableLocation.TGT_getSelectedItems().map(x => x.getId());
    //this.currentUser.UserIds = <[]>this.dataTableUser.TGT_getSelectedItems().map(x => x.getId());
    this.currentUser.FixedassetCardCategoryIds = <[]>this.dataTableFixedAssetCategory.TGT_getSelectedItems().map(x => x.getId());
    this.currentUser.FirmIds = <[]>this.dataTableFirm.TGT_getSelectedItems().map(x => x.getId());

    /* insert into service */
    this.baseService.userService.InsertUser(
      this.currentUser,
      (insertedUser: User, message: string) => {
        /* Change loading bar status */
        this.isWaitingInsertOrUpdate = false;

        /* Show popup for success */
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Reset form */
        this.resetForm(data, true);

        this.refreshTable();

        this.checkedSystemUser = false;

      },
      (error: HttpErrorResponse) => {
        /* Change loading bar status */
        this.isWaitingInsertOrUpdate = false;

        /* Show failed message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  updateUser(data: NgForm) {

    /* Object bindings to store in datatable */
    let department = this.departments.find(
      x => x.DepartmentId == this.currentUser.DepartmentId
    );
    let userTitle = this.userTitles.find(
      x => x.UserTitleId == this.currentUser.UserTitleId
    );
    let parentUser = this.users.find(
      x => x.UserId == this.currentUser.ParentUserId
    );

    this.currentUser.LocationIds = <[]>this.dataTableLocation.TGT_getSelectedItems().map(x => x.getId());
    //this.currentUser.UserIds = <[]>this.dataTableUser.TGT_getSelectedItems().map(x => x.getId());
    this.currentUser.FixedassetCardCategoryIds = <[]>this.dataTableFixedAssetCategory.TGT_getSelectedItems().map(x => x.getId());
    this.currentUser.FirmIds = <[]>this.dataTableFirm.TGT_getSelectedItems().map(x => x.getId());

    if (this.checkedSystemUser == true) {
      this.currentUser.RoleIds = this.currentUserRoles.map(x => x.RoleId);
    }
    else this.currentUser.RoleIds = [];

    /* loading icon visible */
    this.isWaitingInsertOrUpdate = true;

    this.baseService.spinner.show();

    this.baseService.userService.UpdateUser(
      this.currentUser,
      (updateUser, message) => {
        /* Close loading icon */
        this.isWaitingInsertOrUpdate = false;

        this.baseService.spinner.hide();

        /* Show pop up*/
        this.baseService.popupService.ShowSuccessPopup(message);

        /* Load related values to current model */
        this.currentUser.Department = department;
        this.currentUser.UserTitle = userTitle;
        this.currentUser.ParentUser = parentUser;

        /* Update in table the current user */
        this.dataTable.TGT_updateData(this.currentUser);

        let newUser = new User();
        Object.assign(newUser, this.currentUser);
        this.currentUser = newUser;

        /* Get original source after update completed */
        this.users = <User[]>this.dataTable.TGT_copySource();
      },
      (error: HttpErrorResponse) => {
        /* Close loader */
        this.isWaitingInsertOrUpdate = false;

        /* Show error message */
        this.baseService.popupService.ShowErrorPopup(error);

        this.baseService.spinner.hide();
      }
    );
    this.popupComponent.CloseModal('#modalShowQuestionPopupForUser');
  }

  onDelete() {

    /* get selected items from table */
    this.selectedItems = <User[]>this.dataTable.TGT_getSelectedItems();

    /* if count of items equals 0 show message for no selected item */
    if (!this.selectedItems || this.selectedItems.length == 0) {
      this.baseService.popupService.ShowAlertPopup(
        "Lütfen en az bir kullanıcı seçiniz"
      );
      return;
    }
    else
      this.popupComponent.ShowModal('#modalShowDeletePopupForUser');

  }

  deleteUsers() {

    this.notDeletedBarcode = '';

    /* Show Question Message */
    //  this.baseService.popupService.ShowQuestionPopupForDelete(() => {
    /* Activate the loading spinner */
    this.baseService.spinner.show();

    /* Convert items to ids */
    let itemIds: number[] = this.selectedItems.map(x => x.getId());

    /* Delete all */
    this.baseService.userService.DeleteUsers(
      itemIds,
      () => {
        /* Deactive the spinner */
        this.baseService.spinner.hide();

        /* if all of them removed */
        if (itemIds.length == 1)
          this.baseService.popupService.ShowSuccessPopup(
            this.getLanguageValue('Delete_operation_successful')
          );
        else
          this.baseService.popupService.ShowSuccessPopup(
            this.getLanguageValue('All_records_deleted')
          );

        /* Clear all the ids from table */
        this.dataTable.TGT_removeItemsByIds(itemIds);

        /* Get current original sources */
        this.users = <User[]>this.dataTable.TGT_copySource();
      },
      (itemIds: NotDeletedItem[], error: HttpErrorResponse) => {

        let barcode: User;

        let notDeletedCode: string[] = [];

        let users = <User[]>this.dataTable.TGT_copySource();

        /* Hide spinner then show error message */
        this.baseService.spinner.hide();


        itemIds.forEach((e: NotDeletedItem) => {
          for (let i = 0; i < itemIds.length; i++) {
            let id: NotDeletedItem = e;
            let ids: NotDeletedItem[] = [];
            ids.push(id);

            ids.forEach(t => {
              for (let j = 0; j < ids.length; j++)
                barcode = users.find(x => x.UserId == t[j].Id);
            });
          }
          notDeletedCode.push(barcode.UserCode);
        });
        /* Show error message */
        if (itemIds.length > 0) {
          // this.baseService.popupService.ShowDeletePopup(error,notDeletedCode);

          notDeletedCode.forEach((e, i) => {
            this.notDeletedBarcode +=
              e + (i == this.selectedItems.length - 1 ? "" : ", ");
          });

          this.popupComponent.ShowModal('#modalShowErrorPopup');
        }
        else
          this.baseService.popupService.ShowErrorPopup(error);
      }
    );
    this.popupComponent.CloseModal('#modalShowDeletePopupForUser');
    // });
  }

  onDoubleClickItem(item: User) {

    this.visibleInsertButton = false;

    if (item.IsSystemUser == true)
      this.checkedSystemUserUpdate = true;
    else this.checkedSystemUserUpdate = false;

    /* Clear Model */
    this.currentUser = new User();

    /* Show spinner for loading */
    this.baseService.spinner.show();

    // if(item.Department)
    //   this.loadDepartmentByLocationId({ target: { value: item.LocationId } });
    // else
    //   this.departments = [];

    this.isInsertOrUpdate = true;


    /* get user information from server */
    this.baseService.userService.GetUserById(
      item.UserId,
      (result: User) => {
        /* then bind it to user model to update */


        setTimeout(() => {
          /* close loading */
          this.baseService.spinner.hide();

          /* Trigger to model to show it */
          $("#btnEditUser").trigger("click");

          /* bind result to model */
          this.currentUser = result;

          this.searchUser = this.currentUser.ParentUser != null ? `${this.currentUser.ParentUser.FirstName} ${this.currentUser.ParentUser.LastName}` : '';

          this.currentUserRoles.splice(0);

          this.currentUser.UserRoles.forEach(e => {
            let role = this.roles.find(y => y.RoleId == e.RoleId);
            if (role) this.currentUserRoles.push(role);
          });

          let CategoryIds: number[] = [];

          /*get user authorized fixed asset categories from server */
          result.UserAuthorizedFixedAssetCardCategories.forEach(e => {
            CategoryIds.push(e.FixedAssetCardCategoryId);
          });

          let FirmIds: number[] = [];
          /*get user authorized firms from server */
          result.UserAuthorizedFirms.forEach(e => {
            FirmIds.push(e.FirmId);
          });

          let LocationIds: number[] = [];
          /*get user authorized locations from server */
          result.UserAuthorizedLocations.forEach(e => {
            LocationIds.push(e.LocationId);
          });

          let UserIds: number[] = [];
          /*get user authorized users from server */
          result.UserAuthorizedUsersUser.forEach(e => {
            UserIds.push(e.AuthorizedUserId);
          });

          this.LoadRoleAuthDropdowns(CategoryIds, FirmIds, LocationIds, UserIds);

        }, 1000);
      },
      (error: HttpErrorResponse) => {
        /* hide spinner */
        this.baseService.spinner.hide();

        /* show error message */
        this.baseService.popupService.ShowErrorPopup(error);
      }
    );
  }

  LoadRoleAuthDropdowns(CategoryIds: number[], FirmIds: number[], LocationIds: number[], UserIds: number[]) {
    this.baseService.locationService.GetLocations((location: Location[]) => {
      this.locations = location;
      this.dataTableLocation.TGT_loadData(this.locations);
      this.dataTableLocation.TGT_selectItemsByIds(LocationIds);
    }, (error: HttpErrorResponse) => { });

    this.baseService.userService.GetFirms(
      (firms: Firm[]) => {
        this.firms = firms;
        this.dataTableFirm.TGT_loadData(this.firms);
        this.dataTableFirm.TGT_selectItemsByIds(FirmIds);
      }, (error: HttpErrorResponse) => {
      });


    this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
      (faCategory: FixedAssetCardCategory[]) => {
        this.categories = faCategory;
        this.dataTableFixedAssetCategory.TGT_loadData(this.categories);
        this.dataTableFixedAssetCategory.TGT_selectItemsByIds(CategoryIds);
      },
      (error: HttpErrorResponse) => { });
  }

  async loadUsers(_perInPage: number = 100, _currentPage: number = 1) {
    let c: string;
    //this.isGuaranteedFixedAsset = false;
    this.dataTable.TGT_clearData();
    this.dataTable.isLoading = true;

    this.userFilterModel.PageSize = _perInPage;
    this.userFilterModel.PageNumber = _currentPage;

    /* Load just user to table */
    this.baseService.userService.GetUsersByPagedList(this.userFilterModel,
      (usrs: User[], totalPage: number, totalRecords: number) => {
        this.baseService.spinner.hide();

        this.users = usrs;
        this.dataTable.TGT_loadData(this.users);

        if (usrs.length == 0) {
          this.baseService.popupService.ShowWarningPopup(this.getLanguageValue('Record_not_found'));
          this.totalPage = 0;
        } else {
          this.perInPage = _perInPage;
          this.currentPage = _currentPage;
          this.dataTable.perInPage = _perInPage;
          this.users = usrs;

          this.totalPage = totalPage;
          this.totalRecords = totalRecords;
          let endDisplayCount: number = this.currentPage * this.perInPage;
          let countOfParentItems: number = this.users.length;
          this.countOfParentItems = countOfParentItems;

          this.endDisplayCount = endDisplayCount - this.perInPage + 1;
          this.totalDisplayItem = this.endDisplayCount + this.countOfParentItems - 1;

          if (this.totalRecords > 0)
            this.pagingInfo = this.getLanguageValue('Total') + ' ' + this.totalRecords + ' ' + this.getLanguageValue('records_and') + ' ' + this.endDisplayCount + ' ' + this.getLanguageValue('with') + ' ' + this.totalDisplayItem + ' ' + this.getLanguageValue('records_shown');
          else
            this.pagingInfo = this.getLanguageValue('Total') + ' 0 ' + this.getLanguageValue('records');

          this.TGT_calculatePages();

          this.dataTable.TGT_loadData(this.users);
        }
      },
      (error: HttpErrorResponse) => {
        this.baseService.popupService.ShowErrorPopup(error);
        this.totalPage = 0;
        this.TGT_calculatePages();
      }
    );
  }


  loadDatatable(_perInPage: number = 100, _currentPage: number = 1) {
    this.loadUsers(_perInPage, _currentPage);
  }


  async calculateDatatable(perInPage: number = 1000, _currentPage: number = 1, user: User[]) {
    let startIndex = _currentPage * perInPage - perInPage;
    let counter = 0;
    let userCalculate: User[] = [];

    for (let ii = 0; ii < user.length; ii++) {
      if (userCalculate.length > 0) {
        if (user[ii].getParentId()) {
          userCalculate.push(user[ii]);
          continue;
        }
      }

      /* Eğer eklediğimiz miktar ekleyeceğimiz sayıya ulaştıysa döngüden çıkıyoruz */
      if (counter == startIndex + perInPage)
        break;
      /* Eğer miktar az ise ve parenti yok ise sayacı bir arttırıyoruz. Amacı childları saymayı önlemek */
      if (counter < startIndex) {
        if (!user[ii].getParentId()) {
          counter++;
          continue;
        } else
          continue;
        /* Parent idsi olmayanları atarken sayacı 1 arttırıyoruz. Childları basarken ise sayacı arttırmıyoruz. */
      } else if (counter < startIndex + perInPage) {
        if (user[ii].getParentId())
          continue;
        userCalculate.push(user[ii]);
        if (!user[ii].getParentId())
          counter++;
        continue;
      }
    }

    Object.assign(this.users, userCalculate);
  }

  async loadDropdownList() {

    /* Reload users again */
    /* Get Roles */
    if (this.roles.length == 0) {
      this.baseService.userService.GetRoles(roles => {
        this.roles = roles;
      });
    }

    /* Get User titles */
    if (this.userTitles.length == 0) {
      this.baseService.userService.GetUserTitles(titles => {
        this.userTitles = titles;
      });
    }

    //Get Fixed Asset Categories
    this.baseService.fixedAssetCardCategoryService.GetFixedAssetCardCategories(
      (faCategory: FixedAssetCardCategory[]) => {
        this.categories = faCategory;
        this.dataTableFixedAssetCategory.TGT_loadData(this.categories);
      },
      (error: HttpErrorResponse) => { });

    //Get Users  
    /* this.baseService.userService.GetUsers(
       (usrs: User[], totalPage: number, totalRecords: number) => {
         this.dropdownUsers = usrs;
         this.dataTableUser.TGT_loadData(this.dropdownUsers);
       },
       (error: HttpErrorResponse) => { }
     );*/

    //Get Locations
    this.baseService.locationService.GetLocations((location: Location[]) => {
      this.locations = location;
      this.dataTableLocation.TGT_loadData(this.locations);
    }, (error: HttpErrorResponse) => { });

    //Get Departments
    this.baseService.departmentService.GetDepartments((department: Department[]) => {
      this.departments = department;
      // this.dataTableLocation.TGT_loadData(this.locations);
    }, (error: HttpErrorResponse) => { });


    //Get Firms
    this.baseService.userService.GetFirms(
      (firms: Firm[]) => {
        this.firms = firms;
        this.dataTableFirm.TGT_loadData(this.firms);
      }, (error: HttpErrorResponse) => {

      });
  }

  onItemSelect(item: Role) {
    if (this.currentUserRoles == null) this.currentUserRoles = [];
    if (this.currentUserRoles.findIndex(x => x.RoleId == item.RoleId) == -1)
      this.currentUserRoles.push(item);
  }

  onSelectAll(items: Role[]) {
    if (this.currentUserRoles == null) this.currentUserRoles = [];

    items.forEach(element => {
      if (
        this.currentUserRoles.findIndex(x => x.RoleId == element.RoleId) == -1
      )
        this.currentUserRoles.push(element);
    });
  }

  isSystemUser(event) {
    if (event.target.checked == true) {
      this.checkedSystemUser = true;
      this.checkedSystemUserUpdate = true;
    } else {
      this.checkedSystemUser = false;
      this.checkedSystemUserUpdate = false;
    }
  }

  async refreshTable() {
    this.isTableRefreshing = true;

    this.dataTable.isLoading = true;

    this.dataTable.TGT_clearData();
    
    this.userFilterModel = new UserFilterModel();
    await this.loadUsers();

    this.isTableRefreshing = false;
  }

  receiveParentId($event) {
    this.currentUser.ParentUserId = $event;
  }

  receiveStaffId($event) {
    if ($event != null) {
      if (this.currentUser.UserIds == null) {
        this.currentUser.UserIds = [];
      }

      const index = this.currentUser.UserIds.indexOf($event);
      if (index > 0) {
        this.currentUser.UserIds.splice(index, 1);
      } else {
        this.currentUser.UserIds.push($event);
      }
    }
  }

  filterClear() {
    this.baseService.popupService.ShowQuestionPopup('Filtreyi temizlemek istediğinize emin misiniz?',
      (response) => {
        if (response == false)
          return;

        this.userFilterModel = new UserFilterModel();
      });
  }

  filterUserList(data: NgForm) {
    this.baseService.spinner.show();
    this.loadUsers();
    $('#CloseModal').trigger('click');
  }

  FilterOperation() {
    $("#showModal").trigger("click");
  }
}
