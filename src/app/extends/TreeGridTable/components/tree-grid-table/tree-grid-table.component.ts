import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { TreeGridTable } from '../../modules/TreeGridTable';
import { IData } from '../../models/interfaces/IData';
import { iif } from 'rxjs';

@Component({
  selector: 'tree-grid-table',
  templateUrl: './tree-grid-table.component.html',
  styleUrls: ['./tree-grid-table.component.css']
})
export class TreeGridTableComponent implements OnInit, DoCheck {

  /**
   * Data Table inserted by user.
   */
  @Input() dataTable: TreeGridTable;

  /**
   * Trigger the double clicked item.
   */
  @Output('onDoubleClickItem') dblClickItem: EventEmitter<any> = new EventEmitter();

  /**
   * Trigger on click item
   */
  @Output('onClickItem') onClickItem: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {

    /* Close Item Outside of the column helper and open area */
    $(document).on('click', (e) => {
      if ($(e.target).closest(".table-column-helper-sub").length === 0
        && $(e.target).closest(".table-config-arrow").length === 0) {
        if (this.dataTable.isConfigOpen) {
          this.dataTable.isConfigOpen = false;
        }
      }
    })

  }

  ngDoCheck(): void {
    this.dataTable.TGT_doFilter();
  }

  onDoubleClickItem(item: IData) {
    if (this.dblClickItem != null)
      this.dblClickItem.emit(item);
  }

  onClickedItem(item: IData) {
    if (this.onClickItem != null)
      this.onClickItem.emit(item);
  }

}
