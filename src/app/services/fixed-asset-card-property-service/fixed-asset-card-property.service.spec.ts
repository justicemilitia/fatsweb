/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FixedAssetCardPropertyService } from './fixed-asset-card-property.service';

describe('Service: FixedAssetCardProperty', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FixedAssetCardPropertyService]
    });
  });

  it('should ...', inject([FixedAssetCardPropertyService], (service: FixedAssetCardPropertyService) => {
    expect(service).toBeTruthy();
  }));
});
