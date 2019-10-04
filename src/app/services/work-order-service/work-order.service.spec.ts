/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WorkOrderService } from './work-order.service';

describe('Service: WorkOrder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkOrderService]
    });
  });

  it('should ...', inject([WorkOrderService], (service: WorkOrderService) => {
    expect(service).toBeTruthy();
  }));
});
