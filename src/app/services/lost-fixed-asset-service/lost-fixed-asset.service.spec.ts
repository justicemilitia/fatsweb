import { TestBed } from '@angular/core/testing';

import { LostFixedAssetService } from './lost-fixed-asset.service';

describe('LostFixedAssetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LostFixedAssetService = TestBed.get(LostFixedAssetService);
    expect(service).toBeTruthy();
  });
});
