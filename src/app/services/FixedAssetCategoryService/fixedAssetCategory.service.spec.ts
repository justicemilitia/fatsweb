/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FixedAssetCategoryService } from './fixedAssetCategory.service';

describe('Service: FixedAssetCategory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FixedAssetCategoryService]
    });
  });

  it('should ...', inject([FixedAssetCategoryService], (service: FixedAssetCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
