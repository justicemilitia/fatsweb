import { TestBed } from '@angular/core/testing';

import { ExpenseCenterService } from './expense-center.service';

describe('ExpenseCenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExpenseCenterService = TestBed.get(ExpenseCenterService);
    expect(service).toBeTruthy();
  });
});
