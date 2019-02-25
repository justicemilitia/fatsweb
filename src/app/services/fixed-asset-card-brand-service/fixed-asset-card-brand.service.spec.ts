/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FixedAssetCardBrandService } from './fixed-asset-card-brand.service';

describe('Service: FixedAssetCardBrand', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FixedAssetCardBrandService]
    });
  });

  it('should ...', inject([FixedAssetCardBrandService], (service: FixedAssetCardBrandService) => {
    expect(service).toBeTruthy();
  }));
});
