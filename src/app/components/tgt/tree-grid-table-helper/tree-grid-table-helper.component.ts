import { Component, OnInit, Input } from '@angular/core';
import { TreeGridTable } from 'src/app/extends/TreeGridTable';

@Component({
  selector: 'tree-grid-table-helper',
  templateUrl: './tree-grid-table-helper.component.html',
  styleUrls: ['./tree-grid-table-helper.component.css']
})
export class TreeGridTableHelperComponent implements OnInit {

  @Input() dataTable:TreeGridTable
  constructor() { }

  ngOnInit() {
  }

}
