import { Component, OnInit, Input } from '@angular/core';
import { TreeGridTable } from '../../modules/TreeGridTable';

@Component({
  selector: 'tree-grid-table',
  templateUrl: './tree-grid-table.component.html',
  styleUrls: ['./tree-grid-table.component.css']
})
export class TreeGridTableComponent implements OnInit {

  @Input() dataTable: TreeGridTable;

  constructor() {
  }

  ngOnInit() {
  }

}
