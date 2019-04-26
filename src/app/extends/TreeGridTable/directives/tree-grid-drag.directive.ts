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
      this.relaseItem(event);
    });

    $(this.ef.nativeElement).on('mousedown', (event) => {
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
        element.css('z-index', '1');
      }

    }, 100)
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

    /* Mouse position from event */
    let mouse = {
      left: event.pageX,
      top: event.pageY
    };

    /* Get jquery object of current element */
    let element = $(this.ef.nativeElement);

    /* Normally hold item stays on target item so we have to check manually all columsn is mouse in their target */
    this.dataTable.dataColumns.forEach(e => {

      /* if we find any item we stop binding more */
      if (!this.dataTable.lastPassedColumn) {

        /* Check item position with its width if mouse in then we can bind it */
        if (mouse.left > $(e.directive.ef.nativeElement).position().left && mouse.left < $(e.directive.ef.nativeElement).position().left + $(e.directive.ef.nativeElement).width()) {

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
    this.dataTable.TGT_doOrder(this.dataTable.currentHoldColumn, true);

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
