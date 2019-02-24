import { Component, OnInit, Input } from '@angular/core';
import { TreeGridTable } from 'src/app/extends/TreeGridTable';

@Component({
  selector: '[tgtHeader]',
  templateUrl: './tree-grid-table-header.component.html',
  styleUrls: ['./tree-grid-table-header.component.css']
})
export class TreeGridTableHeaderComponent implements OnInit {

  @Input() dataTable: TreeGridTable;
  constructor() { }

  ngOnInit() {
  }

}
