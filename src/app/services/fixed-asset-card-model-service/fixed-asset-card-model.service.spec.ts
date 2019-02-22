/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FixedAssetCardModelService } from './fixed-asset-card-model.service';

describe('Service: FixedAssetCardModel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FixedAssetCardModelService]
    });
  });

  it('should ...', inject([FixedAssetCardModelService], (service: FixedAssetCardModelService) => {
    expect(service).toBeTruthy();
  }));
});
