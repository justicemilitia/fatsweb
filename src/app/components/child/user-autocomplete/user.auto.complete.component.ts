import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { BaseService } from 'src/app/services/base.service';
import { BaseComponent } from '../../base/base.component';
import { User } from "../../../models/User";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'user-auto-complete',
    templateUrl: 'user.auto.complete.component.html'
})

export class UserAutoCompleteComponent extends BaseComponent implements OnInit {
    @Input() searchUser: string;
    @Output() parentIdEvent = new EventEmitter<number>();

    isParentUserDropdownOpen: boolean = false;

    public dataTableParentUser: TreeGridTable = new TreeGridTable(
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

    constructor(public baseService: BaseService) {
        super(baseService);
    }

    ngOnInit() {
        this.dataTableParentUser.TGT_clearData();

        this.dataTableParentUser.isPagingActive = false;
        this.dataTableParentUser.isColumnOffsetActive = false;
        this.dataTableParentUser.isDeleteable = false;
        this.dataTableParentUser.isLoading = false;
        this.dataTableParentUser.isScrollActive = false;
        this.dataTableParentUser.isSelectAllWithChildrenActive = false;
        this.dataTableParentUser.isMultipleSelectedActive = false;
        this.dataTableParentUser.isFilterActive = false;

    }

    async searchUserChanged() {
        if (this.searchUser.length >= 2) {
            this.isParentUserDropdownOpen = true;
            this.baseService.userService.GetUsersWithSearch(this.searchUser,
                (data: User[]) => {
                    this.dataTableParentUser.TGT_loadData(data);
                },
                (error: HttpErrorResponse) => {
                    this.baseService.popupService.ShowErrorPopup(error);
                }
            );
        } else {
            this.isParentUserDropdownOpen = false;
            this.parentIdEvent.emit(null);
        }
    }

    onClickSelectUserItem(item: User) {
        this.parentIdEvent.emit(item.UserId);
        this.searchUser = `${item.FirstName} ${item.LastName}`;
        this.isParentUserDropdownOpen = false;
    }
}