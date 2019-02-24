import { Component, OnInit, Input } from '@angular/core';
import { TreeGridTable } from 'src/app/extends/TreeGridTable';

@Component({
  selector: '[tgtBody]',
  templateUrl: './tree-grid-table-body.component.html',
  styleUrls: ['./tree-grid-table-body.component.css']
})

export class TreeGridTableBodyComponent implements OnInit {

  @Input() dataTable:TreeGridTable
  
  constructor() {
   }

  ngOnInit() {
  }

}
