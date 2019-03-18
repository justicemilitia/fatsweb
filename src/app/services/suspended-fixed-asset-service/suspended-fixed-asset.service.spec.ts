import { TestBed } from '@angular/core/testing';

import { SuspendedFixedAssetService } from './suspended-fixed-asset.service';

describe('SuspendedFixedAssetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuspendedFixedAssetService = TestBed.get(SuspendedFixedAssetService);
    expect(service).toBeTruthy();
  });
});
