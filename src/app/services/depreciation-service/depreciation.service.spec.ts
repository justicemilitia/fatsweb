import { TestBed } from '@angular/core/testing';

import { DepreciationService } from './depreciation.service';

describe('DepreciationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DepreciationService = TestBed.get(DepreciationService);
    expect(service).toBeTruthy();
  });
});
