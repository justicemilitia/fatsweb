/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FixedAssetCardCategoryService } from './fixed-asset-card-category.service';

describe('Service: FixedAssetCategory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FixedAssetCardCategoryService]
    });
  });

  it('should ...', inject([FixedAssetCardCategoryService], (service: FixedAssetCardCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
