/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FixedAssetCardService } from './fixed-asset-card.service';

describe('Service: FixedAsset', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FixedAssetCardService]
    });
  });

  it('should ...', inject([FixedAssetCardService], (service: FixedAssetCardService) => {
    expect(service).toBeTruthy();
  }));
});
