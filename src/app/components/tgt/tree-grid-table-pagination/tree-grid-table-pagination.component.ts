import { Component, OnInit, Input } from '@angular/core';
import { TreeGridTable } from 'src/app/extends/TreeGridTable';

@Component({
  selector: 'tree-grid-table-pagination',
  templateUrl: './tree-grid-table-pagination.component.html',
  styleUrls: ['./tree-grid-table-pagination.component.css']
})
export class TreeGridTablePaginationComponent implements OnInit {

  @Input() dataTable:TreeGridTable;
  
  constructor() { }

  ngOnInit() {
  }

}
