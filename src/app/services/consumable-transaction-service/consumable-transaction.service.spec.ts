/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConsumableTransactionService } from './consumable-transaction.service';

describe('Service: ConsumableTransaction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumableTransactionService]
    });
  });

  it('should ...', inject([ConsumableTransactionService], (service: ConsumableTransactionService) => {
    expect(service).toBeTruthy();
  }));
});
