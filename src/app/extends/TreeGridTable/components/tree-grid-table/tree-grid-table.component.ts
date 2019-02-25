import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { TreeGridTable } from '../../modules/TreeGridTable';
import { IData } from '../../models/interfaces/IData';

@Component({
  selector: 'tree-grid-table',
  templateUrl: './tree-grid-table.component.html',
  styleUrls: ['./tree-grid-table.component.css']
})
export class TreeGridTableComponent implements OnInit,DoCheck {

  @Input() dataTable: TreeGridTable;
  @Output('onDoubleClickItem') dblClickItem: EventEmitter<any> = new EventEmitter();
  constructor() {
  }

  ngOnInit() {
  }

  ngDoCheck():void {
    this.dataTable.TGT_doFilter();
  }

  onDoubleClickItem(item: IData) {
    this.dblClickItem.emit(item);
  }

}
