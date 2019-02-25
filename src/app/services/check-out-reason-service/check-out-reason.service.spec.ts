import { TestBed } from '@angular/core/testing';

import { CheckOutReasonService } from './check-out-reason.service';

describe('CheckOutReasonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckOutReasonService = TestBed.get(CheckOutReasonService);
    expect(service).toBeTruthy();
  });
});
