import { TestBed } from '@angular/core/testing';

import { FixedAssetCreateService } from './fixed-asset-create.service';

describe('FixedAssetCreateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FixedAssetCreateService = TestBed.get(FixedAssetCreateService);
    expect(service).toBeTruthy();
  });
});
