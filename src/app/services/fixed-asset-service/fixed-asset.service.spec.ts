/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FixedAssetService } from './fixed-asset.service';

describe('Service: FixedAsset', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FixedAssetService]
    });
  });

  it('should ...', inject([FixedAssetService], (service: FixedAssetService) => {
    expect(service).toBeTruthy();
  }));
});
