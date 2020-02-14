import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeGridTable } from 'src/app/extends/TreeGridTable/modules/TreeGridTable';
import { BaseService } from 'src/app/services/base.service';
import { BaseComponent } from '../../base/base.component';
import { User } from "../../../models/User";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'user-auto-complete',
    templateUrl: 'user.auto.complete.component.html',
    styleUrls: ["./user.auto.complete.component.css"]
})

export class UserAutoCompleteComponent extends BaseComponent implements OnInit {
    @Input() labelText: string;
    @Input() searchUser: string;
    @Input() isMultipleSelectedActive: boolean = false;
    @Output() returnValueEvent = new EventEmitter<number>();

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
        this.dataTableParentUser.isMultipleSelectedActive = this.isMultipleSelectedActive;
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
            this.returnValueEvent.emit(null);
        }
    }

    onClickSelectUserItem(item: User) {
        this.returnValueEvent.emit(item.UserId);
        if (!this.isMultipleSelectedActive) {
            this.searchUser = `${item.FirstName} ${item.LastName}`;
            this.isParentUserDropdownOpen = false;
        }        
    }
}