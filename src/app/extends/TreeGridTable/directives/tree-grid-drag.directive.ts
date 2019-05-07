import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { IColumn } from '../models/interfaces/IColumn';
import { TreeGridTable } from '../modules/TreeGridTable';

@Directive({
  selector: '[appTreeGridDrag]'
})
export class TreeGridDragDirective implements OnChanges {

  private isHold: boolean = false;
  private startPosX: number = null;

  @Input('column') column: IColumn;
  @Input('dataTable') dataTable: TreeGridTable;

  constructor(public ef: ElementRef) {

    /* Relase hold item */
    $(document).on('mouseup', (event) => {
      if (event.which == 1)
        this.relaseItem(event);
    });

    $(this.ef.nativeElement).on('mousedown', (event) => {
      if (event.which == 1)
        this.holdItem();
    });

    $(document).on('mousemove', (event) => {

      if (this.isHold == false)
        return;

      if (this.startPosX == null)
        this.startPosX = event.pageX;

      $(ef.nativeElement).css('transform', 'translate(' + (event.pageX - this.startPosX).toString() + 'px,0)');

    });

  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes["column"].previousValue != changes["column"].currentValue) {
      this.column.directive = this;
    }

  }

  holdItem() {

    /* If drag and drop is not active return */
    if (this.dataTable.isDragAndDropActive == false || this.dataTable.isColumnOffsetActive == false)
      return;

    /* If element is empty return */
    if (!this.ef)
      return;

    /* Hold the item after bind it to dataTable */
    this.isHold = true;
    this.dataTable.currentHoldColumn = this.column;

    setTimeout(() => {

      /* if still holding the item means can be hold this item */
      if (this.isHold == true) {

        /* Update css style of hold item */
        let element = $(this.ef.nativeElement);
        element.css('background-color', 'rgb(224, 224, 224)');
        element.css('box-shadow', '1px 1px 3px 1px #b1b1b1');
        element.css('z-index', '2');
      }

    }, 150);
  }


  relaseItem(event) {

    /* if drag and drop is not active return */
    if (this.dataTable.isDragAndDropActive == false || this.dataTable.isColumnOffsetActive == false)
      return;

    /* if element is not ready to change then return */
    if (!this.ef)
      return;

    /* if released item is not the hold item then return */
    if (this.isHold != true)
      return;

    /* Reset bindings */
    this.isHold = false;
    this.startPosX = null;

    /* hold items positon  */
    let holdColPosition = {
      left:$(this.dataTable.currentHoldColumn.directive.ef.nativeElement).position().left,
      top:$(this.dataTable.currentHoldColumn.directive.ef.nativeElement).position().top,
      leftCenter: $(this.dataTable.currentHoldColumn.directive.ef.nativeElement).position().left +
            $(this.dataTable.currentHoldColumn.directive.ef.nativeElement).outerWidth() / 2,
      topCenter: $(this.dataTable.currentHoldColumn.directive.ef.nativeElement).position().top +
            $(this.dataTable.currentHoldColumn.directive.ef.nativeElement).outerHeight() / 2,

    }

    /* Get jquery object of current element */
    let element = $(this.ef.nativeElement);

    /* Normally hold item stays on target item so we have to check manually all the columns is mouse on them */
    this.dataTable.dataColumns.forEach(e => {

      /* if we find any item we stop binding more */
      if (!this.dataTable.lastPassedColumn) {
        
        /* Check item position with its width if mouse in then we can bind it */
        if (holdColPosition.leftCenter > $(e.directive.ef.nativeElement).position().left + $(e.directive.ef.nativeElement).outerWidth() / 3 
          && holdColPosition.leftCenter < $(e.directive.ef.nativeElement).position().left + $(e.directive.ef.nativeElement).outerWidth()) {
          
          /* if find hold item we will pass it */
          if (e != this.dataTable.currentHoldColumn) {
            this.dataTable.lastPassedColumn = e;
          }
        }
      }
    });

    /* Swap between columns */
    this.dataTable.TGT_swapColumns(this.dataTable.currentHoldColumn, this.dataTable.lastPassedColumn);

    /* We have to call order again to prevent ordering */
    this.dataTable.TGT_doOrder(this.dataTable.currentHoldColumn, false);

    /* Remove hold items */
    this.dataTable.currentHoldColumn = null;
    this.dataTable.lastPassedColumn = null;

    /* Reset css style of current element */
    element.css('z-index', '0');
    element.css('background-color', '#ffff');
    element.css('transform', 'translate(0,0)');
    element.css('box-shadow', 'none');

  }


}
